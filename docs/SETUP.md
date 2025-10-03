# AetherOS Complete Setup Guide

## Quick Navigation

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Development Standards](#development-standards)
- [Project Structure](#project-structure)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js**: >= 20.0.0 ([Download](https://nodejs.org/))
- **Yarn**: >= 4.9.2 (installed via Corepack - see below)
- **Git**: Latest version ([Download](https://git-scm.com/))

### Optional (for production deployment)

- **Docker**: Latest version
- **Docker Compose**: Latest version

## Initial Setup

### Step 1: Enable Corepack and Install Yarn 4.9.2

Corepack is included with Node.js 16.9+ and manages package manager versions.

```bash
# Enable Corepack
corepack enable

# Activate Yarn 4.9.2
corepack prepare yarn@4.9.2 --activate

# Verify installation
yarn --version
# Expected output: 4.9.2
```

### Step 2: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Arcane-Fly/AetherOS.git
cd AetherOS

# Verify you're on the main branch
git branch -a
git status
```

### Step 3: Install Dependencies

```bash
# Install all dependencies across all workspaces
yarn install

# This will install dependencies for:
# - Root project
# - Frontend (React/TypeScript)
# - Backend services (auth, generation, websocket)
# - Contracts
```

### Step 4: Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit with your favorite editor
nano .env  # or vim, code, etc.
```

**Required Environment Variables:**

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# JWT Secret (change in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Database Configuration
DATABASE_URL=postgresql://aetheros:password@localhost:5432/aetheros_db

# Redis Configuration
REDIS_URL=redis://localhost:6379
```

### Step 5: Start Development Server

```bash
# Frontend development server
cd frontend
yarn dev

# Server will start at http://localhost:3000
```

## Development Standards

AetherOS follows comprehensive development standards. See detailed documentation:

- **[Development Standards Guide](./development-standards.md)** - Complete guide for React/TypeScript
- **[Python Standards Guide](./python-standards.md)** - Complete guide for Python backend

### Quick Overview

#### Naming Conventions

**React/TypeScript:**
- Components: `PascalCase` (e.g., `Button.tsx`, `ChatInterface.tsx`)
- Functions/Variables: `camelCase` (e.g., `fetchData`, `userName`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_URL`, `MAX_RETRY`)
- Types/Interfaces: `PascalCase` without 'I' prefix (e.g., `ButtonProps`)

**Python:**
- Files: `snake_case` (e.g., `user_service.py`)
- Functions/Variables: `snake_case` (e.g., `fetch_user_data`)
- Classes: `PascalCase` (e.g., `UserService`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)

#### Quality Tools

**Frontend:**
- **ESLint**: Code quality and linting
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **TypeScript**: Type safety

**Python:**
- **Pylint**: Code quality and linting
- **Black**: Code formatting
- **mypy**: Type checking

## Project Structure

### Workspace Organization

AetherOS uses Yarn workspaces for monorepo management:

```
AetherOS/
├── frontend/              # React/TypeScript frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── services/     # API services
│   │   ├── utils/        # Helper functions
│   │   ├── types/        # TypeScript types
│   │   └── styles/       # Global styles
│   ├── .eslintrc.json    # ESLint config
│   ├── .prettierrc       # Prettier config
│   ├── tsconfig.json     # TypeScript config
│   └── package.json
├── backend/
│   └── services/
│       ├── auth-service/       # Authentication service
│       ├── generation-service/ # AI generation service
│       └── websocket-service/  # WebSocket service
├── docs/                  # Documentation
├── scripts/              # Utility scripts
├── .yarnrc.yml          # Yarn configuration
└── package.json         # Root package.json
```

### Frontend Structure

```
frontend/src/
├── components/
│   ├── ui/              # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── SampleButton.tsx  # Example component
│   ├── auth/            # Authentication components
│   ├── chat/            # Chat interface components
│   └── creation/        # Creation-specific components
├── services/            # API services
│   ├── api.ts
│   ├── auth.ts
│   └── websocket.ts
├── utils/               # Helper functions
│   └── sampleHelpers.ts # Example utilities
├── types/               # TypeScript definitions
│   ├── api.ts
│   ├── auth.ts
│   └── components.ts
└── styles/              # Global styles
    └── glass-theme.ts
```

## Common Tasks

### Development

#### Start Frontend Development Server

```bash
cd frontend
yarn dev
# Opens http://localhost:3000
```

#### Run Linting

```bash
cd frontend

# Check for issues
yarn lint

# Auto-fix issues
yarn lint:fix
```

#### Format Code

```bash
cd frontend

# Format all files
yarn format

# Check formatting
yarn format:check
```

#### Run Tests

```bash
cd frontend
yarn test
```

### Building

#### Build Frontend for Production

```bash
cd frontend
yarn build

# Or from root
yarn build
```

#### Verify Build

```bash
cd frontend
yarn start
# Serves production build
```

### Yarn Workspace Commands

```bash
# List all workspaces
yarn workspaces list

# Run command in specific workspace
yarn workspace aetheros-frontend run dev
yarn workspace aetheros-auth-service run start

# Add dependency to workspace
yarn workspace aetheros-frontend add react-query

# Add dev dependency
yarn workspace aetheros-frontend add -D @types/node

# Install dependencies for all workspaces
yarn install
```

### Validation Scripts

```bash
# Validate Railpack configuration
yarn validate:railpack-advanced

# Test dependencies
yarn test:deps

# Validate contracts
yarn validate:contracts
```

## Git Workflow

### Pre-commit Hooks

Husky automatically runs linting before each commit:

```bash
# When you commit, Husky will:
# 1. Run ESLint auto-fix on frontend
# 2. Ensure code passes linting standards

git add .
git commit -m "Your commit message"
# Hooks run automatically
```

### Recommended Commit Message Format

```bash
git commit -m "feat: Add new user authentication flow"
git commit -m "fix: Resolve login button styling issue"
git commit -m "docs: Update setup guide with Yarn 4 instructions"
git commit -m "refactor: Improve API service error handling"
```

## Troubleshooting

### Yarn Issues

#### "Corepack is not enabled"

```bash
corepack enable
corepack prepare yarn@4.9.2 --activate
```

#### "Package not found" or dependency errors

```bash
# Clear Yarn cache
yarn cache clean

# Remove node_modules and reinstall
rm -rf node_modules
yarn install
```

#### Peer dependency warnings

These are usually safe to ignore, but you can investigate:

```bash
yarn explain peer-requirements <hash>
```

### ESLint Issues

#### "ESLint couldn't find configuration"

Ensure `.eslintrc.json` exists in frontend directory:

```bash
ls -la frontend/.eslintrc.json
```

#### Many linting errors

Auto-fix most issues:

```bash
cd frontend
yarn lint:fix
```

### TypeScript Issues

#### "Cannot find module" with absolute imports

Verify `tsconfig.json` has proper configuration:

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "components/*": ["components/*"],
      "services/*": ["services/*"],
      "utils/*": ["utils/*"]
    }
  }
}
```

#### Type errors after dependency update

```bash
cd frontend
rm -rf node_modules
yarn install
```

### Build Issues

#### Build fails with memory errors

Increase Node.js memory:

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
yarn build
```

