# TaGo - Makefile untuk mempermudah manajemen Docker

.PHONY: help dev prod build stop clean logs install

# Default target
help:
	@echo "TaGo - Docker Management Commands"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start development environment"
	@echo "  make dev-simple   - Start simplified dev environment (app + db only)"
	@echo "  make install      - Install dependencies"
	@echo ""
	@echo "Production:"
	@echo "  make prod         - Start production environment"
	@echo "  make build        - Build production Docker image"
	@echo ""
	@echo "Management:"
	@echo "  make stop         - Stop all containers"
	@echo "  make clean        - Remove all containers and volumes"
	@echo "  make logs         - View logs from all services"
	@echo "  make logs-app     - View app logs only"
	@echo "  make logs-db      - View database logs only"
	@echo ""
	@echo "Database:"
	@echo "  make db-shell     - Open PostgreSQL shell"
	@echo "  make db-migrate   - Run database migrations"
	@echo ""
	@echo "Utilities:"
	@echo "  make ps           - Show running containers"
	@echo "  make restart      - Restart all services"

# Development
dev:
	docker-compose --profile dev up -d
	@echo "✅ Development environment started!"
	@echo "📱 App: http://localhost:5173"
	@echo "🗄️  Database: localhost:5432"
	@echo "🎨 Supabase Studio: http://localhost:3000"
	@echo "🔐 Auth: http://localhost:9999"

dev-simple:
	docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ Simplified development environment started!"
	@echo "📱 App: http://localhost:5173"
	@echo "🗄️  Database: localhost:5432"

install:
	docker-compose run --rm app-dev pnpm install

# Production
prod:
	docker-compose --profile prod up -d
	@echo "✅ Production environment started!"
	@echo "📱 App: http://localhost"

build:
	docker-compose build app-prod
	@echo "✅ Production image built!"

# Management
stop:
	docker-compose --profile dev --profile prod down
	@echo "⏹️  All containers stopped"

clean:
	docker-compose --profile dev --profile prod down -v
	@echo "🧹 All containers and volumes removed"

logs:
	docker-compose --profile dev --profile prod logs -f

logs-app:
	docker-compose logs -f app-dev app-prod 2>/dev/null || docker-compose logs -f app-dev || docker-compose logs -f app-prod

logs-db:
	docker-compose logs -f supabase-db

# Database
db-shell:
	docker exec -it tago-supabase-db psql -U postgres -d postgres

db-migrate:
	@echo "Running migrations..."
	docker exec -it tago-supabase-db psql -U postgres -d postgres -f /docker-entrypoint-initdb.d/init.sql

# Utilities
ps:
	docker-compose ps

restart:
	docker-compose --profile dev --profile prod restart
	@echo "🔄 Services restarted"

# Quick commands
up: dev
down: stop
