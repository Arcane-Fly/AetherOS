#!/usr/bin/env node

/**
 * Memory Graph Structure Demo
 * Demonstrates the data structures and concepts without requiring database
 */

console.log('🎯 Memory Graph Structure Demo');
console.log('=============================\n');

// Mock the key data structures that would be in the database
const mockMemoryGraph = {
  nodes: [],
  edges: []
};

// Mock entity creation functions
function mockCreateService(name, properties = {}, sourceInfo = {}) {
  const id = `svc:${name}`;
  const node = {
    id,
    type: 'Service',
    properties: { name, ...properties },
    source_info: sourceInfo,
    created_at: new Date().toISOString()
  };
  mockMemoryGraph.nodes.push(node);
  return node;
}

function mockCreateEnvVar(key, properties = {}, sourceInfo = {}) {
  const id = `env:${key}`;
  const node = {
    id,
    type: 'EnvVar', 
    properties: { key, ...properties },
    source_info: sourceInfo,
    created_at: new Date().toISOString()
  };
  mockMemoryGraph.nodes.push(node);
  return node;
}

function mockCreateIncident(incidentId, properties = {}, sourceInfo = {}) {
  const id = `incident:${incidentId}`;
  const node = {
    id,
    type: 'Incident',
    properties: { incidentId, ...properties },
    source_info: sourceInfo,
    created_at: new Date().toISOString()
  };
  mockMemoryGraph.nodes.push(node);
  return node;
}

function mockLinkServiceRequiresEnvVar(serviceName, envVarKey, properties = {}, sourceInfo = {}) {
  const edge = {
    id: mockMemoryGraph.edges.length + 1,
    type: 'SERVICE_REQUIRES_ENVVAR',
    from_node: `svc:${serviceName}`,
    to_node: `env:${envVarKey}`,
    properties,
    source_info: sourceInfo,
    created_at: new Date().toISOString()
  };
  mockMemoryGraph.edges.push(edge);
  return edge;
}

function mockLinkIncidentImpactsService(incidentId, serviceName, properties = {}, sourceInfo = {}) {
  const edge = {
    id: mockMemoryGraph.edges.length + 1,
    type: 'INCIDENT_IMPACTS_SERVICE',
    from_node: `incident:${incidentId}`,
    to_node: `svc:${serviceName}`,
    properties,
    source_info: sourceInfo,
    created_at: new Date().toISOString()
  };
  mockMemoryGraph.edges.push(edge);
  return edge;
}

// Mock query functions
function mockGetRequiredEnvVarsForService(serviceName) {
  const serviceId = `svc:${serviceName}`;
  const requiresEdges = mockMemoryGraph.edges.filter(
    edge => edge.type === 'SERVICE_REQUIRES_ENVVAR' && edge.from_node === serviceId
  );
  
  return requiresEdges.map(edge => {
    return mockMemoryGraph.nodes.find(node => node.id === edge.to_node);
  }).filter(Boolean);
}

function mockGetIncidentsForService(serviceName) {
  const serviceId = `svc:${serviceName}`;
  const impactEdges = mockMemoryGraph.edges.filter(
    edge => edge.type === 'INCIDENT_IMPACTS_SERVICE' && edge.to_node === serviceId
  );
  
  return impactEdges.map(edge => {
    return mockMemoryGraph.nodes.find(node => node.id === edge.from_node);
  }).filter(Boolean);
}

function mockFindMissingEnvVars(serviceName, presentEnvVars = []) {
  const requiredEnvVars = mockGetRequiredEnvVarsForService(serviceName);
  const requiredKeys = requiredEnvVars.map(env => env.properties.key);
  const presentKeys = presentEnvVars;
  const missing = requiredKeys.filter(key => !presentKeys.includes(key));
  
  return {
    required: requiredKeys,
    present: presentKeys,
    missing: missing
  };
}

