# Changelog

All notable changes to the MCP contract schemas will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-10-02

### Added

#### Core Infrastructure
- Initial release of MCP contract schemas
- Runtime validation using Ajv v8 with JSON Schema Draft 2020-12 support
- Validation utilities in `validators/schema-validator.js`
- Automated validation scripts for schemas and examples
- Comprehensive test suite for all validators

#### Schema Contracts

**Shared Schemas**
- `shared/error.envelope.json` - Standardized error response format with codes:
  - INVALID_INPUT, AUTH_REQUIRED, NOT_FOUND, RATE_LIMIT, UPSTREAM_ERROR, UNAVAILABLE, INTERNAL_ERROR

**Pinecone Schemas**
- `pinecone/upsert.request.json` - Vector upsert operation
- `pinecone/upsert.response.json` - Upsert success response
- `pinecone/query.request.json` - Vector similarity query
- `pinecone/query.response.json` - Query results with matches

**Supabase Schemas**
- `supabase/sql.request.json` - SQL query execution with parameterized queries
- `supabase/sql.response.json` - Query results with rows and metadata

**Browserbase Schemas**
- `browserbase/navigate.request.json` - Browser navigation with viewport and timeout
- `browserbase/navigate.response.json` - Navigation result with final URL
- `browserbase/screenshot.request.json` - Screenshot capture with format options
- `browserbase/screenshot.response.json` - Base64-encoded screenshot data

**GitHub Schemas**
- `github/searchIssues.request.json` - Issue search with filters
- `github/searchIssues.response.json` - Search results with issue details
- `github/searchPullRequests.request.json` - PR search with filters
- `github/searchPullRequests.response.json` - Search results with PR details

#### Documentation
- Main README with comprehensive usage guide
- Individual READMEs for each MCP server with:
  - Operation descriptions
  - Request/response specifications
  - Error handling details
  - Best practices
  - Example code
- Usage examples in `examples/usage-example.js`
- Example fixtures for all operations

#### Testing & Validation
- Schema validation script (`scripts/validate-schemas.js`)
- Example validation script (`scripts/validate-examples.js`)
- Validator test suite (`scripts/test-validators.js`)
- Integration with root package.json scripts:
  - `validate:contracts` - Full validation suite
  - `validate:contracts-quick` - Schema-only validation
  - `test:contracts` - Run validator tests

### Features

- **Type Safety**: All schemas use strict typing with additionalProperties: false
- **Validation**: Required fields, min/max constraints, enums, format validation
- **Documentation**: Every field includes a description
- **Examples**: Valid example fixtures for testing
- **Error Handling**: Standardized error envelope across all operations
- **Retriable Flags**: Errors indicate whether operations can be safely retried
- **Convenience Functions**: Pre-built validators for common operations
- **Express Middleware**: Ready-to-use middleware for API validation

### Schema Guidelines

1. All schemas include `$schema`, `$id`, and `title` fields
2. Use `additionalProperties: false` to catch typos early
3. Provide `description` for all properties
4. Use appropriate JSON Schema types and formats
5. Include constraints (min/max, minLength, maxLength, etc.)
6. Use enums for fixed value sets
7. Set sensible defaults where applicable
8. Follow consistent naming conventions (camelCase for properties)

### Breaking Changes

N/A - Initial release

### Migration Guide

N/A - Initial release

### Known Issues

None at this time

### Future Plans

- TypeScript type generation from schemas
- Additional MCP server contracts (OpenAI, Anthropic, etc.)
- Schema versioning strategy
- GraphQL schema generation
- OpenAPI spec generation
- Additional validation middleware patterns
- Performance benchmarks
- CI/CD integration examples

---

## Guidelines for Future Changes

### Adding New Schemas

1. Create request and response JSON schema files
2. Add convenience validation functions to `validators/schema-validator.js`
3. Create example fixtures in `examples/`
4. Update the mapping in `scripts/validate-examples.js`
5. Add README documentation for the new operation
6. Update this CHANGELOG with details
7. Increment version following semver

### Making Breaking Changes

- Increment major version (x.0.0)
- Document migration path in CHANGELOG
- Provide migration scripts if needed
- Announce deprecation timeline
- Support old version for at least one minor release

### Making Non-Breaking Changes

- Increment minor version (1.x.0) for new features
- Increment patch version (1.0.x) for bug fixes
- Always maintain backward compatibility
- Add optional fields with defaults
- Expand enums (don't remove values)

### Testing Requirements

- All new schemas must have example fixtures
- All validators must have test coverage
- Run full validation suite before releases
- Test with real payloads when possible

---

[1.0.0]: https://github.com/Arcane-Fly/AetherOS/releases/tag/contracts-v1.0.0
