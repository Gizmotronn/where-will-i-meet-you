import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Create or get user profile
export const createOrGetUser = mutation({
  args: { userId: v.string(), homeStopId: v.optional(v.id("stops")) },
  handler: async (ctx, args) => {
    // Check if user exists
    const existing = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .first();
    
    if (existing) return existing;
    
    // Create new user
    const userDoc: { userId: string; favorites: Id<"cafes">[]; homeStopId?: Id<"stops"> } = {
      userId: args.userId,
      favorites: [],
      ...(args.homeStopId !== undefined ? { homeStopId: args.homeStopId } : {}),
    };
    // Only include homeStopId if it is defined, otherwise omit it
    return await ctx.db.insert("users", userDoc as any);
  },
});