import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing data (optional, but good for a clean seed)
    const materials = await ctx.db.query("materials").collect();
    for (const m of materials) await ctx.db.delete(m._id);
    
    const suppliers = await ctx.db.query("suppliers").collect();
    for (const s of suppliers) await ctx.db.delete(s._id);
    
    const sites = await ctx.db.query("chantierSites").collect();
    for (const site of sites) await ctx.db.delete(site._id);

    const stockItems = await ctx.db.query("stockItems").collect();
    for (const item of stockItems) await ctx.db.delete(item._id);

    const transactions = await ctx.db.query("stockTransactions").collect();
    for (const t of transactions) await ctx.db.delete(t._id);

    // 1. Seed Suppliers
    const supplier1Id = await ctx.db.insert("suppliers", {
      name: "BatiMat",
      contact: "Jean Dupont",
      email: "contact@batimat.fr",
      phone: "01 23 45 67 89",
      category: "Matériaux",
    });

    const supplier2Id = await ctx.db.insert("suppliers", {
      name: "Engins Pro",
      contact: "Marc Lefebvre",
      email: "service@enginspro.com",
      phone: "02 34 56 78 90",
      category: "Engins",
    });

    const supplier3Id = await ctx.db.insert("suppliers", {
      name: "ElecDistrib",
      contact: "Sophie Martin",
      email: "info@elecdistrib.fr",
      phone: "03 45 67 89 01",
      category: "Électricité",
    });

    // 2. Seed Chantier Sites
    const site1Id = await ctx.db.insert("chantierSites", {
      name: "Résidence Les Pins",
      location: "Paris, 15ème",
      status: "En cours",
    });

    const site2Id = await ctx.db.insert("chantierSites", {
      name: "Extension Hôpital",
      location: "Lyon, Bron",
      status: "Planifié",
    });

    const site3Id = await ctx.db.insert("chantierSites", {
      name: "Rénovation Mairie",
      location: "Marseille, Vieux Port",
      status: "En cours",
    });

    // 3. Seed Materials
    const testMaterials = [
      {
        name: "Pelle hydraulique CAT 320",
        code: "MAT-001",
        quantity: 2,
        category: "Engins",
        status: "Disponible" as const,
        purchaseDate: "2023-05-15",
        notes: "Maintenance prévue le mois prochain",
        supplierId: supplier2Id,
      },
      {
        name: "Bétonnière 350L",
        code: "MAT-002",
        quantity: 5,
        category: "Petit matériel",
        status: "En utilisation" as const,
        purchaseDate: "2024-01-10",
        chantierId: site1Id,
        supplierId: supplier1Id,
      },
      {
        name: "Échafaudage tubulaire 100m2",
        code: "MAT-003",
        quantity: 1,
        category: "Équipement",
        status: "Disponible" as const,
        purchaseDate: "2023-11-20",
        supplierId: supplier1Id,
      },
      {
        name: "Marteau-piqueur Bosch",
        code: "MAT-004",
        quantity: 8,
        category: "Outillage",
        status: "En maintenance" as const,
        purchaseDate: "2024-02-05",
        supplierId: supplier1Id,
      },
      {
        name: "Groupe électrogène 5kVA",
        code: "MAT-005",
        quantity: 3,
        category: "Énergie",
        status: "Hors service" as const,
        purchaseDate: "2022-08-12",
        notes: "Moteur à remplacer",
        supplierId: supplier3Id,
      },
      {
        name: "Grue à tour Potain GT-20",
        code: "MAT-006",
        quantity: 1,
        category: "Engins",
        status: "En utilisation" as const,
        purchaseDate: "2022-03-20",
        chantierId: site3Id,
        supplierId: supplier2Id,
      },
      {
        name: "Camion benne Volvo FMX",
        code: "MAT-007",
        quantity: 3,
        category: "Transport",
        status: "Disponible" as const,
        purchaseDate: "2023-09-10",
        supplierId: supplier2Id,
      },
      {
        name: "Perceuse à percussion Makita",
        code: "MAT-008",
        quantity: 12,
        category: "Outillage",
        status: "Disponible" as const,
        purchaseDate: "2024-04-01",
        supplierId: supplier1Id,
      }
    ];

    for (const material of testMaterials) {
      await ctx.db.insert("materials", material);
    }

    // 4. Seed Stock Items
    const stockItemsData = [
      {
        name: "Ciment gris 35kg",
        quantity: 50,
        unit: "unité" as const,
        minQuantity: 10,
        location: "Dépôt A",
        supplierId: supplier1Id,
      },
      {
        name: "Sable de rivière",
        quantity: 5,
        unit: "palette" as const,
        minQuantity: 1,
        location: "Dépôt B",
        supplierId: supplier1Id,
      },
      {
        name: "Câble électrique 3G1.5",
        quantity: 200,
        unit: "unité" as const,
        minQuantity: 50,
        location: "Dépôt A",
        supplierId: supplier3Id,
      }
    ];

    // 5. Seed Stock Transactions
    const stockItemsFromDb = await ctx.db.query("stockItems").collect();
    const ciment = stockItemsFromDb.find(i => i.name.includes("Ciment"));
    const sable = stockItemsFromDb.find(i => i.name.includes("Sable"));

    if (ciment && site1Id) {
      await ctx.db.insert("stockTransactions", {
        stockItemId: ciment._id,
        toChantierId: site1Id,
        type: "out",
        quantity: 10,
        date: new Date().toISOString(),
        responsibleEmail: "admin@construx.com",
        notes: "Sortie pour fondations bâtiment A",
      });
      await ctx.db.patch(ciment._id, { quantity: ciment.quantity - 10 });
    }

    if (sable && site3Id) {
      await ctx.db.insert("stockTransactions", {
        stockItemId: sable._id,
        toChantierId: site3Id,
        type: "out",
        quantity: 2,
        date: new Date().toISOString(),
        responsibleEmail: "admin@construx.com",
        notes: "Sable pour mortier rénovation façade",
      });
      await ctx.db.patch(sable._id, { quantity: sable.quantity - 2 });
    }

    return "Successfully seeded materials, suppliers, sites, stock items, and transactions.";
  },
});
