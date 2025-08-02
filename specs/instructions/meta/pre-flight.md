# Pre-flight Checklist - AetherOS Development

## Context

Pre-flight checklist to ensure development environment is properly configured and all prerequisites are met before beginning work on AetherOS.

## Development Environment Setup

### 1. System Requirements

#### Required Software
- [ ] **Node.js:** Version 20.x or higher
- [ ] **Yarn:** Version 4.x or higher (preferred package manager)
- [ ] **Docker:** Latest stable version
- [ ] **Docker Compose:** V2 (docker compose command)
- [ ] **Git:** Latest version with proper configuration
- [ ] **Code Editor:** VS Code, Cursor, or similar with extensions

#### System Configuration
```bash
# Verify Node.js version
node --version  # Should be v20.x.x or higher

# Verify Yarn version  
yarn --version  # Should be 4.x.x or higher

# Verify Docker
docker --version
docker compose version

# Verify Git configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 2. Repository Setup

#### Clone and Initialize
```bash
# Clone the repository
git clone https://github.com/Arcane-Fly/AetherOS.git
cd AetherOS

# Verify you're on the correct branch
git branch -a
git status

# Install all dependencies
yarn install:all
```

#### Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env  # or use your preferred editor
```

#### Required Environment Variables
- [ ] `OPENAI_API_KEY` - OpenAI API key for code generation
- [ ] `JWT_SECRET` - Secret for JWT token signing (generate a secure random string)
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `REDIS_URL` - Redis connection string  
- [ ] `NODE_ENV` - Set to 'development' for local development

### 3. Service Health Checks

#### Start All Services
```bash
# Start the complete stack
yarn dev

# Or use Docker Compose directly
docker compose up --build
```

#### Verify Service Health
```bash
# Check service status
docker compose ps

# Test individual services
curl http://localhost:3001/health  # Auth Service
curl http://localhost:3002/health  # Generation Service  
curl http://localhost:3003/health  # WebSocket Service
curl http://localhost:3000         # Frontend

# Check API Gateway
curl http://localhost:8080/api/health
```

#### Database Verification
```bash
# Connect to PostgreSQL
docker compose exec postgres psql -U postgres -d aetheros

# Run a simple query
SELECT version();

# Check tables exist
\dt

# Exit PostgreSQL
\q
```

#### Redis Verification
```bash
# Connect to Redis
docker compose exec redis redis-cli

# Test Redis connection
ping  # Should return PONG

# Exit Redis
exit
```

### 4. Code Quality Tools

#### Linting Setup
```bash
# Run linting on all services
yarn lint

# Fix linting issues automatically
yarn lint:fix

# Format code
yarn format
```

#### Testing Setup
```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run tests in watch mode for development
yarn test:watch
```

### 5. Development Tools Configuration

#### VS Code Extensions (Recommended)
- [ ] **ESLint** - JavaScript linting
- [ ] **Prettier** - Code formatting
- [ ] **Auto Rename Tag** - HTML/JSX tag renaming
- [ ] **Bracket Pair Colorizer** - Better bracket visibility
- [ ] **GitLens** - Enhanced Git capabilities
- [ ] **Docker** - Docker file support
- [ ] **Thunder Client** - API testing
- [ ] **ES7+ React/Redux/React-Native snippets** - React snippets

#### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.eol": "\n",
  "prettier.requireConfig": true
}
```

### 6. Git Workflow Configuration

#### Branch Protection
```bash
# Ensure you're working on a feature branch
git checkout -b feature/your-feature-name

# Verify branch naming convention
# Should follow: feature/*, bugfix/*, hotfix/*
```

#### Commit Message Format
```bash
# Use conventional commit format
# type(scope): description

# Examples:
# feat(auth): add OAuth Google integration
# fix(generation): handle API timeout errors
# docs(readme): update installation instructions
# refactor(frontend): extract reusable components
```

### 7. API Testing Setup

#### Postman/Thunder Client Collection
- [ ] Import API collection for testing endpoints
- [ ] Configure environment variables for different environments
- [ ] Test authentication endpoints
- [ ] Test generation endpoints
- [ ] Test WebSocket connections

#### Sample API Requests
```bash
# Test user registration
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123","name":"Test User"}'

