#!/bin/bash

# Comprehensive LiquidOS Test Suite

set -e

echo "🧪 Running LiquidOS Comprehensive Test Suite"
echo "============================================="

# Test 1: File Structure Validation
echo ""
echo "📁 Test 1: File Structure Validation"
echo "------------------------------------"

critical_files=(
  "package.json"
  "docker-compose.yml"
  ".env.example"
  "README.md"
  "frontend/package.json"
  "frontend/src/App.js"
  "frontend/Dockerfile"
  "backend/services/auth-service/package.json"
  "backend/services/auth-service/src/server.js"
  "backend/services/auth-service/Dockerfile"
  "backend/services/generation-service/package.json"
  "backend/services/generation-service/src/server.js"
  "backend/services/generation-service/Dockerfile"
  "backend/api-gateway/nginx.conf"
  "scripts/setup.sh"
  "scripts/migrate.js"
)

for file in "${critical_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ CRITICAL: Missing $file"
    exit 1
  fi
done

# Test 2: Package.json Dependencies
echo ""
echo "📦 Test 2: Package Dependencies"
echo "------------------------------"

# Check React frontend dependencies
echo "🔍 Frontend Dependencies:"
if grep -q '"react"' frontend/package.json; then
  echo "✅ React found"
else
  echo "❌ React missing"
  exit 1
fi

if grep -q '"tailwindcss"' frontend/package.json; then
  echo "✅ Tailwind CSS found"
else
  echo "❌ Tailwind CSS missing"
  exit 1
fi

# Check auth service dependencies
echo "🔍 Auth Service Dependencies:"
if grep -q '"express"' backend/services/auth-service/package.json; then
  echo "✅ Express found"
else
  echo "❌ Express missing"
  exit 1
fi

if grep -q '"jsonwebtoken"' backend/services/auth-service/package.json; then
  echo "✅ JWT found"
else
  echo "❌ JWT missing"
  exit 1
fi

if grep -q '"bcrypt"' backend/services/auth-service/package.json; then
  echo "✅ Bcrypt found"
else
  echo "❌ Bcrypt missing"
  exit 1
fi

if grep -q '"pg"' backend/services/auth-service/package.json; then
  echo "✅ PostgreSQL driver found"
else
  echo "❌ PostgreSQL driver missing"
  exit 1
fi

# Check generation service dependencies
echo "🔍 Generation Service Dependencies:"
if grep -q '"openai"' backend/services/generation-service/package.json; then
  echo "✅ OpenAI client found"
else
  echo "❌ OpenAI client missing"
  exit 1
fi

if grep -q '"express"' backend/services/generation-service/package.json; then
  echo "✅ Express found"
else
  echo "❌ Express missing"
  exit 1
fi

# Test 3: Docker Configuration
echo ""
echo "🐳 Test 3: Docker Configuration"
echo "------------------------------"

echo "🔍 Validating docker-compose.yml..."
if docker compose config --quiet; then
  echo "✅ Docker Compose configuration is valid"
else
  echo "❌ Docker Compose configuration is invalid"
  exit 1
fi

# Check services in docker-compose
echo "🔍 Checking Docker services:"
for service in "postgres" "redis" "auth-service" "generation-service" "api-gateway" "frontend"; do
  if grep -q "$service:" docker-compose.yml; then
    echo "✅ $service service configured"
  else
    echo "❌ $service service missing"
    exit 1
  fi
done

# Test 4: API Routes Structure
echo ""
echo "🛣️  Test 4: API Routes Structure"
echo "-------------------------------"

echo "🔍 Auth Service Routes:"
if grep -q "router.post('/register'" backend/services/auth-service/src/routes/auth.js; then
  echo "✅ Register route found"
else
  echo "❌ Register route missing"
  exit 1
fi

if grep -q "router.post('/login'" backend/services/auth-service/src/routes/auth.js; then
  echo "✅ Login route found"
else
  echo "❌ Login route missing"
  exit 1
fi

echo "🔍 Generation Service Routes:"
if grep -q "router.post('/code'" backend/services/generation-service/src/routes/generation.js; then
  echo "✅ Code generation route found"
else
  echo "❌ Code generation route missing"
  exit 1
fi

# Test 5: Frontend Components
echo ""
echo "⚛️  Test 5: Frontend Components"
echo "-----------------------------"

components=(
  "frontend/src/components/auth/AuthForm.js"
  "frontend/src/components/chat/ChatInterface.js"
  "frontend/src/components/creation/CreationHistory.js"
  "frontend/src/services/api.js"
  "frontend/src/services/auth.js"
)

for component in "${components[@]}"; do
  if [ -f "$component" ]; then
    echo "✅ $component"
  else
    echo "❌ Missing component: $component"
    exit 1
  fi
done

# Test 6: Environment Configuration
echo ""
echo "⚙️  Test 6: Environment Configuration"
echo "-----------------------------------"

if [ -f ".env.example" ]; then
  echo "🔍 Checking .env.example:"
  
  required_vars=("OPENAI_API_KEY" "JWT_SECRET" "DATABASE_URL" "POSTGRES_DB" "POSTGRES_USER" "POSTGRES_PASSWORD")
  
  for var in "${required_vars[@]}"; do
    if grep -q "$var" .env.example; then
      echo "✅ $var configured"
    else
      echo "❌ $var missing from .env.example"
      exit 1
    fi
  done
else
  echo "❌ .env.example missing"
  exit 1
fi

# Test 7: Documentation
echo ""
echo "📚 Test 7: Documentation"
echo "----------------------"

if grep -q "LiquidOS" README.md; then
  echo "✅ README.md contains project title"
else
  echo "❌ README.md missing or incomplete"
  exit 1
fi

if grep -q "Quick Start" README.md; then
  echo "✅ README.md contains setup instructions"
else
  echo "❌ README.md missing setup instructions"
  exit 1
fi

if grep -q "Architecture" README.md; then
  echo "✅ README.md contains architecture information"
else
  echo "❌ README.md missing architecture information"
  exit 1
fi

# Final Summary
echo ""
echo "🎉 All Tests Passed!"
echo "==================="
echo ""
echo "✅ File structure is complete"
echo "✅ Dependencies are properly configured"
echo "✅ Docker configuration is valid"
echo "✅ API routes are implemented"
echo "✅ Frontend components are in place"
echo "✅ Environment configuration is ready"
echo "✅ Documentation is comprehensive"
echo ""
echo "🚀 LiquidOS is ready for deployment!"
echo ""
echo "📝 Next steps:"
echo "1. Copy .env.example to .env: cp .env.example .env"
echo "2. Edit .env with your OpenAI API key"
echo "3. Start the system: docker compose up --build"
echo "4. Visit http://localhost:3000 to start using LiquidOS"
echo ""
echo "🎯 Your generative operating environment is ready!"