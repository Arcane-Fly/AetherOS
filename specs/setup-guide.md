# AetherOS Setup Guide

## Prerequisites

### System Requirements

- **Operating System:** macOS, Linux, or Windows with WSL2
- **Node.js:** Version 20.x or higher
- **Package Manager:** Yarn 1.22+ (preferred), pnpm, or npm as fallbacks
- **Docker:** Latest stable version with Docker Compose V2
- **Git:** Latest version
- **Memory:** 8GB RAM minimum, 16GB recommended
- **Storage:** 10GB free space minimum

### Development Tools

- **Code Editor:** VS Code, Cursor, or similar with extensions
- **API Testing:** Postman, Insomnia, or Thunder Client
- **Database Client:** pgAdmin, DBeaver, or similar (optional)
- **Terminal:** Modern terminal with good Unicode support

## Installation

### 1. Clone Repository

```bash
# Clone the repository
git clone https://github.com/Arcane-Fly/AetherOS.git
cd AetherOS

# Verify you're on the main branch
git branch -a
git status
```

### 2. Package Manager Setup

#### Option A: Yarn (Recommended)
```bash
# Verify yarn installation
yarn --version

# If not installed, install via npm
npm install -g yarn

# Or via corepack (Node.js 16.9+)
corepack enable
corepack prepare yarn@stable --activate
```

#### Option B: pnpm (Alternative)
```bash
# Install pnpm if yarn is not available
npm install -g pnpm

# Verify installation
pnpm --version
```

#### Option C: npm (Fallback)
```bash
# npm comes with Node.js
npm --version
```

### 3. Install Dependencies

#### Using Yarn (Recommended)
```bash
# Install all dependencies across all services
yarn install:all

# Or install manually for each service
yarn install                                      # Root dependencies
cd frontend && yarn install && cd ..             # Frontend
cd backend/services/auth-service && yarn install && cd ../../..
cd backend/services/generation-service && yarn install && cd ../../..
cd backend/services/websocket-service && yarn install && cd ../../..
```

#### Using pnpm
```bash
# Install dependencies
pnpm install
cd frontend && pnpm install && cd ..
cd backend/services/auth-service && pnpm install && cd ../../..
cd backend/services/generation-service && pnpm install && cd ../../..
cd backend/services/websocket-service && pnpm install && cd ../../..
```

#### Using npm
```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..
cd backend/services/auth-service && npm install && cd ../../..
cd backend/services/generation-service && npm install && cd ../../..
cd backend/services/websocket-service && npm install && cd ../../..
```

### 4. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env  # or code .env, vim .env, etc.
```

#### Required Environment Variables

```bash
# OpenAI API Configuration (Required)
OPENAI_API_KEY=your-openai-api-key-here

# JWT Security (Required - Generate a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-min-32-characters

# Database Configuration (Default values work for Docker)
DATABASE_URL=postgresql://aetheros:aetheros123@localhost:5432/aetheros

# Redis Configuration (Default values work for Docker)
REDIS_URL=redis://localhost:6379

# Node Environment
NODE_ENV=development

# Service Ports (Default values)
AUTH_SERVICE_PORT=3001
GENERATION_SERVICE_PORT=3002
WEBSOCKET_SERVICE_PORT=3003

# Frontend Configuration
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_WEBSOCKET_URL=http://localhost:3003

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

#### Getting OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key and add it to your `.env` file

⚠️ **Security Note:** Never commit your `.env` file or share your API keys publicly.

### 5. Docker Setup

#### Start All Services
```bash
# Start the complete stack
yarn dev

# Or use Docker Compose directly
docker compose up --build

# For detached mode (background)
docker compose up -d --build
```

#### Verify Services Are Running
```bash
# Check service status
docker compose ps

# Expected output should show all services as "Up"
# frontend, auth-service, generation-service, websocket-service,
# api-gateway, postgres, redis
```

### 6. Health Checks

#### Service Health Verification
```bash
# Test individual services (in separate terminal)
curl http://localhost:3001/health  # Auth Service
curl http://localhost:3002/health  # Generation Service  
curl http://localhost:3003/health  # WebSocket Service
curl http://localhost:3000         # Frontend (should return HTML)
curl http://localhost:8080/api/health  # API Gateway

# All should return 200 OK status
```

#### Database Connection Test
```bash
# Connect to PostgreSQL
docker compose exec postgres psql -U aetheros -d aetheros

# Run test query
SELECT version();

# List tables (should see users, generations if migrations ran)
\dt

# Exit
\q
```

#### Redis Connection Test
```bash
# Connect to Redis
docker compose exec redis redis-cli

# Test connection
ping  # Should return PONG

# Exit
exit
```

## Development Workflow

### 1. Code Style Setup

#### Install Editor Extensions (VS Code)
```bash
# Install recommended extensions
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-docker
```

#### Configure Editor Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.eol": "\n",
  "prettier.requireConfig": true,
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

### 2. Development Commands

#### Frontend Development
```bash
cd frontend

# Start development server (if not using Docker)
yarn start

# Run tests
yarn test

# Run linting
yarn lint

# Fix linting issues
yarn lint:fix

# Format code
yarn format

# Build for production
yarn build
```

