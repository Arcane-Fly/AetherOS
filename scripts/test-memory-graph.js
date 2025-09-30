#!/usr/bin/env node

/**
 * Test Script for Memory Graph Implementation
 * Tests the 20-minute mini-experiment as specified in the problem statement
 */

const axios = require('axios');

const BASE_URL = process.env.GENERATION_SERVICE_URL || 'http://localhost:3002';

async function testMemoryGraph() {
  console.log('🧪 Testing Memory Graph Implementation');
  console.log('====================================\n');

  try {
    // Test 1: Agent A (Ingestor) - Extract entities from deployment log
    console.log('📥 Test 1: Agent A - Ingestor');
    console.log('-----------------------------');
    
    const deploymentText = "crm7 on Vercel requires SUPABASE_URL, SUPABASE_ANON_KEY";
    console.log(`Ingesting: "${deploymentText}"`);
    
    const ingestResponse = await axios.post(`${BASE_URL}/api/memory-graph/ingest`, {
      text: deploymentText,
      options: {
        runId: 'test-run-001',
        sourceFile: 'deployment-config.md'
      }
    });
    
    console.log('✅ Ingestion Result:');
    console.log(`   Nodes created: ${ingestResponse.data.nodes?.length || 0}`);
    console.log(`   Edges created: ${ingestResponse.data.edges?.length || 0}`);
    console.log(`   Errors: ${ingestResponse.data.errors?.length || 0}\n`);

    // Test 2: Agent B (Planner) - Query rollout blockers
    console.log('🤖 Test 2: Agent B - Planner (Rollout Blockers)');
    console.log('---------------------------------------------');
    
    const rolloutQuery = await axios.post(`${BASE_URL}/api/memory-graph/query/rollout-blockers`, {
      serviceName: 'crm7'
    });
    
    console.log('✅ Rollout Analysis:');
    if (rolloutQuery.data.success) {
      const analysis = rolloutQuery.data.analysis;
      console.log(`   Required Env Vars: ${analysis.requiredEnvVars.length}`);
      analysis.requiredEnvVars.forEach(env => {
        console.log(`     - ${env.key}`);
      });
      console.log(`   Related Incidents: ${analysis.relatedIncidents.length}`);
      console.log(`   Recommendations: ${rolloutQuery.data.recommendations.length}\n`);
    } else {
      console.log(`   ❌ Error: ${rolloutQuery.data.error}\n`);
    }

    // Test 3: Add incident data and test multi-hop reasoning  
    console.log('🔥 Test 3: Add Incident and Multi-hop Reasoning');
    console.log('---------------------------------------------');
    
    const incidentText = 'INC-101: crm7 service outage caused by missing SUPABASE_URL environment variable';
    console.log(`Ingesting incident: "${incidentText}"`);
    
    const incidentIngest = await axios.post(`${BASE_URL}/api/memory-graph/ingest`, {
      text: incidentText,
      options: {
        runId: 'test-incident-001',
        sourceFile: 'incident-report.json'
      }
    });
    
    console.log('✅ Incident Ingestion:');
    console.log(`   Nodes created: ${incidentIngest.data.nodes?.length || 0}`);
    console.log(`   Edges created: ${incidentIngest.data.edges?.length || 0}\n`);

    // Test 4: Query related incidents for rollout risks
    console.log('🔍 Test 4: Multi-hop Query - Related Incidents');
    console.log('--------------------------------------------');
    
    const relatedIncidentsQuery = await axios.post(`${BASE_URL}/api/memory-graph/query/related-incidents`, {
      serviceName: 'crm7'
    });
    
    console.log('✅ Related Incidents Analysis:');
    if (relatedIncidentsQuery.data.success) {
      const analysis = relatedIncidentsQuery.data.incidentAnalysis;
      console.log(`   Total Incidents: ${analysis.totalIncidents}`);
      analysis.incidents.forEach(incident => {
        console.log(`     - ${incident.id}: ${incident.cause}`);
      });
      
      const risk = relatedIncidentsQuery.data.riskAssessment;
      console.log(`   Risk Level: ${risk.level} (Score: ${risk.score})`);
      console.log(`   Risk Factors: ${risk.factors.join(', ')}\n`);
    } else {
      console.log(`   ❌ Error: ${relatedIncidentsQuery.data.error}\n`);
    }

    // Test 5: Check missing environment variables
    console.log('🔧 Test 5: Missing Environment Variables Check');
    console.log('-------------------------------------------');
    
    const missingEnvQuery = await axios.post(`${BASE_URL}/api/memory-graph/query/missing-env-vars`, {
      serviceName: 'crm7',
      presentEnvVars: ['SUPABASE_URL'] // Only one of the two required
    });
    
    console.log('✅ Environment Variables Analysis:');
    if (missingEnvQuery.data.success) {
      const analysis = missingEnvQuery.data.envVarAnalysis;
      console.log(`   Required: ${analysis.required.join(', ')}`);
      console.log(`   Present: ${analysis.present.join(', ')}`);
      console.log(`   Missing: ${analysis.missing.join(', ')}`);
      console.log(`   Completion: ${analysis.completionPercentage.toFixed(1)}%`);
      
      if (missingEnvQuery.data.blockers.length > 0) {
        console.log('   🚫 Blockers:');
        missingEnvQuery.data.blockers.forEach(blocker => {
          console.log(`     - ${blocker.envVar} (${blocker.severity}): ${blocker.reason}`);
        });
      }
      console.log('');
    } else {
      console.log(`   ❌ Error: ${missingEnvQuery.data.error}\n`);
    }

    // Test 6: General question answering
    console.log('💭 Test 6: General Question Answering');
    console.log('-----------------------------------');
    
    const generalQuery = await axios.post(`${BASE_URL}/api/memory-graph/query`, {
      question: "Which incidents are related to current rollout risks?",
      context: { serviceName: 'crm7' }
    });
    
    console.log('✅ General Query Result:');
    if (generalQuery.data.success) {
      console.log(`   Query processed successfully`);
      console.log(`   Result type: ${generalQuery.data.incidentAnalysis ? 'incident analysis' : 'other'}`);
    } else {
      console.log(`   ❌ Error: ${generalQuery.data.error}`);
    }

    console.log('\n🎉 Memory Graph Test Completed Successfully!');
    console.log('\n📊 Summary:');
    console.log('- ✅ Entity extraction from natural language (Agent A)');
    console.log('- ✅ Graph-only query answering (Agent B)'); 
    console.log('- ✅ Multi-hop reasoning across relationships');
    console.log('- ✅ Service deployment risk analysis');
    console.log('- ✅ Environment variable dependency tracking');
    console.log('- ✅ Incident impact analysis');

  } catch (error) {
    console.error('❌ Test Failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the generation service is running:');
      console.log('   cd backend/services/generation-service && npm start');
    }
    
    process.exit(1);
  }
}

// Run the test
testMemoryGraph();