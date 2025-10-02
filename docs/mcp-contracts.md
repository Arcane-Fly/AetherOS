# MCP Contract Schemas

> **Codified contracts for MCP servers ensuring predictable interoperability and early error detection**

## Overview

AetherOS implements JSON Schema contracts for all MCP (Model Context Protocol) server operations. These contracts serve as formal agreements between services, providing:

- ✅ **Predictable interoperability** - Agents know exactly what inputs/outputs/errors to expect
- ✅ **Early failures > late bugs** - Validate requests/responses at the boundary, not after a 500
- ✅ **Self-documenting** - Discover capabilities without spelunking code
- ✅ **Safer upgrades** - When external SDKs change, schema diffs show what breaks
- ✅ **Type safety** - Auto-generate TypeScript types from schemas

## Quick Links

- **Documentation**: [`contracts/README.md`](../contracts/README.md)
- **Quick Start**: [`contracts/QUICKSTART.md`](../contracts/QUICKSTART.md)
- **Changelog**: [`contracts/CHANGELOG.md`](../contracts/CHANGELOG.md)
- **Usage Examples**: [`contracts/examples/usage-example.js`](../contracts/examples/usage-example.js)

## Supported MCP Servers

### Pinecone (Vector Database)
- `upsert` - Insert/update vectors
- `query` - Similarity search

📖 [Pinecone Contracts](../contracts/pinecone/README.md)

### Supabase (Database)
- `sql` - Execute SQL with RLS enforcement

📖 [Supabase Contracts](../contracts/supabase/README.md)

### Browserbase (Browser Automation)
- `navigate` - Browser navigation
- `screenshot` - Capture screenshots

📖 [Browserbase Contracts](../contracts/browserbase/README.md)

### GitHub (API)
- `searchIssues` - Search GitHub issues
- `searchPullRequests` - Search pull requests

📖 [GitHub Contracts](../contracts/github/README.md)

## Directory Structure

```
contracts/
├── README.md                 # Main documentation
├── QUICKSTART.md            # 5-minute getting started guide
├── CHANGELOG.md             # Version history and migration guides
├── package.json             # Isolated dependencies
├── shared/                  # Shared schemas
│   └── error.envelope.json  # Standardized error format
├── pinecone/               # Pinecone operation schemas
│   ├── README.md
│   ├── *.request.json
│   └── *.response.json
├── supabase/               # Supabase operation schemas
├── browserbase/            # Browserbase operation schemas
├── github/                 # GitHub operation schemas
├── validators/             # Runtime validation utilities
│   └── schema-validator.js
├── examples/               # Example fixtures and usage
│   ├── *.json
│   └── usage-example.js
└── scripts/                # Validation and testing
    ├── validate-schemas.js
    ├── validate-examples.js
    └── test-validators.js
```

## Usage

### Validate Contracts

```bash
# From repo root
npm run validate:contracts        # Full validation (schemas + examples)
npm run validate:contracts-quick  # Schema-only validation
npm run test:contracts            # Run validator tests
```

### In Your Service

```javascript
const { validatePineconeUpsertRequest } = require('../../contracts/validators/schema-validator');

// Validate request before API call
const request = { namespace: "prod", vectors: [...] };
const result = validatePineconeUpsertRequest(request);

if (!result.valid) {
  throw new Error('Validation failed: ' + result.errors);
}

// Proceed with API call
const response = await pinecone.upsert(request);
```

### Express Middleware

```javascript
const { validateRequest } = require('../../contracts/examples/usage-example');

router.post('/api/vectors/upsert',
  validateRequest('pinecone/upsert.request.json'),
  handleUpsert
);
```

## Error Handling

All operations use a standardized error envelope:

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Validation failed: namespace is required",
    "retriable": false,
    "details": {
      "validationErrors": [...]
    }
  }
}
```

**Error Codes:**
- `INVALID_INPUT` - Request validation failed
- `AUTH_REQUIRED` - Missing/invalid credentials
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT` - Rate limit exceeded (retriable)
- `UPSTREAM_ERROR` - External service error
- `UNAVAILABLE` - Service temporarily unavailable (retriable)
- `INTERNAL_ERROR` - Unexpected internal error

## Schema Features

Each operation defines:

1. **Request Schema** - Valid inputs with types, constraints, defaults
2. **Response Schema** - Success response shape
3. **Error Schema** - Standardized error envelope
4. **Documentation** - READMEs with examples and best practices
5. **Example Fixtures** - Valid test payloads

All schemas follow [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12/schema).

## Benefits

### For Developers
- Auto-completion in IDEs with TypeScript types
- Catch errors at compile-time, not runtime
- Clear API contracts without reading code
- Consistent error handling across services

### For Operations
- Validate deployments before going live
- Detect breaking changes in dependencies
- Monitor API compatibility over time
- Safer upgrades with migration paths

### For AI Agents
- Precise understanding of operation inputs/outputs
- Validate generated code before execution
- Handle errors consistently across integrations
- Discover capabilities programmatically

## Adding New Contracts

1. Create `{operation}.request.json` and `{operation}.response.json`
2. Add to `validators/schema-validator.js` convenience functions
3. Create example fixtures in `examples/`
4. Write README documentation
5. Run validation: `npm run validate:contracts`
6. Update CHANGELOG with version bump

See [`contracts/CHANGELOG.md`](../contracts/CHANGELOG.md) for detailed guidelines.

## CI/CD Integration

Add to your pipeline:

```yaml
- name: Validate MCP Contracts
  run: npm run validate:contracts
```

This ensures:
- All schemas are valid JSON Schema
- Example fixtures pass validation
- No regressions in validator behavior

## Future Enhancements

- [ ] TypeScript type generation from schemas
- [ ] Additional MCP servers (OpenAI, Anthropic, etc.)
- [ ] GraphQL schema generation
- [ ] OpenAPI spec generation
- [ ] Performance benchmarking
- [ ] Schema versioning strategy
- [ ] Migration tooling

## Resources

- **Main Contracts README**: [`contracts/README.md`](../contracts/README.md)
- **Quick Start Guide**: [`contracts/QUICKSTART.md`](../contracts/QUICKSTART.md)
- **JSON Schema Docs**: https://json-schema.org/
- **Ajv Validator**: https://ajv.js.org/
- **MCP Protocol**: https://modelcontextprotocol.io/

## Version

**Current Version**: 1.0.0 (2024-10-02)

See [`contracts/CHANGELOG.md`](../contracts/CHANGELOG.md) for full version history.

---

💡 **Tip**: Start with the [Quick Start Guide](../contracts/QUICKSTART.md) for hands-on examples in 5 minutes.
