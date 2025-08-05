import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Create a new transit stop
 */
export const create = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("train"), v.literal("tram")),
    city: v.string(),
    line: v.string(),
    distanceFromCity: v.number(),
    zone: v.optional(v.number()),
    coordinates: v.optional(v.object({
      lat: v.number(),
      lng: v.number(),
    })),
    accessibility: v.optional(v.boolean()),
    code: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if stop already exists to avoid duplicates
    const existing = await ctx.db
      .query("stops")
      .filter((q) => 
        q.and(
          q.eq(q.field("name"), args.name),
          q.eq(q.field("line"), args.line),
          q.eq(q.field("city"), args.city)
        )
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("stops", args);
  },
});

/**
 * List all stops
 */
export const list = query({
  args: {
    type: v.optional(v.union(v.literal("train"), v.literal("tram"))),
    city: v.optional(v.string()),
    line: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("stops");

    if (args.type) {
      query = query.filter((q) => q.eq(q.field("type"), args.type));
    }
    if (args.city) {
      query = query.filter((q) => q.eq(q.field("city"), args.city));
    }
    if (args.line) {
      query = query.filter((q) => q.eq(q.field("line"), args.line));
    }

    return await query.collect();
  },
});

/**
 * Get a specific stop by ID
 */
export const get = query({
  args: { id: v.id("stops") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Search stops by name
 */
export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const allStops = await ctx.db.query("stops").collect();
    return allStops.filter(stop => 
      stop.name.toLowerCase().includes(args.searchTerm.toLowerCase())
    );
  },
});

/**
 * Get stops near another stop (within same line/city for now)
 */
export const getNearby = query({
  args: { 
    stopId: v.id("stops"),
    maxDistance: v.optional(v.number()), // km from the reference stop
  },
  handler: async (ctx, args) => {
    const referenceStop = await ctx.db.get(args.stopId);
    if (!referenceStop) return [];

    const stops = await ctx.db
      .query("stops")
      .filter((q) => 
        q.and(
          q.eq(q.field("city"), referenceStop.city),
          q.eq(q.field("line"), referenceStop.line),
          q.neq(q.field("_id"), args.stopId)
        )
      )
      .collect();

    if (args.maxDistance) {
      return stops.filter(stop => 
        Math.abs(stop.distanceFromCity - referenceStop.distanceFromCity) <= args.maxDistance!
      );
    }

    return stops;
  },
});

/**
 * Clear all stops (useful for re-importing)
 */
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const stops = await ctx.db.query("stops").collect();
    for (const stop of stops) {
      await ctx.db.delete(stop._id);
    }
    return { deleted: stops.length };
  },
});
