import { query, mutation } from "./_generated/server"
import { v } from 'convex/values'

export const getAll = query({
    handler: async (ctx) => {
        return await ctx.db.query("cafes").collect();
    },
});