#!/bin/bash

# Setup script for running the transit data import

echo "🚀 Setting up transit data import..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    bun install
fi

# Check if Convex is running
if ! curl -s http://127.0.0.1:3210 > /dev/null; then
    echo "❌ Convex server not running!"
    echo "Please start Convex with: make up"
    echo "Or run: bun run dev:convex"
    exit 1
fi

echo "✅ Convex server is running"

# Make sure we have the environment variables
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local..."
    echo "VITE_CONVEX_URL=http://127.0.0.1:3210" > .env.local
fi

# Run the import script
echo "🚛 Starting transit data import..."
export VITE_CONVEX_URL=http://127.0.0.1:3210
node scripts/import-transit-data.js

echo ""
echo "🎉 Transit data import complete!"
echo ""
echo "Your database now contains comprehensive transit data for:"
echo "• Melbourne trains (3 complete lines + first 6 stations of 12 other lines)"
echo "• Perth Transperth (all 8 lines with 85+ stations)"
echo "• Melbourne trams (routes 109 & 48 with major stops)"
echo ""
echo "You can now test your app with real-world transit data!"
