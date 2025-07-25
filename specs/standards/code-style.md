# AetherOS Code Style Guide

This document establishes consistent code formatting and naming conventions for all AetherOS projects.

## General Principles

*   **Readability First:** Code should be easy to read and understand by other developers.
*   **Consistency:** Apply these rules uniformly across the entire codebase.
*   **Automated Enforcement:** Use linters and formatters to enforce these standards automatically.

## Formatting (All Languages)

### Indentation

*   **Spaces:** Use 2 spaces for indentation. No tabs.
*   **Rationale:** Ensures consistent appearance across different editors and environments.

### Line Length

*   **Maximum:** 100 characters per line.
*   **Rationale:** Balances readability with information density.

### Whitespace

*   Trailing whitespace at the end of lines is prohibited.
*   Use a single blank line to separate logical sections of code.
*   Files should end with a single newline character.

## Naming Conventions

### TypeScript / JavaScript / NestJS

*   **Variables & Functions:** `camelCase`
*   **Classes, Interfaces, Types, Enums:** `PascalCase`
*   **Constants:** `UPPER_SNAKE_CASE` (especially for configuration values)
*   **Private Members:** Prefix with `_` (e.g., `private _internalState: string;`)
*   **Files:** Use `kebab-case` for filenames (e.g., `user.service.ts`, `auth.controller.ts`).
*   **Directories:** Use `kebab-case` for directory names.

### Python

*   **Variables, Functions, Methods:** `snake_case`
*   **Classes, Exceptions:** `PascalCase`
*   **Constants:** `UPPER_SNAKE_CASE`
*   **Private Members:** Prefix with `_` (single underscore) or `__` (double underscore for name mangling).
*   **Files & Modules:** `snake_case.py`
*   **Packages:** `lowercase` (preferably single word, or `snake_case` if necessary).

### Go

*   **Variables, Functions, Methods, Packages:** `camelCase` (public/exported start with `Capital`, private with `lowercase`)
*   **Types, Structs, Interfaces:** `PascalCase`
*   **Constants:** `UPPER_SNAKE_CASE` or `camelCase` depending on scope (prefer `UPPER_SNAKE_CASE` for package-level constants).
*   **Files:** `snake_case.go`

### SQL (PostgreSQL)

*   **Tables, Columns, Constraints:** `snake_case`
*   **Primary Keys:** `id`
*   **Foreign Keys:** `{referenced_table_singular}_id` (e.g., `user_id`)

## File Organization Patterns

### Backend (NestJS)

```
src/
├── modules/
│   ├── auth/
│   │   ├── dto/
│   │   ├── entities/ (or models/)
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── guards/ (if needed)
│   ├── creation/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── creation.controller.ts
│   │   ├── creation.service.ts
│   │   ├── creation.module.ts
│   │   └── ...
│   └── app.module.ts
├── shared/
│   ├── exceptions/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── utils/
├── main.ts
└── config/
    └── configuration.ts
```

### Frontend (React)

```
src/
├── components/
│   ├── ui/ (atoms/molecules)
│   ├── layout/ (organisms/templates)
│   └── specific/ (page-specific components)
├── pages/
│   ├── Home/
│   │   ├── Home.tsx
│   │   ├── Home.module.css (or use Tailwind classes)
│   │   └── index.ts (for exports)
│   └── ...
├── services/ (API clients)
├── hooks/
├── store/ (Redux slices, store setup)
├── utils/
├── types/
├── assets/
├── App.tsx
└── main.tsx
```

## Linting & Formatting Tools

### TypeScript / JavaScript

*   **Formatter:** Prettier
*   **Linter:** ESLint (with recommended TypeScript/React configs)
*   **Configuration:** Shareable configs via `package.json` or `.eslintrc.js`.

### Python

*   **Formatter:** Black
*   **Linter:** Ruff (combines flake8, isort, and more)
*   **Configuration:** `pyproject.toml` or `setup.cfg`.

### Go

*   **Formatter:** `gofmt` (standard)
*   **Linter:** `golangci-lint`
*   **Configuration:** `.golangci.yml`.

### SQL

*   **Formatter/Linter:** `sqlfluff`