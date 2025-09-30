# Memory Graph Implementation

## Overview

The Memory Graph system implements a network of entities and relationships that enables multi-agent reasoning without relying on raw text. This allows agents to:

- **Compose outputs**: Structure data as nodes/edges that other agents can query
- **Compress context**: Fetch only relevant subgraphs instead of long prompts  
- **Enable traceability**: Make decisions explainable through graph connections

## Architecture

### Core Components

1. **Agent A: Ingestor** - Extracts entities and relationships from text
2. **Agent B: Planner** - Answers questions using graph-only queries
3. **Memory Graph Database** - Stores nodes and edges with properties
4. **Entity Schema** - Defines Service, EnvVar, and Incident types

### Database Schema

```sql
-- Nodes table for entities
CREATE TABLE memory_nodes (
  id VARCHAR(255) PRIMARY KEY,              -- e.g., "svc:crm7", "env:SUPABASE_URL"
  type VARCHAR(50) NOT NULL,                -- "Service", "EnvVar", "Incident"
  properties JSONB DEFAULT '{}',            -- Entity-specific data
  source_info JSONB DEFAULT '{}',           -- Auditability (file, line, run_id)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Edges table for relationships  
CREATE TABLE memory_edges (
  id SERIAL PRIMARY KEY,
  type VARCHAR(100) NOT NULL,               -- "SERVICE_REQUIRES_ENVVAR", etc.
  from_node VARCHAR(255) REFERENCES memory_nodes(id),
  to_node VARCHAR(255) REFERENCES memory_nodes(id),
  properties JSONB DEFAULT '{}',            -- Relationship metadata
  source_info JSONB DEFAULT '{}',           -- Auditability  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(type, from_node, to_node)
);
```

## Entity Types

### Service
- **ID Format**: `svc:service-name`
- **Properties**: name, platform, description
- **Example**: `svc:crm7` with properties `{ name: "crm7", platform: "Vercel" }`

### EnvVar  
- **ID Format**: `env:VARIABLE_KEY`
- **Properties**: key, description, required
- **Example**: `env:SUPABASE_URL` with properties `{ key: "SUPABASE_URL", required: true }`

### Incident
- **ID Format**: `incident:incident-id`  
- **Properties**: incidentId, cause, impact, severity
- **Example**: `incident:INC-101` with properties `{ cause: "missing SUPABASE_URL" }`

## Relationship Types

### SERVICE_REQUIRES_ENVVAR
- **Direction**: Service → EnvVar
- **Meaning**: A service depends on an environment variable
- **Example**: `svc:crm7` requires `env:SUPABASE_URL`

### INCIDENT_IMPACTS_SERVICE  
- **Direction**: Incident → Service
- **Meaning**: An incident affects a service
- **Example**: `incident:INC-101` impacts `svc:crm7`

## API Endpoints

### Agent A: Ingestor Endpoints

#### POST /api/memory-graph/ingest
Extract entities and relationships from text.

```json
{
  "text": "crm7 on Vercel requires SUPABASE_URL, SUPABASE_ANON_KEY",
  "options": {
    "runId": "deploy-001",
    "sourceFile": "deployment.md"
  }
}
```

#### POST /api/memory-graph/ingest/deployment
Convenience endpoint for deployment information.

```json
{
  "text": "crm7 deployment config...",
  "serviceName": "crm7"
}
```

### Agent B: Planner Endpoints

#### POST /api/memory-graph/query
Answer questions using graph queries.

```json
{
  "question": "What's blocking crm7 rollout?",
  "context": {
    "serviceName": "crm7"
  }
}
```

#### POST /api/memory-graph/query/rollout-blockers
Analyze rollout blockers for a service.

```json
{
  "serviceName": "crm7"
}
```

#### POST /api/memory-graph/query/missing-env-vars
Find missing environment variables.

```json
{
  "serviceName": "crm7", 
  "presentEnvVars": ["SUPABASE_URL"]
}
```

## Usage Examples

### 1. Basic Ingestion and Query

```javascript
// Agent A: Ingest deployment info
const ingestResult = await fetch('/api/memory-graph/ingest', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "crm7 on Vercel requires SUPABASE_URL, SUPABASE_ANON_KEY"
  })
});

// Agent B: Query rollout blockers
const blockersResult = await fetch('/api/memory-graph/query/rollout-blockers', {
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serviceName: "crm7"
  })
});
```

### 2. Multi-hop Reasoning

```javascript
// Add incident information
await fetch('/api/memory-graph/ingest', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "INC-101: crm7 outage caused by missing SUPABASE_URL"
  })
});

// Query related incidents for rollout planning
const incidentsResult = await fetch('/api/memory-graph/query/related-incidents', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serviceName: "crm7"
  })
});
```

## Key Benefits

### Composability
- **Before**: Agent outputs text → next agent parses text → error prone
- **After**: Agent creates structured nodes/edges → next agent queries graph → reliable

### Context Compression  
- **Before**: Pass entire deployment logs and incident reports as context
- **After**: Query only relevant subgraph (service + dependencies + incidents)

### Traceability
- **Before**: "Model recommended Plan B" (black box)
- **After**: "Plan B chosen because Service X links to 3 outages last month" (explainable)

## Multi-hop Reasoning Example

Query: "Which incidents are related to current rollout risks?"

Reasoning chain:
1. Service `crm7` requires `SUPABASE_URL` (1 hop)
2. Missing `SUPABASE_URL` caused `INC-101` (2 hops)  
3. `INC-101` impacted `crm7` deployment (3 hops)
4. **Conclusion**: Fix env var before rollout to avoid repeat incident

## Testing

### Validate Database Schema
```bash
npm run validate:memory-graph
```

### Run Full Test Suite  
```bash
npm run test:memory-graph
```

### Run Interactive Example
```bash  
npm run example:memory-graph
```

## Development

### Adding New Entity Types
1. Add to `ENTITY_TYPES` in `models/entities.js`
2. Create entity-specific functions (create, get)
3. Update ingestor agent extraction logic
4. Add planner agent query methods

### Adding New Relationship Types
1. Add to `RELATIONSHIP_TYPES` in `models/entities.js`  
2. Create relationship function (link*)
3. Update extraction patterns in ingestor
4. Add query logic in planner

### Performance Considerations
- Use indexes on frequently queried columns (type, properties)
- Cache subgraphs for repeated queries
- Limit traversal depth to prevent expensive queries
- Consider graph database (Neo4j) for complex queries at scale