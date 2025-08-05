# Kafe Development Environment Makefile

.PHONY: up down status install clean help

# Default target
help:
	@echo "Kafe Development Environment"
	@echo ""
	@echo "Available commands:"
	@echo "  make up      - Start the entire development environment"
	@echo "  make down    - Stop all running services"
	@echo "  make status  - Check status of running services"
	@echo "  make install - Install all dependencies"
	@echo "  make clean   - Clean build artifacts and node_modules"
	@echo "  make help    - Show this help message"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	bun install

# Start the entire development environment
up: install
	@echo "🚀 Starting Kafe development environment..."
	@echo "   - Backend (Convex): http://127.0.0.1:3210"
	@echo "   - Frontend (Web): http://localhost:3001 (or next available port)"
	@echo "   - Convex Dashboard: http://127.0.0.1:6790/?d=anonymous-kafe"
	@echo ""
	@echo "Press Ctrl+C to stop all services"
	@echo ""
	bun run dev

# Stop all services
down:
	@echo "🛑 Stopping Kafe development environment..."
	@-pkill -f "convex dev" 2>/dev/null || true
	@-pkill -f "vite --port" 2>/dev/null || true
	@-pkill -f "convex-local-backend" 2>/dev/null || true
	@-pkill -f "node.*setup.js" 2>/dev/null || true
	@echo "✅ All services stopped"

# Check status of services
status:
	@echo "📊 Checking service status..."
	@echo ""
	@echo "Convex Backend (port 3210):"
	@if lsof -i :3210 >/dev/null 2>&1; then echo "  ✅ Running"; else echo "  ❌ Not running"; fi
	@echo ""
	@echo "Web Frontend (ports 3001-3010):"
	@for port in 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010; do \
		if lsof -i :$$port >/dev/null 2>&1; then \
			echo "  ✅ Running on port $$port"; \
			break; \
		fi; \
	done || echo "  ❌ Not running"
	@echo ""
	@echo "Convex Dashboard (port 6790):"
	@if lsof -i :6790 >/dev/null 2>&1; then echo "  ✅ Running"; else echo "  ❌ Not running"; fi
	@echo ""
	@echo "Active Convex processes:"
	@pgrep -fl "convex|kafe" || echo "  No Convex processes found"

# Clean build artifacts and dependencies
clean:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf node_modules
	@rm -rf apps/web/node_modules
	@rm -rf packages/backend/node_modules
	@rm -rf apps/web/dist
	@rm -rf apps/web/dev-dist
	@rm -rf .convex
	@rm -rf packages/backend/.convex
	@echo "✅ Cleanup complete"

# Development helpers
dev-backend:
	@echo "🚀 Starting backend only..."
	cd packages/backend && bun run dev

dev-web:
	@echo "🚀 Starting web frontend only..."
	cd apps/web && bun run dev

# Setup Convex for first time
setup:
	@echo "⚙️  Setting up Convex for first time..."
	@echo "This will run the initial Convex setup."
	bun run dev:setup