#### Build fails with "CI=true" warnings

The build treats warnings as errors in CI. Fix warnings or temporarily:

```bash
CI=false yarn build
```

## Production Deployment

### Docker Deployment

```bash
# Start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Railway Deployment

The project is configured for Railway deployment:

1. Ensure `railpack.json` files are valid:
   ```bash
   yarn validate:railpack-advanced
   ```

2. Deploy via Railway CLI or GitHub integration

See [Railway Deployment Guide](./railway-fix.md) for details.

## Additional Resources

### Documentation

- [Development Standards](./development-standards.md) - React/TypeScript standards
- [Python Standards](./python-standards.md) - Python backend standards
- [Railway Fix Guide](./railway-fix.md) - Railway deployment troubleshooting
- [Setup Guide](../specs/setup-guide.md) - Detailed setup instructions
- [Code Style Guide](../specs/standards/code-style.md) - General code style

### External Resources

- [Yarn 4 Documentation](https://yarnpkg.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)

## Getting Help

### Internal Resources

1. Check existing documentation in `docs/` and `specs/` directories
2. Search GitHub issues for similar problems
3. Review the [troubleshooting section](#troubleshooting)

### External Help

1. Create a GitHub issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Error messages and logs
   - Your environment (Node version, OS, etc.)

2. Use GitHub Discussions for questions

## Summary

You're now ready to develop with AetherOS! Key points:

✅ **Yarn 4.9.2** via Corepack for package management  
✅ **ESLint & Prettier** for code quality  
✅ **Husky** for automated pre-commit checks  
✅ **TypeScript** with absolute imports  
✅ **Comprehensive documentation** for all standards  

Happy coding! 🚀
