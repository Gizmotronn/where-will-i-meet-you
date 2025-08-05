/**
 * Check and display current transit data in the database
 */
import { ConvexHttpClient } from "convex/browser";
import { api } from "../packages/backend/convex/_generated/api";

interface TransitStop {
  name: string;
  type: "train" | "tram";
  city: string;
  line: string;
  distanceFromCity: number;
  zone: number;
  coordinates?: { lat: number; lng: number };
  accessibility?: boolean;
}

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL || "http://127.0.0.1:3210");

async function checkData(): Promise<void> {
  console.log("🔍 Checking stops data...");

  try {
    // Get all stops
    const allStops = await client.query(api.stops.list, {});
    
    console.log('');
    console.log(`📊 Total stops: ${allStops.length}`);

    // Group by city and type
    console.log('');
    console.log('📍 Breakdown by city and type:');
    const cityTypeBreakdown = allStops.reduce((acc, stop) => {
      const key = `${stop.city} ${stop.type}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(cityTypeBreakdown)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([key, count]) => {
        console.log(`  ${key}: ${count} stops`);
      });

    // Group by line
    console.log('');
    console.log('🚇 Breakdown by line:');
    const lineBreakdown = allStops.reduce((acc, stop) => {
      acc[stop.line] = (acc[stop.line] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(lineBreakdown)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([line, count]) => {
        console.log(`  ${line}: ${count} stops`);
      });

    // Show sample stops
    console.log('');
    console.log('📋 Sample stops:');
    allStops.slice(0, 5).forEach(stop => {
      console.log(`  • ${stop.name} (${stop.type}, ${stop.line}, ${stop.city})`);
    });

  } catch (error: any) {
    console.error('❌ Data check failed:', error.message || error);
    process.exit(1);
  }
}

// Run the check
checkData().catch(console.error);
