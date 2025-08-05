/**
 * Quick script to check what data is in the stops collection
 */
import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL || "http://127.0.0.1:3210");

console.log("🔍 Checking stops data...");

try {
  // Get all stops
  const allStops = await client.query("stops:list");
  console.log(`\n📊 Total stops: ${allStops.length}`);

  // Group by city and type
  const groupedByCity = allStops.reduce((acc, stop) => {
    const key = `${stop.city} ${stop.type}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(stop);
    return acc;
  }, {});

  console.log("\n📍 Breakdown by city and type:");
  for (const [group, stops] of Object.entries(groupedByCity)) {
    console.log(`  ${group}: ${stops.length} stops`);
  }

  // Group by line
  const groupedByLine = allStops.reduce((acc, stop) => {
    if (!acc[stop.line]) acc[stop.line] = [];
    acc[stop.line].push(stop);
    return acc;
  }, {});

  console.log("\n🚇 Breakdown by line:");
  for (const [line, stops] of Object.entries(groupedByLine)) {
    console.log(`  ${line}: ${stops.length} stops`);
  }

  // Show some sample stops
  console.log("\n📋 Sample stops:");
  const sampleStops = allStops.slice(0, 5);
  for (const stop of sampleStops) {
    console.log(`  • ${stop.name} (${stop.type}, ${stop.line}, ${stop.city})`);
  }

} catch (error) {
  console.error("❌ Error:", error);
}
