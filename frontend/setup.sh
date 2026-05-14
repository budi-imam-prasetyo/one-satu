#!/bin/bash

# TaGo - Setup Script
# This script helps you set up the development environment

set -e

echo "🚀 TaGo Setup Script"
echo "===================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"
echo ""

# Check if .env file exists
if [ -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping .env creation..."
    else
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created from .env.example${NC}"
    fi
else
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created from .env.example${NC}"
fi

echo ""
echo "📝 Please configure your .env file with the following:"
echo "  - VITE_API_BASE_URL (URL backend API)"
echo "  - GOOGLE_CLIENT_ID (if using Google OAuth)"
echo "  - GOOGLE_CLIENT_SECRET (if using Google OAuth)"
echo ""

read -p "Press enter to continue after updating .env file..."

echo ""
echo "🔍 Checking for running containers..."

# Stop any running containers
if docker compose ps -q | grep -q .; then
    echo -e "${YELLOW}⚠️  Found running containers. Stopping them...${NC}"
    docker compose --profile dev --profile prod down
fi

echo ""
echo "🏗️  Building Docker images..."
docker compose build

echo ""
echo "📦 Do you want to:"
echo "  1) Start development environment"
echo "  2) Skip starting containers"
read -p "Enter your choice (1/2): " -n 1 -r
echo

case $REPLY in
    1)
        echo ""
        echo "🚀 Starting development environment..."
        docker compose --profile dev up -d
        echo ""
        echo -e "${GREEN}✅ Development environment is running!${NC}"
        echo ""
        echo "📱 Access your application:"
        echo "  - App: http://localhost:5173"
        ;;
    2)
        echo ""
        echo "Skipping container startup..."
        echo "You can start manually with:"
        echo "  make dev"
        ;;
    *)
        echo ""
        echo -e "${YELLOW}Invalid choice. Skipping container startup.${NC}"
        ;;
esac

echo ""
echo "📚 Useful commands:"
echo "  make help    - Show all available commands"
echo "  make logs    - View all logs"
echo "  make stop    - Stop all containers"
echo "  make clean   - Remove all containers and volumes"
echo ""
echo -e "${GREEN}✨ Setup complete!${NC}"
