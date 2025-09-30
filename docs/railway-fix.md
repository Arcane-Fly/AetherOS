# Railway Railpack Configuration Fix

## Issue Summary

Railway deployment was failing with the error:
```
sh: 1: enable: not found
ERROR: failed to build: process "sh -c enable corepack && yarn install && yarn build" 
did not complete successfully: exit code: 127
```

# Railway Railpack Configuration Fix

## Issue Summary

Railway deployment was failing with the error:
```
sh: 1: enable: not found
ERROR: failed to build: process "sh -c enable corepack && yarn install && yarn build" 
did not complete successfully: exit code: 127
```

## Root Cause

1. **Invalid Schema Problem**: The main `railpack.json` used an undocumented "services" schema that Railpack doesn't recognize
2. **Auto-generation Fallback**: When Railpack couldn't parse the invalid schema, it fell back to auto-detection
3. **Shell Environment**: Railway executes commands in `/bin/sh` (dash), not `/bin/bash`  
4. **Invalid Command**: Railpack auto-generated `enable corepack` command, but `enable` is a bash built-in unavailable in sh
5. **Silent Failure**: Railpack silently ignored the invalid configuration file and used auto-detection instead

## Solution Implemented

### 1. Fixed Invalid Railpack Schema

**BEFORE (Invalid "services" schema):**
```json
{
  "version": "1",
  "services": {
    "frontend": {
      "build": {
        "provider": "node",
        "installCommand": "yarn install --immutable",
        "buildCommand": "yarn build"
      }
    }
  }
}
```

**AFTER (Proper Railpack schema):**
```json
{
  "$schema": "https://schema.railpack.com",
  "provider": "node",
  "packages": {
    "node": "20.19.5"
  },
  "steps": {
    "install": {
      "commands": ["yarn install --immutable"],
      "caches": ["yarn-cache"]
    },
    "build": {
      "inputs": [{ "step": "install" }],
      "commands": ["yarn workspace aetheros-frontend build"]
    }
  },
  "deploy": {
    "startCommand": "yarn workspace aetheros-frontend start",
    "inputs": [{ "step": "build", "include": ["."] }]
  }
}
```

### 2. Updated Service-Specific Configurations

Updated all service-specific `railpack.json` files to use:
- Proper `$schema` field pointing to `https://schema.railpack.com` 
- Updated `--frozen-lockfile` to `--immutable` (Yarn 4.x compatibility)

**Service files updated:**
- `frontend/railpack.json`
- `backend/services/auth-service/railpack.json`
- `backend/services/generation-service/railpack.json` 
- `backend/services/websocket-service/railpack.json`

### 3. Enhanced Validation Infrastructure

Updated `scripts/validate-railpack.sh` to:
- Check JSON syntax validation
- Detect bash built-in commands that fail in sh environment
- **NEW:** Validate proper Railpack schema usage and detect invalid "services" format
- Ensure explicit commands prevent auto-generation issues
- **NEW:** Validate proper Railpack schema usage and detect invalid "services" format
- Ensure explicit commands prevent auto-generation issues

## Key Changes Summary

### ✅ Fixed: Invalid Schema
- **Before:** Used undocumented "services" schema that Railpack ignored
- **After:** Proper Railpack schema with `$schema`, `steps`, and `deploy` fields

### ✅ Fixed: Auto-Generation 
- **Before:** Railpack fell back to auto-detection, generating `enable corepack`
- **After:** Explicit commands prevent any auto-generation

### ✅ Fixed: Shell Compatibility
- **Before:** `enable` is bash built-in, fails in Railway's `/bin/sh`
- **After:** Only POSIX-compatible commands used

### ✅ Enhanced: Validation
- Added schema validation to prevent future invalid configurations
- Enhanced bash built-in detection
- Yarn 4.x compatibility (`--immutable` vs `--frozen-lockfile`)

## Prevention

1. **Schema Validation**: Run `yarn validate:railpack-advanced` before deployment
2. **Proper Format**: Always use Railpack's official schema with `$schema` field
3. **Shell Compatibility**: Test commands work in `/bin/sh`, not just bash
4. **CI Integration**: Validation script catches issues before deployment

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