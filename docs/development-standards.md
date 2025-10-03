# AetherOS Development Standards Guide

## Overview

This document establishes comprehensive development standards for the AetherOS project, including setup instructions, naming conventions, folder structure, and tooling configurations for React with TypeScript, JavaScript, Python, Tailwind CSS, and component libraries.

## Prerequisites

- **Node.js**: >= 20.0.0
- **Yarn**: >= 4.9.2 (managed via Corepack)
- **Git**: Latest version

## Initial Setup

### 1. Enable Corepack and Yarn 4.9.2

```bash
# Enable Corepack (comes with Node.js 16.9+)
corepack enable

# Activate Yarn 4.9.2
corepack prepare yarn@4.9.2 --activate

# Verify installation
yarn --version  # Should output: 4.9.2
```

### 2. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Arcane-Fly/AetherOS.git
cd AetherOS

# Install all dependencies across workspaces
yarn install

# Or install for specific workspaces
yarn workspace aetheros-frontend install
```

## Project Structure

### Frontend (React/TypeScript)

```
frontend/
├── src/
│   ├── assets/              # Static assets
│   │   ├── images/          # Images (e.g., logo.png)
│   │   └── fonts/           # Custom fonts
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Base UI components (Button, Input, Modal)
│   │   ├── auth/            # Authentication components
│   │   ├── chat/            # Chat interface components
│   │   └── creation/        # Creation-specific components
│   ├── pages/               # Page components (if using route-based)
│   ├── services/            # API services and integrations
│   │   ├── api.ts           # API client setup
│   │   ├── auth.ts          # Authentication service
│   │   └── websocket.ts     # WebSocket service
│   ├── utils/               # Helper functions and utilities
│   │   └── formatDate.ts    # Example utility
│   ├── types/               # TypeScript type definitions
│   │   ├── api.ts           # API types
│   │   ├── auth.ts          # Auth types
│   │   └── components.ts    # Component prop types
│   ├── styles/              # Global styles and Tailwind config
│   │   └── glass-theme.ts   # Theme definitions
│   └── App.tsx              # Main application component
├── public/                  # Static public assets
├── .eslintrc.json           # ESLint configuration
├── .prettierrc              # Prettier configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # Frontend dependencies
```

### Backend Services (Node.js/Express)

```
backend/services/
├── auth-service/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions
│   │   ├── config/          # Configuration files
│   │   └── server.js        # Entry point
│   └── package.json
├── generation-service/
└── websocket-service/
```

## Naming Conventions

### React/TypeScript

#### Files
- **Components**: `PascalCase.tsx` (e.g., `Button.tsx`, `ChatInterface.tsx`)
- **Utilities**: `camelCase.ts` or `kebab-case.ts` (e.g., `apiUtils.ts`, `format-date.ts`)
- **Types**: `camelCase.ts` (e.g., `api.ts`, `components.ts`)

#### Code
- **Components**: `PascalCase` 
  ```tsx
  function MyButton() { ... }
  const UserProfile = () => { ... }
  ```
- **Variables/Functions**: `camelCase`
  ```tsx
  const userName = 'John';
  function fetchData() { ... }
  ```
- **Constants**: `UPPER_SNAKE_CASE`
  ```tsx
  const API_URL = 'https://api.example.com';
  const MAX_RETRY_COUNT = 3;
  ```
- **Types/Interfaces**: `PascalCase` (without 'I' prefix)
  ```tsx
  interface ButtonProps { ... }
  type UserData = { ... }
  ```

### JavaScript

- **Files**: `camelCase.js` or `kebab-case.js`
- **Variables/Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Classes**: `PascalCase`

### Python (Backend Scripts)

- **Files**: `snake_case.py` (e.g., `my_module.py`)
- **Variables/Functions**: `snake_case`
  ```python
  user_name = 'John'
  def fetch_data(): ...
  ```
- **Classes**: `PascalCase`
  ```python
  class MyClass: ...
  ```
- **Constants**: `UPPER_SNAKE_CASE`
  ```python
  API_URL = 'https://api.example.com'
  ```

### CSS/Tailwind

- **Files**: `kebab-case.css`
- **Custom Classes**: `kebab-case`
- **Tailwind**: Follow Tailwind conventions (e.g., `bg-blue-500`, `text-center`)

## Tooling Configuration

### ESLint

ESLint enforces code quality and naming conventions.

**Configuration**: `frontend/.eslintrc.json`

**Key Rules**:
- Naming conventions enforced via `@typescript-eslint/naming-convention`
- React best practices
- TypeScript strict type checking
- Prettier integration

**Usage**:
```bash
# Lint frontend code
cd frontend && yarn lint

# Auto-fix issues
cd frontend && yarn lint:fix
```

### Prettier

Prettier ensures consistent code formatting.

**Configuration**: `frontend/.prettierrc`

**Settings**:
- Semi-colons: Yes
- Single quotes: Yes
- Tab width: 2 spaces
- Print width: 100 characters
- Trailing commas: ES5

**Usage**:
```bash
# Format code
cd frontend && yarn format

