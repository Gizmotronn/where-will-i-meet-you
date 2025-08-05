# kafe

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Router, Convex, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Convex** - Reactive backend-as-a-service platform
- **PWA** - Progressive Web App support

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Convex Setup

This project uses Convex as a backend. You'll need to set up Convex before running the app:

```bash
bun dev:setup
```

Follow the prompts to create a new Convex project and connect it to your application.

## Development

To start the development environment:

**Option 1: Use the Makefile (Recommended)**
```bash
make up
```

**Option 2: Start services individually**
```bash
# Terminal 1 - Start Convex backend
cd packages/backend && npx convex dev

# Terminal 2 - Start web frontend  
cd apps/web && bun dev
```

**Option 3: Use package.json scripts**
```bash
bun dev
```

Your application will be available at:
- **Frontend**: [http://localhost:3001](http://localhost:3001)
- **Convex Backend**: [http://127.0.0.1:3210](http://127.0.0.1:3210)
- **Convex Dashboard**: [http://127.0.0.1:6790/?d=anonymous-kafe](http://127.0.0.1:6790/?d=anonymous-kafe)

To stop all services:
```bash
make down
```

## Populate with Transit Data

Once your development environment is running, you can populate the database with real Melbourne and Perth transit data:

```bash
./scripts/setup-transit.sh
```

This will import 300+ real transit stops including:
- Melbourne train stations (Alamein, Williamstown, Glen Waverley lines + first 6 stations of other lines)
- Perth Transperth metro stations (all lines)
- Melbourne tram routes 109 and 48



## Project Structure

```
kafe/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
├── packages/
│   └── backend/     # Convex backend functions and schema
```

## Available Scripts

- `make up`: Start the entire development environment (Convex + Web)
- `make down`: Stop all running services  
- `make status`: Check status of all services
- `make install`: Install all dependencies
- `bun dev`: Start all applications in development mode
- `bun build`: Build all applications
- `bun dev:web`: Start only the web application
- `bun dev:setup`: Setup and configure your Convex project
- `bun check-types`: Check TypeScript types across all apps
- `cd apps/web && bun generate-pwa-assets`: Generate PWA assets

## Troubleshooting

**Convex Connection Issues:**
If you see `ERR_CONNECTION_REFUSED` errors:
1. Make sure Convex is running: `make status`
2. Restart services: `make down && make up`

**PWA Manifest Errors:**
If you see manifest syntax errors, try regenerating PWA assets:
```bash
cd apps/web && bun generate-pwa-assets
```
