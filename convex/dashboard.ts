import { query } from "./_generated/server";

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const materials = await ctx.db.query("materials").collect();
    const stockItems = await ctx.db.query("stockItems").collect();
    const requests = await ctx.db.query("requests").collect();

    const stockAlerts = stockItems.filter(item => item.quantity <= item.minQuantity).length;
    const pendingRequests = requests.filter(req => req.status === "En attente").length;
    const activeMaterials = materials.filter(m => m.status === "En utilisation").length;

    return {
      totalMaterials: materials.length,
      activeMaterials,
      stockAlerts,
      pendingRequests,
      totalStockItems: stockItems.length,
    };
  },
});

export const getRecentActivity = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("activityLogs").order("desc").take(10);
  },
});
