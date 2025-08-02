# AetherOS Code Style Guide

This document establishes consistent code formatting and naming conventions for all AetherOS projects.

## General Principles

*   **Readability First:** Code should be easy to read and understand by other developers
*   **Consistency:** Apply these rules uniformly across the entire codebase
*   **Automated Enforcement:** Use linters and formatters to enforce these standards automatically
*   **Team Agreement:** These standards are agreed upon by the development team

## Formatting (All Languages)

### Indentation

*   **Spaces:** Use 2 spaces for indentation. No tabs
*   **Rationale:** Ensures consistent appearance across different editors and environments

### Line Length

*   **Maximum:** 100 characters per line
*   **Rationale:** Balances readability with information density, works well with modern displays

### Whitespace

*   Trailing whitespace at the end of lines is prohibited
*   Use a single blank line to separate logical sections of code
*   Files should end with a single newline character
*   No multiple consecutive blank lines

## Naming Conventions

### JavaScript / Node.js

*   **Variables & Functions:** `camelCase`
*   **Constants:** `UPPER_SNAKE_CASE` (for module-level constants)
*   **Classes:** `PascalCase`
*   **Files:** Use `kebab-case` for filenames (e.g., `user-service.js`, `auth-controller.js`)
*   **Directories:** Use `kebab-case` for directory names
*   **Private Methods:** Prefix with `_` (e.g., `_validateInput()`)

### React Components

*   **Component Names:** `PascalCase` (e.g., `UserProfile`, `ChatMessage`)
*   **Component Files:** `PascalCase.js` or `PascalCase.jsx` (e.g., `UserProfile.jsx`)
*   **Props:** `camelCase`
*   **Event Handlers:** `handle` prefix (e.g., `handleClick`, `handleSubmit`)
*   **Custom Hooks:** `use` prefix (e.g., `useAuth`, `useLocalStorage`)

### CSS Classes (Tailwind)

*   Follow Tailwind CSS utility naming conventions
*   Use semantic class names for custom CSS when needed
*   Organize Tailwind classes logically: layout → spacing → sizing → colors → typography → effects

### Database (PostgreSQL)

*   **Tables:** `snake_case` (e.g., `user_profiles`, `chat_messages`)
*   **Columns:** `snake_case` (e.g., `first_name`, `created_at`)
*   **Primary Keys:** `id`
*   **Foreign Keys:** `{referenced_table_singular}_id` (e.g., `user_id`)
*   **Constraints:** Descriptive names with table prefixes

## File Organization Patterns

### Backend (Express.js Microservices)

```
src/
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   └── generation.controller.js
├── services/
│   ├── auth.service.js
│   ├── openai.service.js
│   └── database.service.js
├── middleware/
│   ├── auth.middleware.js
│   ├── validation.middleware.js
│   └── rate-limit.middleware.js
├── models/
│   ├── user.model.js
│   └── creation.model.js
├── routes/
│   ├── auth.routes.js
│   ├── api.routes.js
│   └── index.js
├── utils/
│   ├── logger.js
│   ├── validation.js
│   └── helpers.js
├── config/
│   └── database.js
└── server.js
```

### Frontend (React)

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   └── Modal.jsx
│   ├── layout/          # Layout components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   └── features/        # Feature-specific components
│       ├── auth/
│       ├── chat/
│       └── generation/
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   └── Dashboard.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useApi.js
│   └── useLocalStorage.js
├── services/
│   ├── api.js
│   ├── auth.service.js
│   └── socket.service.js
├── utils/
│   ├── helpers.js
│   ├── constants.js
│   └── validators.js
├── assets/
│   ├── images/
│   └── icons/
├── App.jsx
└── index.js
```

## Code Documentation

### Comments

*   Use comments to explain **why**, not **what**
*   Write clear, concise comments in English
*   Avoid obvious comments that just restate the code
*   Use JSDoc format for function documentation

### JSDoc Examples

```javascript
/**
 * Generates code based on user prompt using OpenAI API
 * @param {string} prompt - The user's natural language prompt
 * @param {string} language - Target programming language
 * @param {Object} options - Additional generation options
 * @returns {Promise<Object>} Generated code and metadata
 * @throws {Error} When API call fails or quota exceeded
 */
async function generateCode(prompt, language, options = {}) {
  // Implementation
}
```

## Linting & Formatting Tools

### JavaScript/React

*   **Formatter:** Prettier
*   **Linter:** ESLint with React and Node.js configurations
*   **Configuration:** Use `.eslintrc.js` and `.prettierrc` files
*   **Editor Integration:** Enable format on save

### Package Manager Commands

```bash
# Install and setup linting
yarn add -D eslint prettier eslint-config-prettier eslint-plugin-react

# Run linting
yarn lint

# Run formatting
yarn format

# Fix linting issues automatically
yarn lint --fix
```

### Recommended ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'prettier',
  ],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'prefer-const': 'error',
    'react/prop-types': 'off', // Turn off if using TypeScript
  },
};
```

### Recommended Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```