#!/bin/bash

# Setup script for populating transit data

echo "🚀 Setting up transit data..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    bun install
fi

# Check if Convex is running by trying to connect to the port
if ! curl -s -f http://127.0.0.1:3210 > /dev/null 2>&1; then
    echo "❌ Convex server not running!"
    echo "Please start Convex with: make up"
    echo "Or run: cd packages/backend && npx convex dev"
    exit 1
fi

echo "✅ Convex server is running"

# Check if seed data exists
if [ -f "seeds/transit-stops.json" ]; then
    echo "� Found existing seed data"
    echo "🌱 Importing from seed files..."
    bun run seed:import
else
    echo "📡 No seed data found, importing from web sources..."
    bun run transit:import
    echo "💾 Exporting to seed files for future use..."
    bun run seed:export
fi

echo ""
echo "✅ Transit data setup complete!"
echo "📊 Use 'bun run data:check' to verify the data"