# Test code generation
curl -X POST http://localhost:8080/api/generate/code \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"prompt":"Create a hello world function in JavaScript","language":"javascript"}'
```

### 8. Documentation Access

#### Key Documentation Files
- [ ] `/README.md` - Project overview and setup
- [ ] `/specs/standards/tech-stack.md` - Technology standards
- [ ] `/specs/standards/best-practices.md` - Development guidelines
- [ ] `/specs/standards/code-style.md` - Code formatting rules
- [ ] `/product-requirements-document.md` - Product specifications

#### Architecture Understanding
- [ ] Review system architecture diagram
- [ ] Understand service responsibilities
- [ ] Familiarize with database schema
- [ ] Understand API gateway routing
- [ ] Review security implementation

### 9. Security Configuration

#### Local Development Security
- [ ] Use environment variables for all secrets
- [ ] Never commit sensitive information
- [ ] Use HTTPS in production configurations
- [ ] Implement proper CORS settings
- [ ] Configure rate limiting appropriately

#### API Key Management
```bash
# Secure API key storage
echo "OPENAI_API_KEY=your_actual_api_key_here" >> .env

# Verify .env is in .gitignore
grep -q "\.env" .gitignore && echo "✓ .env is ignored" || echo "⚠ Add .env to .gitignore"
```

### 10. Performance Monitoring

#### Local Performance Testing
```bash
# Check bundle sizes
yarn workspace frontend build
yarn workspace frontend analyze  # If bundle analyzer is configured

# Monitor Docker resource usage
docker stats

# Check database query performance
# Use pgAdmin or similar tools for query analysis
```

### 11. Troubleshooting Common Issues

#### Port Conflicts
```bash
# Check if ports are already in use
lsof -i :3000  # Frontend
lsof -i :3001  # Auth Service
lsof -i :3002  # Generation Service
lsof -i :3003  # WebSocket Service
lsof -i :8080  # API Gateway
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Kill processes if needed
kill -9 <PID>
```

#### Docker Issues
```bash
# Clean up Docker resources
docker compose down -v  # Stop and remove volumes
docker system prune -f  # Clean up unused resources

# Rebuild containers
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
```

### 12. Ready-to-Develop Checklist

#### Environment Verification
- [ ] All services start without errors
- [ ] All health checks pass
- [ ] Database migrations are up to date
- [ ] Redis is accessible
- [ ] Frontend loads successfully in browser
- [ ] API endpoints respond correctly

#### Development Tools
- [ ] Code editor is configured with proper extensions
- [ ] Linting and formatting work correctly
- [ ] Git is configured with proper user information
- [ ] Tests run successfully
- [ ] Hot reloading works in development mode

#### Team Coordination
- [ ] Latest code has been pulled from main branch
- [ ] Team members are aware of current work
- [ ] Feature branch has been created
- [ ] Jira ticket or GitHub issue is assigned
- [ ] Architecture review completed (if needed)

#### Knowledge Requirements
- [ ] Understand the feature requirements
- [ ] Familiar with relevant codebase areas
- [ ] Know which services will be affected
- [ ] Understand testing requirements
- [ ] Aware of deployment considerations

## Final Verification Command

```bash
# Run complete verification script
./scripts/validate.sh

# Expected output should show all green checkmarks
# If any issues are found, resolve them before proceeding
```

## Getting Help

### Internal Resources
- Review existing codebase and patterns
- Check `/specs/` directory for standards and guidelines
- Look at similar implemented features for reference
- Use git history to understand previous changes

### External Resources
- React documentation: https://react.dev/
- Express.js documentation: https://expressjs.com/
- OpenAI API documentation: https://platform.openai.com/docs
- Docker documentation: https://docs.docker.com/

### Team Communication
- Create GitHub issue for bugs or questions
- Use pull request comments for code review
- Document decisions in architecture decision records
- Update team on progress and blockers

---

**Status:** Ready to begin development ✅

Once all items in this checklist are complete, you're ready to start implementing features following the established standards and best practices.