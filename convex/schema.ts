import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  materials: defineTable({
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
  }).index("by_status", ["status"])
    .index("by_category", ["category"]),

  stockItems: defineTable({
    name: v.string(),
    quantity: v.number(),
    unit: v.union(v.literal("kg"), v.literal("unité"), v.literal("boîte"), v.literal("palette")),
    minQuantity: v.number(),
    location: v.string(),
    supplierId: v.optional(v.id("suppliers")),
  }),

  stockTransactions: defineTable({
    stockItemId: v.optional(v.id("stockItems")),
    materialId: v.optional(v.id("materials")),
    fromChantierId: v.optional(v.id("chantierSites")),
    toChantierId: v.optional(v.id("chantierSites")),
    chantierId: v.optional(v.id("chantierSites")), // Temporary legacy field
    type: v.union(v.literal("in"), v.literal("out"), v.literal("transfer")),
    quantity: v.number(),
    date: v.string(),
    responsibleEmail: v.optional(v.string()),
    notes: v.optional(v.string()),
  }).index("by_stockItemId", ["stockItemId"])
    .index("by_materialId", ["materialId"])
    .index("by_fromChantierId", ["fromChantierId"])
    .index("by_toChantierId", ["toChantierId"]),

  requests: defineTable({
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
    status: v.union(
      v.literal("En attente"),
      v.literal("Approuvée"),
      v.literal("Refusée"),
      v.literal("En cours"),
      v.literal("Terminée")
    ),
    notes: v.optional(v.string()),
    files: v.optional(v.array(v.id("_storage"))),
  }).index("by_status", ["status"]),

  requestComments: defineTable({
    requestId: v.id("requests"),
    content: v.string(),
  }).index("by_requestId", ["requestId"]),

  notifications: defineTable({
    content: v.string(),
    read: v.boolean(),
    type: v.string(),
    link: v.optional(v.string()),
  }),

  chantierSites: defineTable({
    name: v.string(),
    location: v.string(),
    status: v.string(),
  }),

  suppliers: defineTable({
    name: v.string(),
    contact: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    category: v.optional(v.string()),
  }),

  activityLogs: defineTable({
    action: v.string(),
    targetType: v.string(),
    targetId: v.optional(v.string()),
    timestamp: v.number(),
  }),

  users: defineTable({
    clerkId: v.string(),
    name: v.optional(v.string()),
    email: v.string(),
    role: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    tokenIdentifier: v.optional(v.string()),
  }).index("by_clerkId", ["clerkId"]),
});
