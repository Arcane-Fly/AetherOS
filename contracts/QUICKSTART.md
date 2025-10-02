# Quick Start Guide - MCP Contract Schemas

Get started with MCP contract validation in 5 minutes.

## Installation

The contracts are already part of the AetherOS monorepo. To use them in your service:

```bash
# From any service directory
cd /path/to/AetherOS
npm run validate:contracts  # Run all validations
```

## Basic Usage

### 1. Import the Validator

```javascript
const { 
  validatePineconeUpsertRequest,
  validator 
} = require('../../contracts/validators/schema-validator');
```

### 2. Validate a Request

```javascript
// Method 1: Using convenience functions
const request = {
  namespace: "production",
  vectors: [{ id: "doc1", values: [0.1, 0.2, 0.3] }]
};

const result = validatePineconeUpsertRequest(request);
if (!result.valid) {
  console.error('Validation failed:', validator.formatErrors(result.errors));
  // Handle error
}

// Method 2: Using validateOrThrow (cleaner for error handling)
try {
  validator.validateOrThrow('pinecone/upsert.request.json', request);
  // Proceed with operation
} catch (error) {
  // Error automatically formatted with error envelope
  return res.status(400).json(JSON.parse(error.message));
}
```

### 3. Validate a Response

```javascript
// After calling external service
const response = await pineconeClient.upsert(request);

// Validate the response matches expected schema
const validation = validator.validate('pinecone/upsert.response.json', response);
if (!validation.valid) {
  throw new Error('Upstream service returned invalid response');
}
```

## Express Integration

### Middleware Pattern

```javascript
const { validator } = require('../../contracts/validators/schema-validator');

function validateRequest(schemaPath) {
  return (req, res, next) => {
    const validation = validator.validate(schemaPath, req.body);
    
    if (!validation.valid) {
      return res.status(400).json({
        error: {
          code: "INVALID_INPUT",
          message: validator.formatErrors(validation.errors),
          retriable: false
        }
      });
    }
    
    next();
  };
}

// Use in routes
router.post('/api/vectors/upsert',
  validateRequest('pinecone/upsert.request.json'),
  async (req, res) => {
    // Request is already validated
    const result = await handleUpsert(req.body);
    res.json(result);
  }
);
```

## Available Validators

### Convenience Functions (Recommended)

```javascript
const {
  // Pinecone
  validatePineconeUpsertRequest,
  validatePineconeUpsertResponse,
  validatePineconeQueryRequest,
  validatePineconeQueryResponse,
  
  // Supabase
  validateSupabaseSqlRequest,
  validateSupabaseSqlResponse,
  
  // Browserbase
  validateBrowserbaseNavigateRequest,
  validateBrowserbaseNavigateResponse,
  validateBrowserbaseScreenshotRequest,
  validateBrowserbaseScreenshotResponse,
  
  // GitHub
  validateGitHubSearchIssuesRequest,
  validateGitHubSearchIssuesResponse,
  validateGitHubSearchPRsRequest,
  validateGitHubSearchPRsResponse,
  
  // Error envelope
  validateErrorEnvelope
} = require('../../contracts/validators/schema-validator');
```

### Generic Validator

```javascript
const { validator } = require('../../contracts/validators/schema-validator');

// Validate any schema by path
validator.validate('pinecone/upsert.request.json', data);
validator.validateOrThrow('supabase/sql.request.json', data);
```

## Error Handling

All operations use a standardized error envelope:

```javascript
{
  "error": {
    "code": "INVALID_INPUT",      // Error code (enum)
    "message": "Validation failed", // Human-readable message
    "retriable": false,             // Can retry?
    "details": {                    // Additional context
      "validationErrors": [...]
    }
  }
}
```

### Error Codes

- `INVALID_INPUT` - Request validation failed (not retriable)
- `AUTH_REQUIRED` - Missing/invalid credentials (not retriable)
- `NOT_FOUND` - Resource not found (not retriable)
- `RATE_LIMIT` - Rate limit exceeded (retriable with backoff)
- `UPSTREAM_ERROR` - External service error (may be retriable)
- `UNAVAILABLE` - Service temporarily unavailable (retriable)
- `INTERNAL_ERROR` - Unexpected error (not retriable)

## Common Patterns

### Pattern 1: Validate Before External API Call

```javascript
async function safeUpsert(data) {
  // Validate input
  validator.validateOrThrow('pinecone/upsert.request.json', data);
  
  // Make API call
  const response = await pineconeClient.upsert(data);
  
  // Validate response
  const validation = validator.validate('pinecone/upsert.response.json', response);
  if (!validation.valid) {
    throw new Error('Invalid upstream response');
  }
  
  return response;
}
```

### Pattern 2: Express Error Handler

```javascript
app.use((err, req, res, next) => {
  // Check if error is our standardized format
  try {
    const errorObj = JSON.parse(err.message);
    if (errorObj.error) {
      return res.status(400).json(errorObj);
    }
  } catch (e) {
    // Not our format, handle normally
  }
  
  // Default error handling
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: err.message,
      retriable: false
    }
  });
});
```

### Pattern 3: Retry Logic for Retriable Errors

```javascript
async function withRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const errorObj = JSON.parse(error.message);
      
      if (!errorObj.error?.retriable || i === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
}
```

## Testing

### Validate Your Schemas

```bash
# From repo root
npm run validate:contracts        # Full validation
npm run validate:contracts-quick  # Schema-only validation
npm run test:contracts            # Run validator tests
```

### Test with Example Fixtures

See `contracts/examples/` for valid example payloads for each operation.

## Next Steps

1. **Read the READMEs**: Check `contracts/*/README.md` for detailed operation docs
2. **See Examples**: Review `contracts/examples/usage-example.js` for more patterns
3. **Add New Operations**: Follow the structure to add more MCP server contracts
4. **Generate Types**: Use `json-schema-to-typescript` for TypeScript type generation

## Need Help?

- Check the main README: `contracts/README.md`
- Review CHANGELOG: `contracts/CHANGELOG.md`
- Run examples: `cd contracts && node examples/usage-example.js`
- Explore tests: `cd contracts && npm test`

## Links

- [JSON Schema Documentation](https://json-schema.org/)
- [Ajv Validator](https://ajv.js.org/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
