import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("stockItems").collect();
  },
});

export const getAlerts = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("stockItems").collect();
    return items.filter((item) => item.quantity <= item.minQuantity);
  },
});

export const getHistory = query({
  args: { stockItemId: v.optional(v.id("stockItems")), materialId: v.optional(v.id("materials")) },
  handler: async (ctx, args) => {
    let transactions;
    if (args.stockItemId) {
      transactions = await ctx.db
        .query("stockTransactions")
        .withIndex("by_stockItemId", (q) => q.eq("stockItemId", args.stockItemId!))
        .order("desc")
        .collect();
    } else if (args.materialId) {
      transactions = await ctx.db
        .query("stockTransactions")
        .withIndex("by_materialId", (q) => q.eq("materialId", args.materialId!))
        .order("desc")
        .collect();
    } else {
      transactions = await ctx.db.query("stockTransactions").order("desc").collect();
    }

    return await Promise.all(
      transactions.map(async (t) => {
        const item = t.stockItemId ? await ctx.db.get(t.stockItemId) : null;
        const material = t.materialId ? await ctx.db.get(t.materialId) : null;
        const fromChantier = t.fromChantierId ? await ctx.db.get(t.fromChantierId) : null;
        const toChantier = t.toChantierId ? await ctx.db.get(t.toChantierId) : null;
        
        return {
          ...t,
          itemName: item?.name || material?.name || "Inconnu",
          fromName: fromChantier?.name || "Dépôt Central",
          toName: toChantier?.name || "Dépôt Central",
        };
      })
    );
  },
});

export const recordTransaction = mutation({
  args: {
    stockItemId: v.optional(v.id("stockItems")),
    materialId: v.optional(v.id("materials")),
    fromChantierId: v.optional(v.id("chantierSites")),
    toChantierId: v.optional(v.id("chantierSites")),
    type: v.union(v.literal("in"), v.literal("out"), v.literal("transfer")),
    quantity: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { stockItemId, materialId, fromChantierId, toChantierId, type, quantity, notes } = args;
    
    const identity = await ctx.auth.getUserIdentity();
    const responsibleEmail = identity 
      ? (identity.email || identity.name || "Utilisateur sans email") 
      : "Non authentifié";

    if (!stockItemId && !materialId) {
      throw new Error("Either stockItemId or materialId must be provided");
    }

    // Update quantities based on movement
    // 'in' to depot: quantity increases in depot
    // 'out' from depot: quantity decreases in depot
    // 'transfer' between chantiers: quantity in depot doesn't change
    
    if (stockItemId) {
      const item = await ctx.db.get(stockItemId);
      if (!item) throw new Error("Stock item not found");
      
      let newQuantity = item.quantity;
      if (type === "in") newQuantity += quantity;
      else if (type === "out") newQuantity -= quantity;
      // Transfer between chantiers doesn't affect main depot quantity if we assume main stock tracks depot
      
      if (newQuantity < 0) throw new Error("Insufficient stock in depot");
      await ctx.db.patch(stockItemId, { quantity: newQuantity });
      
      if (newQuantity <= item.minQuantity) {
        await ctx.db.insert("notifications", {
          content: `Alerte stock bas: ${item.name} (${newQuantity} ${item.unit} restants)`,
          read: false,
          type: "stock_alert",
          link: `/dashboard/stock`,
        });
      }
    } else if (materialId) {
      const material = await ctx.db.get(materialId);
      if (!material) throw new Error("Material not found");
      
      let newQuantity = material.quantity;
      if (type === "in") newQuantity += quantity;
      else if (type === "out") newQuantity -= quantity;
      
      if (newQuantity < 0) throw new Error("Insufficient quantity for material");
      await ctx.db.patch(materialId, { quantity: newQuantity });

      // If it's an 'out' or 'transfer', and we move to a specific chantier, update the material's current chantier
      if ((type === "out" || type === "transfer") && toChantierId) {
        await ctx.db.patch(materialId, { chantierId: toChantierId });
      } else if (type === "in") {
        // Returned to depot
        await ctx.db.patch(materialId, { chantierId: undefined });
      }
    }

    await ctx.db.insert("stockTransactions", {
      stockItemId,
      materialId,
      fromChantierId,
      toChantierId,
      type,
      quantity,
      date: new Date().toISOString(),
      responsibleEmail,
      notes,
    });
  },
});
