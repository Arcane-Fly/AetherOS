#!/bin/bash

# Simple validation script to check LiquidOS structure

echo "🧪 Running LiquidOS validation tests..."

# Check required files
echo "📁 Checking file structure..."

required_files=(
  "package.json"
  "docker-compose.yml"
  ".env.example"
  "README.md"
  "frontend/package.json"
  "frontend/src/App.js"
  "backend/services/auth-service/package.json"
  "backend/services/auth-service/src/server.js"
  "backend/services/generation-service/package.json"
  "backend/services/generation-service/src/server.js"
  "backend/api-gateway/nginx.conf"
)

for file in "${required_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ Missing: $file"
  fi
done

# Check package.json files for required scripts
echo ""
echo "🔍 Checking package.json configurations..."

# Frontend package.json
if [ -f "frontend/package.json" ]; then
  if grep -q "react" "frontend/package.json"; then
    echo "✅ Frontend: React dependency found"
  else
    echo "⚠️  Frontend: React dependency missing"
  fi
  
  if grep -q "tailwindcss" "frontend/package.json"; then
    echo "✅ Frontend: Tailwind CSS found"
  else
    echo "⚠️  Frontend: Tailwind CSS missing"
  fi
fi

# Auth service package.json
if [ -f "backend/services/auth-service/package.json" ]; then
  if grep -q "express" "backend/services/auth-service/package.json"; then
    echo "✅ Auth Service: Express dependency found"
  else
    echo "⚠️  Auth Service: Express dependency missing"
  fi
  
  if grep -q "jsonwebtoken" "backend/services/auth-service/package.json"; then
    echo "✅ Auth Service: JWT dependency found"
  else
    echo "⚠️  Auth Service: JWT dependency missing"
  fi
fi

# Generation service package.json
if [ -f "backend/services/generation-service/package.json" ]; then
  if grep -q "openai" "backend/services/generation-service/package.json"; then
    echo "✅ Generation Service: OpenAI dependency found"
  else
    echo "⚠️  Generation Service: OpenAI dependency missing"
  fi
fi

# Check Docker configuration
echo ""
echo "🐳 Checking Docker configuration..."

if [ -f "docker-compose.yml" ]; then
  if grep -q "postgres" "docker-compose.yml"; then
    echo "✅ Docker: PostgreSQL service configured"
  else
    echo "⚠️  Docker: PostgreSQL service missing"
  fi
  
  if grep -q "redis" "docker-compose.yml"; then
    echo "✅ Docker: Redis service configured"
  else
    echo "⚠️  Docker: Redis service missing"
  fi
  
  if grep -q "auth-service" "docker-compose.yml"; then
    echo "✅ Docker: Auth service configured"
  else
    echo "⚠️  Docker: Auth service missing"
  fi
  
  if grep -q "generation-service" "docker-compose.yml"; then
    echo "✅ Docker: Generation service configured"
  else
    echo "⚠️  Docker: Generation service missing"
  fi
fi

echo ""
echo "🎉 Validation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy .env.example to .env and configure your OpenAI API key"
echo "2. Run: docker-compose up --build"
echo "3. Visit http://localhost:3000 to access LiquidOS"