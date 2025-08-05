import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),
  
  stops: defineTable({
    name: v.string(),
    type: v.union(v.literal("train"), v.literal("tram")),
    city: v.string(), // Melbourne, Perth, etc.
    line: v.string(), // Line name (e.g., "Alamein", "Fremantle")
    distanceFromCity: v.number(), // Distance from city center in km
    zone: v.optional(v.number()), // Transit zone
    coordinates: v.optional(v.object({
      lat: v.number(),
      lng: v.number(),
    })),
    accessibility: v.optional(v.boolean()), // Wheelchair accessible
    code: v.optional(v.string()), // Stop code if available
  }),
  
  cafes: defineTable({
    name: v.string(),
    location: v.object({
      type: v.union(v.literal("train"), v.literal("tram")),
      stopId: v.id("stops"),
    }),
    bestHours: v.array(v.object({
      from: v.string(),
      to: v.string(),
    })),
    food: v.array(v.string()),
    price: v.union(v.literal("$"), v.literal("$$"), v.literal("$$$")),
    idealWork: v.array(v.union(
      v.literal("reading"),
      v.literal("programming"),
      v.literal("sketching"),
      v.literal("work")
    )),
    amenities: v.array(v.union(
      v.literal("water"),
      v.literal("wifi"),
      v.literal("power"),
      v.literal("desk"),
      v.literal("bathroom")
    )),
    openingHours: v.object({
      mon: v.string(),
      tue: v.string(),
      wed: v.string(),
      thu: v.string(),
      fri: v.string(),
      sat: v.string(),
      sun: v.string(),
    }),
    createdBy: v.string(),
    createdAt: v.string(),
  }),
  
  users: defineTable({
    userId: v.string(),
    homeStopId: v.id("stops"),
    favorites: v.array(v.id("cafes")),
  }),
  
  visits: defineTable({
    userId: v.string(),
    cafeId: v.id("cafes"),
    timestamp: v.string(),
  }),
});
