#!/bin/bash

# LiquidOS Setup Script

set -e

echo "🌊 Setting up LiquidOS - Dynamic Generative Operating Environment"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📋 Creating environment file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your OpenAI API key and other configuration"
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p data/postgres
mkdir -p data/redis

# Build and start services
echo "🔧 Building and starting services..."
docker-compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."

services=("postgres" "redis" "auth-service" "generation-service" "api-gateway" "frontend")
for service in "${services[@]}"; do
    if docker-compose ps "$service" | grep -q "Up (healthy)"; then
        echo "✅ $service is healthy"
    else
        echo "⚠️  $service may not be fully ready"
    fi
done

echo ""
echo "🎉 LiquidOS setup complete!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 API Gateway: http://localhost:8080"
echo "📊 Database: localhost:5432"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env file with your OpenAI API key"
echo "2. Restart services: docker-compose restart generation-service"
echo "3. Visit http://localhost:3000 to start using LiquidOS"
echo ""
echo "🛠️  Useful commands:"
echo "   View logs: docker-compose logs -f [service-name]"
echo "   Stop services: docker-compose down"
echo "   Rebuild: docker-compose up --build"