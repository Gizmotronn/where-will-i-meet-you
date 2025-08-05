/**
 * Export current stops data to a JSON file for version control
 */
import { ConvexHttpClient } from "convex/browser";
import fs from 'fs';
import path from 'path';

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL || "http://127.0.0.1:3210");

console.log("📤 Exporting stops data to JSON...");

try {
  // Get all stops
  const allStops = await client.query("stops:list");
  console.log(`Found ${allStops.length} stops to export`);

  // Remove the _id and _creationTime fields for cleaner seed data
  const cleanStops = allStops.map(stop => {
    const { _id, _creationTime, ...cleanStop } = stop;
    return cleanStop;
  });

  // Sort by city, type, line, and distance for consistent ordering
  cleanStops.sort((a, b) => {
    if (a.city !== b.city) return a.city.localeCompare(b.city);
    if (a.type !== b.type) return a.type.localeCompare(b.type);
    if (a.line !== b.line) return a.line.localeCompare(b.line);
    return a.distanceFromCity - b.distanceFromCity;
  });

  // Create seeds directory if it doesn't exist
  const seedsDir = path.join(process.cwd(), 'seeds');
  if (!fs.existsSync(seedsDir)) {
    fs.mkdirSync(seedsDir, { recursive: true });
  }

  // Write to JSON file
  const outputPath = path.join(seedsDir, 'transit-stops.json');
  fs.writeFileSync(outputPath, JSON.stringify(cleanStops, null, 2));

  console.log(`✅ Exported ${cleanStops.length} stops to: ${outputPath}`);

  // Create metadata file
  const metadata = {
    exportedAt: new Date().toISOString(),
    totalStops: cleanStops.length,
    breakdown: {
      cities: [...new Set(cleanStops.map(s => s.city))],
      types: [...new Set(cleanStops.map(s => s.type))],
      lines: [...new Set(cleanStops.map(s => s.line))].length
    },
    description: "Complete Melbourne and Perth transit stops data including train lines and tram routes"
  };

  const metadataPath = path.join(seedsDir, 'transit-stops-metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

  console.log(`📋 Metadata written to: ${metadataPath}`);
  console.log(`\n📊 Export summary:`);
  console.log(`  Cities: ${metadata.breakdown.cities.join(', ')}`);
  console.log(`  Types: ${metadata.breakdown.types.join(', ')}`);
  console.log(`  Lines: ${metadata.breakdown.lines}`);

} catch (error) {
  console.error("❌ Export failed:", error);
}
