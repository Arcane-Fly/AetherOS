# MCP Contract Schemas

This directory contains JSON Schema contracts for all MCP (Model Context Protocol) server operations in AetherOS. These schemas serve as formal contracts between services, ensuring predictable interoperability and early error detection.

## Why Contracts?

**Predictable interoperability**: Agents and services know exactly what inputs/outputs/errors to expect.

**Early failures > late bugs**: Validate requests/responses at the boundary, not after a 500 error.

**Self-documenting**: Developers can discover capabilities without spelunking code.

**Safer upgrades**: When external SDKs change, schema diffs show what breaks.

**Type safety**: Generate TypeScript types automatically from schemas.

## Directory Structure

```
contracts/
├── shared/              # Shared schemas used across all services
│   └── error.envelope.json
├── pinecone/           # Vector database operations
│   ├── upsert.request.json
│   ├── upsert.response.json
│   ├── query.request.json
│   ├── query.response.json
│   └── README.md
├── supabase/           # Database operations
│   ├── sql.request.json
│   ├── sql.response.json
│   └── README.md
├── browserbase/        # Browser automation
│   ├── navigate.request.json
│   ├── navigate.response.json
│   ├── screenshot.request.json
│   ├── screenshot.response.json
│   └── README.md
├── github/             # GitHub API operations
│   ├── searchIssues.request.json
│   ├── searchIssues.response.json
│   ├── searchPullRequests.request.json
│   ├── searchPullRequests.response.json
│   └── README.md
└── examples/           # Example fixtures for testing
```

## Schema Structure

Each operation has:
1. **Request schema** - Defines valid inputs with types, constraints, and defaults
2. **Response schema** - Defines success response shape
3. **Error schema** - Uses shared error envelope for consistency

All schemas follow [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12/schema).

## Error Handling

All operations use a standardized error envelope (`shared/error.envelope.json`) with:

- `code`: Standardized error code (INVALID_INPUT, AUTH_REQUIRED, etc.)
- `message`: Human-readable error description
- `retriable`: Boolean flag indicating if operation can be retried
- `details`: Additional context-specific information

### Error Codes

- `INVALID_INPUT` - Request validation failed
- `AUTH_REQUIRED` - Missing or invalid authentication
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT` - Rate limit exceeded (retriable with backoff)
- `UPSTREAM_ERROR` - External service error (may be retriable)
- `UNAVAILABLE` - Service temporarily unavailable (retriable)
- `INTERNAL_ERROR` - Unexpected internal error

## Usage

### Runtime Validation

Install dependencies:
```bash
yarn add ajv ajv-formats
```

Example validator wrapper:
```javascript
import Ajv from "ajv";
import addFormats from "ajv-formats";
import requestSchema from "../contracts/pinecone/upsert.request.json";
import responseSchema from "../contracts/pinecone/upsert.response.json";

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);

const validateRequest = ajv.compile(requestSchema);
const validateResponse = ajv.compile(responseSchema);

export async function pineconeUpsert(operation, doUpsert) {
  // Validate request
  if (!validateRequest(operation)) {
    throw new Error(JSON.stringify({
      error: {
        code: "INVALID_INPUT",
        message: ajv.errorsText(validateRequest.errors)
      }
    }));
  }
  
  // Execute operation
  const result = await doUpsert(operation);
  
  // Validate response
  if (!validateResponse(result)) {
    throw new Error(JSON.stringify({
      error: {
        code: "UPSTREAM_ERROR",
        message: ajv.errorsText(validateResponse.errors)
      }
    }));
  }
  
  return result;
}
```

### Type Generation

Generate TypeScript types from schemas:
```bash
yarn add -D json-schema-to-typescript
npx json2ts contracts/**/*.json --output types/
```

### Testing

Validate example fixtures against schemas:
```bash
yarn validate:contracts
```

## Best Practices

1. **Version schemas**: Use semantic versioning in `$id` field
2. **Document changes**: Update CHANGELOG and migration notes on schema changes
3. **Test with fixtures**: Keep example payloads in `examples/` directory
4. **Validate both ways**: Check requests AND responses at boundaries
5. **Handle retriable errors**: Implement exponential backoff for retriable error codes
6. **Generate types**: Auto-generate TypeScript types for compile-time safety
7. **Keep it strict**: Use `additionalProperties: false` to catch typos early

## CI/CD Integration

Add to your CI pipeline:
```yaml
- name: Validate Contract Schemas
  run: yarn validate:contracts

- name: Generate TypeScript Types
  run: yarn generate:types
```

## Contributing

When adding a new MCP operation:

1. Create request and response schemas in appropriate directory
2. Follow existing naming conventions (`operation.request.json`, `operation.response.json`)
3. Include examples in schema descriptions
4. Update directory README with operation documentation
5. Add example fixtures to `examples/` directory
6. Test validation with real payloads
7. Generate and commit TypeScript types

## Version History

- **v1.0.0** (2024-10) - Initial contract definitions for Pinecone, Supabase, Browserbase, and GitHub

## References

- [JSON Schema Documentation](https://json-schema.org/)
- [Ajv Validator](https://ajv.js.org/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