# Check formatting
cd frontend && yarn format:check
```

### TypeScript

TypeScript configuration with absolute imports for cleaner imports.

**Configuration**: `frontend/tsconfig.json`

**Features**:
- Absolute imports from `src/` directory
- Path aliases for common directories
  ```tsx
  // Instead of: import Button from '../../components/ui/Button'
  // Use: import Button from 'components/ui/Button'
  ```

### Husky Pre-commit Hooks

Husky automatically runs linting before commits to ensure code quality.

**Configuration**: `.husky/pre-commit`

**Hooks**:
- Runs `yarn lint:fix` on frontend code before commit

## Tailwind CSS

### Configuration

**File**: `frontend/tailwind.config.js`

**Features**:
- Custom color palette
- Dark mode support (class-based)
- Custom utility classes
- Content paths for all component files

### Best Practices

1. **Prefer Tailwind utilities** over custom CSS
2. **Use semantic ordering** for classes:
   ```tsx
   // Layout → Spacing → Sizing → Colors → Typography → Effects
   <div className="flex flex-col w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg">
   ```
3. **Extract repeated patterns** into components
4. **Use Tailwind's built-in responsive design**
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
   ```

## Yarn 4 Best Practices

### Workspaces

AetherOS uses Yarn workspaces for monorepo management:

```bash
# List all workspaces
yarn workspaces list

# Run command in specific workspace
yarn workspace aetheros-frontend run build

# Add dependency to workspace
yarn workspace aetheros-frontend add react-query
```

### Dependency Management

```bash
# Install all dependencies (immutable for CI/CD)
yarn install --immutable

# Add dev dependency
yarn add -D eslint

# Remove dependency
yarn remove package-name

# Update dependencies
yarn up package-name
```

### Cache Management

```bash
# Clear cache
yarn cache clean

# Check cache location
yarn cache dir
```

## Development Workflow

### 1. Start Development Server

```bash
# Frontend
cd frontend && yarn dev

# Or using root scripts
yarn workspace aetheros-frontend run dev
```

### 2. Before Committing

The pre-commit hook will automatically:
1. Run ESLint and auto-fix issues
2. Ensure code passes linting standards

### 3. Building for Production

```bash
# Build frontend
cd frontend && yarn build

# Or from root
yarn build
```

### 4. Testing

```bash
# Run tests
cd frontend && yarn test

# Run tests from root
yarn test
```

## Component Development Example

### Sample Button Component

**File**: `src/components/ui/Button.tsx`

```tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
```

### Sample Utility Function

**File**: `src/utils/formatDate.ts`

```typescript
/**
 * Formats a date into a human-readable string
 * @param date - Date object or ISO string
 * @param format - Format type ('short', 'long', 'relative')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString();
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'relative':
      return getRelativeTime(dateObj);
    default:
      return dateObj.toLocaleDateString();
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / 60000);

  if (diffInMins < 1) return 'just now';
  if (diffInMins < 60) return `${diffInMins} minutes ago`;
  if (diffInMins < 1440) return `${Math.floor(diffInMins / 60)} hours ago`;
  return `${Math.floor(diffInMins / 1440)} days ago`;
}
```

## Validation and Quality Checks

### Pre-deployment Checklist

```bash
# 1. Validate Railpack configuration
yarn validate:railpack-advanced

# 2. Run linting
cd frontend && yarn lint

# 3. Check formatting
cd frontend && yarn format:check

# 4. Run tests
yarn test

# 5. Build for production
yarn build
```

### Continuous Integration

The project includes validation scripts for CI/CD:

```bash
# Validate dependencies
yarn test:deps

# Validate contracts
yarn validate:contracts

# Validate Railpack configs
yarn validate:railpack-advanced
```

## Troubleshooting

### Common Issues

#### 1. Yarn Version Mismatch

```bash
# Ensure Corepack is enabled
corepack enable
corepack prepare yarn@4.9.2 --activate
```

#### 2. Peer Dependency Warnings

```bash
# These are often safe to ignore, but can be resolved:
yarn explain peer-requirements <hash>
```

#### 3. ESLint Errors

```bash
# Auto-fix most issues
cd frontend && yarn lint:fix
```

#### 4. Type Errors

```bash
# Rebuild TypeScript
cd frontend && rm -rf node_modules && yarn install
```

## Additional Resources

- [Yarn 4 Documentation](https://yarnpkg.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

## Summary

This development standards guide ensures:
- **Consistent code style** across the entire project
- **Type safety** with TypeScript
- **Automated quality checks** via Husky and ESLint
- **Modern tooling** with Yarn 4.9.2+
- **Clear naming conventions** for all file types
- **Proper project structure** for scalability

Follow these standards to maintain code quality and team productivity.