async function runDemo() {
  try {
    console.log('📝 Step 1: Agent A (Ingestor) - Extract from Text');
    console.log('------------------------------------------------');
    console.log('📥 Input text: "crm7 on Vercel requires SUPABASE_URL, SUPABASE_ANON_KEY"');
    console.log('🔄 Processing with LLM extraction...\n');
    
    // Simulate what Agent A would extract and create
    const service = mockCreateService('crm7', { 
      platform: 'Vercel',
      description: 'CRM application version 7'
    }, {
      runId: 'demo-001',
      sourceFile: 'deployment-config.md',
      originalText: 'crm7 on Vercel requires SUPABASE_URL, SUPABASE_ANON_KEY'
    });
    console.log('✅ Created Service node:', JSON.stringify(service, null, 2));
    
    const supabaseUrl = mockCreateEnvVar('SUPABASE_URL', {
      description: 'Supabase project URL',
      required: true
    });
    console.log('✅ Created EnvVar node:', JSON.stringify(supabaseUrl, null, 2));
    
    const supabaseKey = mockCreateEnvVar('SUPABASE_ANON_KEY', {
      description: 'Supabase anonymous key', 
      required: true
    });
    console.log('✅ Created EnvVar node:', JSON.stringify(supabaseKey, null, 2));
    
    // Create relationships
    const req1 = mockLinkServiceRequiresEnvVar('crm7', 'SUPABASE_URL');
    const req2 = mockLinkServiceRequiresEnvVar('crm7', 'SUPABASE_ANON_KEY');
    console.log('✅ Created SERVICE_REQUIRES_ENVVAR edges');
    console.log('   -', JSON.stringify(req1, null, 2));
    console.log('   -', JSON.stringify(req2, null, 2));
    console.log('');

    console.log('🤖 Step 2: Agent B (Planner) - Graph-Only Queries');
    console.log('------------------------------------------------');
    console.log('❓ Question: "What\'s blocking crm7 rollout?"');
    console.log('🔍 Querying graph (no LLM needed)...\n');
    
    // Agent B uses only graph queries
    const requiredEnvs = mockGetRequiredEnvVarsForService('crm7');
    console.log('📊 Required Environment Variables:');
    requiredEnvs.forEach(env => {
      console.log(`   - ${env.properties.key}: ${env.properties.description || 'No description'}`);
    });
    
    const missingAnalysis = mockFindMissingEnvVars('crm7', ['SUPABASE_URL']); // Only one present
    console.log('\n🔧 Missing Environment Variables Analysis:');
    console.log(`   Required: ${missingAnalysis.required.join(', ')}`);
    console.log(`   Present: ${missingAnalysis.present.join(', ')}`);
    console.log(`   Missing: ${missingAnalysis.missing.join(', ')}`);
    console.log('');
    
    console.log('📝 Step 3: Add Second Hop (Incident Data)');
    console.log('-----------------------------------------');
    console.log('📥 Input text: "INC-101: crm7 outage caused by missing SUPABASE_URL"');
    console.log('🔄 Processing with Agent A...\n');
    
    const incident = mockCreateIncident('INC-101', {
      cause: 'missing SUPABASE_URL',
      impact: 'service outage',
      severity: 'high'
    }, {
      runId: 'demo-002',
      sourceFile: 'incident-report.json'
    });
    console.log('✅ Created Incident node:', JSON.stringify(incident, null, 2));
    
    const impactEdge = mockLinkIncidentImpactsService('INC-101', 'crm7');
    console.log('✅ Created INCIDENT_IMPACTS_SERVICE edge:', JSON.stringify(impactEdge, null, 2));
    console.log('');
    
    console.log('🧠 Step 4: Multi-Hop Reasoning');
    console.log('------------------------------');
    console.log('❓ Question: "Which incidents are related to current rollout risks?"');
    console.log('🔍 Agent B multi-hop traversal...\n');
    
    const relatedIncidents = mockGetIncidentsForService('crm7');
    console.log('🚨 Multi-hop Analysis Result:');
    console.log('   Reasoning Chain:');
    console.log('   1. Service "crm7" requires environment variables');
    console.log('   2. Missing "SUPABASE_ANON_KEY" is a rollout blocker'); 
    console.log('   3. Historical incident INC-101 was caused by missing "SUPABASE_URL"');
    console.log('   4. Risk: Similar incident could occur if env vars not properly configured');
    console.log('');
    console.log('   Related Incidents Found:');
    relatedIncidents.forEach(incident => {
      console.log(`   - ${incident.properties.incidentId}: ${incident.properties.cause}`);
    });
    console.log('');

    console.log('📊 Step 5: Current Graph State');
    console.log('-----------------------------');
    console.log(`Nodes: ${mockMemoryGraph.nodes.length}`);
    mockMemoryGraph.nodes.forEach(node => {
      console.log(`   ${node.id} (${node.type})`);
    });
    
    console.log(`Edges: ${mockMemoryGraph.edges.length}`);
    mockMemoryGraph.edges.forEach(edge => {
      console.log(`   ${edge.from_node} --[${edge.type}]--> ${edge.to_node}`);
    });
    console.log('');

    console.log('🎉 Memory Graph Demo Completed!');
    console.log('\n💡 Key Benefits Demonstrated:');
    console.log('- 🏗️  Structured entity extraction from natural language');
    console.log('- 🔗 Relationship modeling between services, env vars, and incidents');
    console.log('- 🔍 Graph-only queries (Agent B never sees raw text)');
    console.log('- 🧠 Multi-hop reasoning: Service → Dependencies → Historical Incidents');
    console.log('- 📊 Context compression: Query specific subgraph vs. full text');
    console.log('- 🎯 Explainable decisions: "Fix env var because of INC-101 pattern"');
    
    console.log('\n🚀 Ready for Production:');
    console.log('- Run with database: npm run validate:memory-graph (requires PostgreSQL)');
    console.log('- Test full API: npm run test:memory-graph (requires running services)');
    console.log('- Check integration: Start generation service on port 3002');

  } catch (error) {
    console.error('❌ Demo Failed:', error.message);
  }
}

runDemo();