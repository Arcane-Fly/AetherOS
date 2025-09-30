# Memory Graph Implementation - Quick Start

This document shows how to use the newly implemented Memory Graph system for multi-agent reasoning in AetherOS.

## 🎯 What Was Built

A complete **memory graph system** that implements the 20-minute mini-experiment from your problem statement:

- **Agent A (Ingestor)**: Extracts entities/relationships from text
- **Agent B (Planner)**: Answers questions using graph-only queries  
- **Memory Graph Database**: Stores structured nodes and edges
- **Multi-hop Reasoning**: Connects services → env vars → incidents

## 🚀 Quick Demo (No Database Required)

```bash
npm run demo:memory-graph
```

This shows the complete workflow:
1. **Input**: `"crm7 on Vercel requires SUPABASE_URL, SUPABASE_ANON_KEY"`
2. **Agent A**: Extracts Service + EnvVar entities + relationships
3. **Agent B**: Queries "What's blocking rollout?" using graph only
4. **Multi-hop**: Adds incident data and reasons across connections

## 📊 Example Usage

### Agent A: Ingest Text
```bash
curl -X POST http://localhost:3002/api/memory-graph/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "text": "crm7 on Vercel requires SUPABASE_URL, SUPABASE_ANON_KEY"
  }'
```

**Response**: Creates Service(crm7) + EnvVar(SUPABASE_URL) + EnvVar(SUPABASE_ANON_KEY) + relationships

### Agent B: Query Rollout Blockers  
```bash
curl -X POST http://localhost:3002/api/memory-graph/query/rollout-blockers \
  -H "Content-Type: application/json" \
  -d '{"serviceName": "crm7"}'
```

**Response**: Lists required env vars, related incidents, recommendations

### Multi-hop Reasoning Example
```bash
# 1. Add incident data
curl -X POST http://localhost:3002/api/memory-graph/ingest \
  -d '{"text": "INC-101: crm7 outage caused by missing SUPABASE_URL"}'

# 2. Query related incidents  
curl -X POST http://localhost:3002/api/memory-graph/query/related-incidents \
  -d '{"serviceName": "crm7"}'
```

**Result**: Agent B reasons across 2 hops to find incident patterns affecting rollout

## 🏗️ Architecture Overview

### Database Schema
```sql
-- Entities (Service, EnvVar, Incident)
memory_nodes (id, type, properties, source_info, timestamps)

-- Relationships (SERVICE_REQUIRES_ENVVAR, INCIDENT_IMPACTS_SERVICE)  
memory_edges (type, from_node, to_node, properties, source_info, timestamps)
```

### API Endpoints
- `POST /api/memory-graph/ingest` - Agent A: Extract from text
- `POST /api/memory-graph/query` - Agent B: Graph queries
- `POST /api/memory-graph/query/rollout-blockers` - Specific analysis
- `GET /api/memory-graph/health` - Service status

### Files Added/Modified
```
backend/services/auth-service/src/models/
├── memory-graph.js          # Core graph operations
├── entities.js              # Entity schema & queries
└── database.js              # Updated with graph tables

backend/services/generation-service/src/
├── agents/
│   ├── ingestor-agent.js    # Agent A: Text → Graph
│   └── planner-agent.js     # Agent B: Graph → Answers
├── models/
│   └── memory-graph-client.js # Graph access for generation service
├── routes/
│   └── memory-graph.js      # REST API endpoints
└── server.js                # Updated with memory-graph routes

scripts/
├── validate-memory-graph.js # Database schema validation
├── test-memory-graph.js     # Full API testing  
├── demo-memory-graph-structure.js # Quick demo (no DB)
└── memory-graph-example.js  # Database example

docs/
└── memory-graph.md          # Full documentation
```

## 🧪 Testing & Validation

### 1. Structure Demo (No Database)
```bash
npm run demo:memory-graph
```
✅ Shows entity extraction, graph queries, multi-hop reasoning

### 2. Database Schema (Requires PostgreSQL)
```bash  
npm run validate:memory-graph
```
✅ Tests database connectivity, table creation, graph operations

### 3. Full API Testing (Requires Running Services)
```bash
# Start generation service
cd backend/services/generation-service
npm start

# Run tests
npm run test:memory-graph
```
✅ Tests complete ingest → query → reason workflow

## 🎯 Key Benefits Achieved

### 1. **Composability** 
- **Before**: Agent outputs text → next agent parses → error prone
- **After**: Agent creates nodes/edges → next agent queries graph → reliable

### 2. **Context Compression**
- **Before**: Pass full deployment logs + incident reports as context  
- **After**: Query only relevant subgraph (service + dependencies)

### 3. **Traceability**  
- **Before**: "Model recommended Plan B" (black box)
- **After**: "Plan B because Service X → 3 outages last month" (explainable)

## 🧠 Multi-hop Reasoning Example

**Query**: "Which incidents are related to current rollout risks?"

**Agent B Reasoning Chain**:
1. Service `crm7` requires `SUPABASE_URL` (1 hop)
2. Missing `SUPABASE_URL` caused `INC-101` (2 hops)
3. `INC-101` impacted `crm7` deployment (3 hops)  
4. **Conclusion**: Fix env var before rollout to avoid repeat incident

**Graph Traversal**:
```
svc:crm7 --[SERVICE_REQUIRES_ENVVAR]--> env:SUPABASE_URL
incident:INC-101 --[INCIDENT_IMPACTS_SERVICE]--> svc:crm7
```

## 📈 Next Steps

### Immediate Use Cases
1. **CRM7 Parity Roadmap**: Model Feature→Route→Permission→Integration relationships
2. **Deploy Hygiene**: Service→EnvVar→Secret→Incident tracking  
3. **Support Flows**: Ticket→Customer→Plan→Module connections

### Extensions
1. **New Entity Types**: Add User, Team, Repository entities
2. **New Relationships**: TEAM_OWNS_SERVICE, REPO_DEPLOYS_TO_SERVICE
3. **Advanced Queries**: Path analysis, dependency cycles, impact assessment

## 🚦 Getting Started

1. **Quick Demo**: `npm run demo:memory-graph` (works immediately)
2. **Database Setup**: Install PostgreSQL, run `npm run validate:memory-graph`  
3. **API Testing**: Start services, run `npm run test:memory-graph`
4. **Integration**: Use API endpoints in your existing workflows

The implementation is **complete and ready to use** - it delivers exactly what was specified in the 20-minute mini-experiment!