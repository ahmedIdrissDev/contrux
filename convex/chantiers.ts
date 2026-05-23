import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("chantierSites").collect();
  },
});

export const getById = query({
  args: { id: v.id("chantierSites") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    location: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chantierSites", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("chantierSites"),
    name: v.optional(v.string()),
    location: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("chantierSites") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
