# Supabase MCP Contracts

This directory contains JSON Schema contracts for Supabase database operations.

## Operations

### supabase.sql (v1)
**Purpose:** Execute SQL queries with RLS (Row Level Security) enforcement.

#### Request
Validates against: `contracts/supabase/sql.request.json`

- `query` (string, required) - SQL query to execute
- `params` (array, optional) - Parameterized query values (string|number|boolean|null)
- `timeout` (integer, default: 30000) - Query timeout in ms (1000-300000)
- `readOnly` (boolean, default: false) - Whether this is a read-only query

#### Response
Validates against: `contracts/supabase/sql.response.json`

- `rows` (object[]) - Result rows from query
- `rowCount` (integer) - Number of rows affected/returned
- `fields` (object[], optional) - Field metadata with name and dataType
- `executionTime` (number) - Query execution time in ms

#### Errors
Uses `error.envelope.json` with codes:
- `INVALID_INPUT` - Invalid SQL syntax or parameters
- `AUTH_REQUIRED` - Missing or invalid credentials
- `NOT_FOUND` - Table or resource not found
- `RATE_LIMIT` - Rate limit exceeded
- `UPSTREAM_ERROR` - Supabase/PostgreSQL error
- `UNAVAILABLE` - Database temporarily unavailable
- `INTERNAL_ERROR` - Unexpected internal error

## Security Considerations

1. **Always use parameterized queries** to prevent SQL injection
2. **RLS policies** are enforced at the database level
3. **Timeouts** prevent long-running queries from blocking resources
4. **Read-only flag** provides additional safety for query operations

## Example Usage

```javascript
import { validateSupabaseSql } from '../validators/supabase';

// Safe parameterized query
const request = {
  query: "SELECT * FROM users WHERE email = $1 AND active = $2",
  params: ["user@example.com", true],
  timeout: 5000,
  readOnly: true
};

const validatedRequest = await validateSupabaseSql(request);

// Execute query with validation
const response = await executeSupabaseQuery(validatedRequest);
```

## Best Practices

1. Use parameterized queries (`$1`, `$2`, etc.) instead of string interpolation
2. Set appropriate timeouts based on query complexity
3. Mark queries as `readOnly: true` when possible for additional safety
4. Always validate responses to catch schema mismatches early
5. Handle retriable errors (RATE_LIMIT, UNAVAILABLE) with exponential backoff

## Version History

- **v1.0.0** (2024-10) - Initial contract definitions
