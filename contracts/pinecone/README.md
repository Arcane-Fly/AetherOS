# Pinecone MCP Contracts

This directory contains JSON Schema contracts for Pinecone vector database operations.

## Operations

### pinecone.upsert (v1)
**Purpose:** Insert or update vectors in a Pinecone namespace.

#### Request
Validates against: `contracts/pinecone/upsert.request.json`

- `namespace` (string, required) - The namespace to upsert vectors into
- `vectors[]` (array, required) - Array of vectors with:
  - `id` (string, required) - Unique identifier
  - `values` (number[], required) - Vector embedding values
  - `metadata` (object, optional) - Associated metadata
- `batchSize` (integer, default: 100) - Vectors per batch (1-1000)

#### Response
Validates against: `contracts/pinecone/upsert.response.json`

- `upsertedCount` (integer) - Number of vectors successfully upserted
- `warnings` (string[]) - Non-fatal warnings

#### Errors
Uses `error.envelope.json` with codes:
- `INVALID_INPUT` - Invalid request parameters
- `AUTH_REQUIRED` - Missing or invalid API key
- `RATE_LIMIT` - Rate limit exceeded
- `UPSTREAM_ERROR` - Pinecone service error
- `UNAVAILABLE` - Service temporarily unavailable
- `INTERNAL_ERROR` - Unexpected internal error

---

### pinecone.query (v1)
**Purpose:** Query vectors by similarity from a Pinecone namespace.

#### Request
Validates against: `contracts/pinecone/query.request.json`

- `namespace` (string, required) - The namespace to query
- `vector` (number[], required) - Query vector for similarity search
- `topK` (integer, default: 10) - Number of results (1-10000)
- `filter` (object, optional) - Metadata filter
- `includeMetadata` (boolean, default: true) - Include metadata in results
- `includeValues` (boolean, default: false) - Include vector values in results

#### Response
Validates against: `contracts/pinecone/query.response.json`

- `matches[]` (array) - Matching vectors with:
  - `id` (string) - Vector identifier
  - `score` (number) - Similarity score (0-1)
  - `values` (number[], optional) - Vector values if requested
  - `metadata` (object, optional) - Metadata if requested
- `namespace` (string) - Namespace that was queried

#### Errors
Uses `error.envelope.json` with codes:
- `INVALID_INPUT` - Invalid query parameters
- `AUTH_REQUIRED` - Missing or invalid API key
- `NOT_FOUND` - Namespace not found
- `RATE_LIMIT` - Rate limit exceeded
- `UPSTREAM_ERROR` - Pinecone service error
- `UNAVAILABLE` - Service temporarily unavailable
- `INTERNAL_ERROR` - Unexpected internal error

## Example Usage

```javascript
import { validatePineconeUpsert, validatePineconeQuery } from '../validators/pinecone';

// Upsert example
const upsertRequest = {
  namespace: "production",
  vectors: [
    {
      id: "doc-1",
      values: [0.1, 0.2, 0.3, 0.4],
      metadata: { source: "doc1.txt" }
    }
  ],
  batchSize: 100
};

await validatePineconeUpsert(upsertRequest);

// Query example
const queryRequest = {
  namespace: "production",
  vector: [0.1, 0.2, 0.3, 0.4],
  topK: 5,
  includeMetadata: true
};

await validatePineconeQuery(queryRequest);
```

## Version History

- **v1.0.0** (2024-10) - Initial contract definitions
