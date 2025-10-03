# AetherOS Development Standards - Quick Reference

## 🚀 Quick Start

```bash
# 1. Enable Corepack and Yarn 4.9.2
corepack enable
corepack prepare yarn@4.9.2 --activate

# 2. Validate setup
yarn validate:setup

# 3. Install dependencies
yarn install

# 4. Start development
cd frontend && yarn dev
```

## 📚 Documentation

| Document | Purpose | Link |
|----------|---------|------|
| **Setup Guide** | Complete environment setup | [docs/SETUP.md](docs/SETUP.md) |
| **Frontend Standards** | React/TypeScript development | [docs/development-standards.md](docs/development-standards.md) |
| **Backend Standards** | Python development | [docs/python-standards.md](docs/python-standards.md) |
| **Deployment Guide** | Railway deployment | [docs/railway-fix.md](docs/railway-fix.md) |
| **Documentation Index** | Navigation & overview | [docs/README.md](docs/README.md) |

## 🎯 Naming Conventions

### Frontend (React/TypeScript)

| Type | Convention | Examples |
|------|------------|----------|
| Components | `PascalCase` | `Button.tsx`, `ChatInterface.tsx` |
| Functions/Variables | `camelCase` | `fetchData`, `userName`, `isActive` |
| Constants | `UPPER_SNAKE_CASE` | `API_URL`, `MAX_RETRY_COUNT` |
| Types/Interfaces | `PascalCase` | `ButtonProps`, `UserData` |
| Files (utilities) | `camelCase` | `apiUtils.ts`, `formatDate.ts` |

### Backend (Python)

| Type | Convention | Examples |
|------|------------|----------|
| Files | `snake_case` | `user_service.py`, `auth_helper.py` |
| Functions/Variables | `snake_case` | `fetch_user`, `user_name` |
| Classes | `PascalCase` | `UserService`, `DatabaseConnection` |
| Constants | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `MAX_RETRIES` |

## 🛠️ Tools & Commands

### Quality Checks

```bash
# Validate environment
yarn validate:setup

# Lint frontend
cd frontend && yarn lint
cd frontend && yarn lint:fix  # Auto-fix

# Format code
cd frontend && yarn format
cd frontend && yarn format:check

# Build
yarn build
```

### Development

```bash
# Start dev server
cd frontend && yarn dev

# Run tests
cd frontend && yarn test

# Workspace commands
yarn workspaces list
yarn workspace aetheros-frontend run dev
```

### Validation

```bash
# Validate Railpack
yarn validate:railpack-advanced

# Test dependencies
yarn test:deps

# Validate contracts
yarn validate:contracts
```

## 📦 Project Structure

```
AetherOS/
├── frontend/              # React/TypeScript app
│   ├── src/
│   │   ├── components/   # UI components
│   │   │   ├── ui/       # Base components (Button, Input)
│   │   │   ├── auth/     # Auth components
│   │   │   └── chat/     # Chat components
│   │   ├── services/     # API services
│   │   ├── utils/        # Helper functions
│   │   ├── types/        # TypeScript types
│   │   └── styles/       # Global styles
│   ├── .eslintrc.json    # ESLint config
│   ├── .prettierrc       # Prettier config
│   └── tsconfig.json     # TypeScript config
├── backend/services/      # Microservices
├── docs/                  # Documentation
└── scripts/              # Utility scripts
```

## 🔍 Key Features

✅ **Yarn 4.9.2+** - Modern package management via Corepack  
✅ **ESLint** - Code quality enforcement  
✅ **Prettier** - Consistent code formatting  
✅ **Husky** - Pre-commit hooks  
✅ **TypeScript** - Type safety with absolute imports  
✅ **Validation Script** - Automated setup verification  

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Yarn not found | Run `corepack enable && corepack prepare yarn@4.9.2 --activate` |
| ESLint errors | Run `cd frontend && yarn lint:fix` |
| Type errors | Run `cd frontend && yarn install` |
| Build fails | Check `yarn validate:setup` output |

See [docs/SETUP.md#troubleshooting](docs/SETUP.md#troubleshooting) for detailed solutions.

## 📖 Example Code

### Component Example

```typescript
// frontend/src/components/ui/Button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick 
}) => {
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
  };

  return (
    <button
      className={`px-4 py-2 rounded ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
```

### Utility Example

```typescript
// frontend/src/utils/formatters.ts
const API_BASE_URL = 'https://api.example.com';

export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

### Python Example

```python
# backend/services/auth_service/user_service.py
from typing import Optional

API_BASE_URL = "https://api.example.com"
MAX_RETRY_ATTEMPTS = 3

class UserService:
    def __init__(self):
        self._base_url = API_BASE_URL
    
    def fetch_user_data(self, user_id: str) -> Optional[dict]:
        """Fetch user data by ID"""
        try:
            # Implementation
            return None
        except Exception as error:
            print(f"Error: {error}")
            return None
```

## 🎓 Learning Path

1. **Beginner**: [docs/SETUP.md](docs/SETUP.md) → Start developing
2. **Intermediate**: [docs/development-standards.md](docs/development-standards.md) → Master frontend
3. **Advanced**: [docs/python-standards.md](docs/python-standards.md) → Backend architecture

## 🔗 Quick Links

- [Main README](README.md)
- [Setup Guide](docs/SETUP.md)
- [Frontend Standards](docs/development-standards.md)
- [Backend Standards](docs/python-standards.md)
- [Documentation Index](docs/README.md)

## ✅ Pre-commit Checklist

Before committing:
- [ ] Code follows naming conventions
- [ ] `yarn lint` passes (frontend)
- [ ] `yarn format:check` passes (frontend)
- [ ] Build succeeds (`yarn build`)
- [ ] Tests pass (if applicable)
- [ ] Documentation updated (if needed)

Husky will automatically run `yarn lint:fix` before each commit.

## 📞 Getting Help

1. Check [docs/SETUP.md#troubleshooting](docs/SETUP.md#troubleshooting)
2. Search GitHub issues
3. Create a new issue with details
4. Use GitHub Discussions for questions

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintained by**: AetherOS Team

For complete documentation, see [docs/README.md](docs/README.md)
