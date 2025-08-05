/**
 * Import transit stops from seed data
 * This script reads from the seeds/transit-stops.json file and imports into Convex
 */
import { ConvexHttpClient } from "convex/browser";
import fs from 'fs';
import path from 'path';

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL || "http://127.0.0.1:3210");

console.log("🌱 Importing transit stops from seed data...");

try {
  // Read seed data
  const seedPath = path.join(process.cwd(), 'seeds', 'transit-stops.json');
  const metadataPath = path.join(process.cwd(), 'seeds', 'transit-stops-metadata.json');

  if (!fs.existsSync(seedPath)) {
    console.error(`❌ Seed file not found: ${seedPath}`);
    console.log("Run 'node scripts/export-seed-data.js' first to create seed data.");
    process.exit(1);
  }

  const stopsData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  const metadata = fs.existsSync(metadataPath) 
    ? JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
    : null;

  console.log(`📖 Found ${stopsData.length} stops in seed data`);
  
  if (metadata) {
    console.log(`📅 Seed data from: ${new Date(metadata.exportedAt).toLocaleDateString()}`);
    console.log(`📊 ${metadata.description}`);
  }

  // Option to clear existing data
  const shouldClear = process.argv.includes('--clear');
  if (shouldClear) {
    console.log("🗑️  Clearing existing stops...");
    const result = await client.mutation("stops:clearAll");
    console.log(`✅ Deleted ${result.deleted} existing stops`);
  }

  // Import in batches
  const batchSize = 50;
  let imported = 0;
  let skipped = 0;

  for (let i = 0; i < stopsData.length; i += batchSize) {
    const batch = stopsData.slice(i, i + batchSize);
    
    console.log(`Importing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(stopsData.length / batchSize)}...`);
    
    for (const stop of batch) {
      try {
        await client.mutation("stops:create", stop);
        imported++;
      } catch (error) {
        if (error.message.includes('already exists')) {
          skipped++;
        } else {
          console.error(`Error importing ${stop.name}:`, error.message);
        }
      }
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n✅ Import complete!`);
  console.log(`  📥 Imported: ${imported} stops`);
  console.log(`  ⏭️  Skipped (duplicates): ${skipped} stops`);
  console.log(`  📊 Total processed: ${imported + skipped} stops`);

  // Verify the import
  const allStops = await client.query("stops:list");
  console.log(`\n🔍 Verification: Database now contains ${allStops.length} stops`);

} catch (error) {
  console.error("❌ Import failed:", error);
}
