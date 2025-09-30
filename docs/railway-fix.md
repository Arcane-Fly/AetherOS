# Railway Railpack Configuration Fix

## Issue Summary

Railway deployment was failing with the error:
```
sh: 1: enable: not found
ERROR: failed to build: process "sh -c enable corepack && yarn install && yarn build" 
did not complete successfully: exit code: 127
```

## Root Cause

1. **Auto-generation Problem**: The main `railpack.json` only specified `"provider": "node"` without explicit install/build commands
2. **Shell Environment**: Railway executes commands in `/bin/sh` (dash), not `/bin/bash`
3. **Invalid Command**: Railpack auto-generated `enable corepack` command, but `enable` is a bash built-in unavailable in sh
4. **Redundancy**: Corepack was already enabled during the install phase

## Solution Implemented

### 1. Explicit Railpack Commands

Updated `/railpack.json` with explicit commands:

```json
{
  "services": {
    "frontend": {
      "build": {
        "provider": "node",
        "installCommand": "yarn install --immutable",
        "buildCommand": "yarn build"
      },
      "start": {
        "command": "yarn start"
      }
    },
    "auth-service": {
      "build": {
        "provider": "node",
        "installCommand": "yarn install --immutable"
      },
      "start": {
        "command": "yarn start"
      }
    }
  }
}
```

### 2. Yarn Version Consistency

- Updated all services to use `"packageManager": "yarn@4.9.2"`
- Regenerated lockfiles with Yarn 4.9.2
- Used `--immutable` flag (modern replacement for `--frozen-lockfile`)

### 3. Workspace Configuration

Updated root `package.json`:

```json
{
  "private": true,
  "workspaces": [
    "frontend",
    "backend/services/*"
  ],
  "scripts": {
    "install:all": "yarn install",
    "lint": "yarn workspaces foreach --parallel run lint",
    "test": "yarn workspaces foreach --parallel run test",
    "build": "yarn workspace aetheros-frontend run build"
  }
}
```

### 4. Validation Infrastructure

Created `scripts/validate-railpack.sh` to:
- Check JSON syntax
- Detect bash built-in commands
- Validate explicit command configuration
- Prevent future auto-generation issues

## Commands

### Frontend (React Build Required)
- **Install**: `yarn install --immutable`
- **Build**: `yarn build`
- **Start**: `yarn start`

### Backend Services (Node.js - No Build Step)
- **Install**: `yarn install --immutable`
- **Start**: `yarn start`

## Prevention

1. **Validation Script**: Run `yarn validate:railpack-advanced` before deployment
2. **Explicit Commands**: Always define `installCommand` and `buildCommand` in railpack.json
3. **Shell Compatibility**: Test commands work in `/bin/sh`, not just bash
4. **CI Integration**: Add railpack validation to CI pipeline

## Testing

```bash
# Validate configuration
yarn validate:railpack-advanced

# Test workspace functionality
yarn workspaces list
yarn install:all

# Test builds
cd frontend && yarn build
cd backend/services/auth-service && yarn install --immutable
```

## References

- [Railway Build Configuration](https://docs.railway.com/guides/build-configuration)
- [Railpack Adding Steps](https://railpack.com/guides/adding-steps/)
- [Yarn Workspaces](https://yarnpkg.com/features/workspaces)
- [Corepack Documentation](https://yarnpkg.com/corepack)

## Key Lessons

1. **Explicit > Implicit**: Always define explicit commands to prevent auto-generation
2. **Shell Environment Matters**: Railway uses `/bin/sh`, not `/bin/bash`
3. **Package Manager Consistency**: All services should use the same package manager version
4. **Validation is Critical**: Automated validation prevents deployment failures