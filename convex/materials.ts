import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("materials").collect();
  },
});

export const getByChantier = query({
  args: { chantierId: v.id("chantierSites") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("materials")
      .filter((q) => q.eq(q.field("chantierId"), args.chantierId))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("materials") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    quantity: v.number(),
    category: v.string(),
    status: v.union(
      v.literal("Disponible"),
      v.literal("En utilisation"),
      v.literal("En maintenance"),
      v.literal("Hors service")
    ),
    chantierId: v.optional(v.id("chantierSites")),
    purchaseDate: v.string(),
    supplierId: v.optional(v.id("suppliers")),
    notes: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const materialId = await ctx.db.insert("materials", args);
    
    await ctx.db.insert("activityLogs", {
      action: "create_material",
      targetType: "material",
      targetId: materialId,
      timestamp: Date.now(),
    });

    return materialId;
  },
});

export const update = mutation({
  args: {
    id: v.id("materials"),
    name: v.optional(v.string()),
    code: v.optional(v.string()),
    quantity: v.optional(v.number()),
    category: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("Disponible"),
      v.literal("En utilisation"),
      v.literal("En maintenance"),
      v.literal("Hors service")
    )),
    chantierId: v.optional(v.id("chantierSites")),
    purchaseDate: v.optional(v.string()),
    supplierId: v.optional(v.id("suppliers")),
    notes: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);

    await ctx.db.insert("activityLogs", {
      action: "update_material",
      targetType: "material",
      targetId: id,
      timestamp: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("materials") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);

    await ctx.db.insert("activityLogs", {
      action: "delete_material",
      targetType: "material",
      targetId: args.id,
      timestamp: Date.now(),
    });
  },
});
