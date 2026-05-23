import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("requests").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("requests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    type: v.union(v.literal("material"), v.literal("stock"), v.literal("maintenance"), v.literal("approvisionnement")),
    chantier: v.optional(v.string()),
    demandeur: v.optional(v.string()),
    dateLivraison: v.optional(v.string()),
    natureAchat: v.optional(v.string()),
    typeAchat: v.optional(v.string()),
    articles: v.optional(
      v.array(
        v.object({
          code: v.string(),
          designation: v.string(),
          quantity: v.number(),
          unit: v.string(),
        })
      )
    ),
    urgency: v.optional(v.union(v.literal("Faible"), v.literal("Moyenne"), v.literal("Urgente"))),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const requestId = await ctx.db.insert("requests", {
      type: args.type,
      chantier: args.chantier,
      demandeur: args.demandeur,
      dateLivraison: args.dateLivraison,
      natureAchat: args.natureAchat,
      typeAchat: args.typeAchat,
      articles: args.articles,
      urgency: args.urgency ?? "Moyenne",
      status: "En attente",
      notes: args.notes,
    });

    await ctx.db.insert("activityLogs", {
      action: "create_request",
      targetType: "request",
      targetId: requestId,
      timestamp: Date.now(),
    });

    return requestId;
  },
});

export const update = mutation({
  args: {
    id: v.id("requests"),
    type: v.optional(v.union(v.literal("material"), v.literal("stock"), v.literal("maintenance"), v.literal("approvisionnement"))),
    chantier: v.optional(v.string()),
    demandeur: v.optional(v.string()),
    dateLivraison: v.optional(v.string()),
    natureAchat: v.optional(v.string()),
    typeAchat: v.optional(v.string()),
    articles: v.optional(
      v.array(
        v.object({
          code: v.string(),
          designation: v.string(),
          quantity: v.number(),
          unit: v.string(),
        })
      )
    ),
    urgency: v.optional(v.union(v.literal("Faible"), v.literal("Moyenne"), v.literal("Urgente"))),
    status: v.optional(v.union(
      v.literal("En attente"),
      v.literal("Approuvée"),
      v.literal("Refusée"),
      v.literal("En cours"),
      v.literal("Terminée")
    )),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);

    await ctx.db.insert("activityLogs", {
      action: "update_request",
      targetType: "request",
      targetId: id,
      timestamp: Date.now(),
    });
  },
});