#### Backend Development
```bash
# Navigate to service
cd backend/services/auth-service  # or generation-service, websocket-service

# Start development server (if not using Docker)
yarn dev

# Run tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run linting
yarn lint

# Fix linting issues
yarn lint:fix

# Format code
yarn format
```

### 3. Database Management

#### Run Migrations
```bash
# Run database migrations
yarn migrate

# Or manually
node scripts/migrate.js
```

#### Seed Test Data
```bash
# Seed development data
node scripts/seed-templates.js
```

#### Database Backup/Restore
```bash
# Backup database
docker compose exec postgres pg_dump -U aetheros aetheros > backup.sql

# Restore database
docker compose exec -T postgres psql -U aetheros -d aetheros < backup.sql
```

## Testing

### Unit Tests
```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run tests in watch mode
yarn test:watch

# Run specific test file
cd frontend && yarn test UserProfile.test.js

# Run backend service tests
cd backend/services/auth-service && yarn test
```

### Integration Tests
```bash
# Start test database (if different from dev)
docker compose -f docker-compose.test.yml up -d postgres redis

# Run integration tests
yarn test:integration
```

### API Testing
```bash
# Test API endpoints manually

# Register new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "name": "Test User"
  }'

# Login user
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Generate code (replace YOUR_JWT_TOKEN with actual token)
curl -X POST http://localhost:8080/api/generate/code \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "prompt": "Create a hello world function in JavaScript",
    "language": "javascript"
  }'
```

## Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check if ports are in use
lsof -i :3000  # Frontend
lsof -i :3001  # Auth Service
lsof -i :3002  # Generation Service
lsof -i :3003  # WebSocket Service
lsof -i :8080  # API Gateway
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Kill process using port
kill -9 <PID>

# Or stop all AetherOS services
docker compose down
```

#### Docker Issues
```bash
# Clean up Docker resources
docker compose down -v  # Stop and remove volumes
docker system prune -f  # Clean up unused resources

# Rebuild containers from scratch
docker compose build --no-cache
docker compose up --force-recreate
```

#### Dependency Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules yarn.lock
yarn install

# Clear Yarn cache
yarn cache clean

# Clear pnpm cache
pnpm store prune
```

#### Database Connection Issues
```bash
# Check PostgreSQL logs
docker compose logs postgres

# Restart PostgreSQL
docker compose restart postgres

# Reset database (WARNING: This will delete all data)
docker compose down -v
docker compose up -d postgres
yarn migrate
```

#### OpenAI API Issues
```bash
# Test OpenAI API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY"

# Check generation service logs
docker compose logs generation-service

# Common issues:
# - Invalid API key
# - Insufficient credits/quota
# - Rate limiting
# - Network connectivity issues
```

### Debug Mode

#### Enable Debug Logging
```bash
# Add to .env file
NODE_ENV=development
DEBUG=aetheros:*

# Or for specific services
DEBUG=aetheros:auth-service
DEBUG=aetheros:generation-service
```

#### View Logs
```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f auth-service
docker compose logs -f generation-service
docker compose logs -f frontend

# Follow logs with timestamps
docker compose logs -f -t
```

## Production Deployment

### Environment Preparation
```bash
# Set production environment variables
export NODE_ENV=production
export JWT_SECRET="your-super-secure-production-jwt-secret"
export OPENAI_API_KEY="your-production-openai-api-key"
export DATABASE_URL="your-production-database-url"
export REDIS_URL="your-production-redis-url"
```

### Build Production Images
```bash
# Build production Docker images
docker compose -f docker-compose.prod.yml build

# Run production stack
docker compose -f docker-compose.prod.yml up -d
```

### Health Monitoring
```bash
# Set up health check monitoring
curl -f http://your-domain.com/api/health

# Monitor service metrics
# (Set up Prometheus, Grafana, or similar monitoring tools)
```

## Getting Help

### Documentation
- **Project Documentation:** `/README.md`
- **API Documentation:** Generated via OpenAPI/Swagger
- **Architecture Guide:** `/specs/architecture.md`
- **Standards:** `/specs/standards/`

### Development Resources
- **React Documentation:** https://react.dev/
- **Express.js Documentation:** https://expressjs.com/
- **OpenAI API Documentation:** https://platform.openai.com/docs
- **Docker Documentation:** https://docs.docker.com/

### Community Support
- **GitHub Issues:** Report bugs and feature requests
- **GitHub Discussions:** Community Q&A and discussions
- **Code Reviews:** Submit pull requests for contributions

### Debugging Resources
```bash
# Useful debugging commands
docker compose ps              # Check service status
docker compose logs service   # View service logs
docker stats                  # Monitor resource usage
yarn lint                     # Check code quality
yarn test                     # Run test suite
curl localhost:port/health    # Check service health
```

---

🎉 **Congratulations!** You should now have AetherOS running locally. Open http://localhost:3000 in your browser to start using the application.

For development workflow, see `/specs/instructions/core/execute-task.md`
For creating new features, see `/specs/instructions/core/create-spec.md`