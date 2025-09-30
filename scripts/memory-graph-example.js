#!/usr/bin/env node

/**
 * Memory Graph Example - 20-minute Mini-experiment
 * Demonstrates the exact scenario from the problem statement
 */

const { 
  createService, 
  createEnvVar, 
  createIncident,
  linkServiceRequiresEnvVar,
  linkIncidentImpactsService,
  getRequiredEnvVarsForService,
  getIncidentsRelatedToRolloutRisks,
  findMissingEnvVarsForRollout
} = require('../backend/services/auth-service/src/models/entities');

const { createTables } = require('../backend/services/auth-service/src/models/database');

async function runMemoryGraphExample() {
  console.log('🎯 Memory Graph Mini-Experiment');
  console.log('===============================\n');

  try {
    // Ensure tables exist (this would normally be done in migration)
    // await createTables();

    console.log('📝 Step 1: Create Entities and Relationships');
    console.log('-------------------------------------------');
    
    // Example from problem statement: "crm7 on Vercel requires SUPABASE_URL, SUPABASE_ANON_KEY"
    
    // Create Service
    const service = await createService('crm7', { 
      platform: 'Vercel',
      description: 'CRM application version 7'
    }, {
      runId: 'example-001',
      sourceFile: 'deployment-config.md'
    });
    console.log('✅ Created Service:', service.properties.name);
    
    // Create Environment Variables
    const supabaseUrl = await createEnvVar('SUPABASE_URL', {
      description: 'Supabase project URL',
      required: true
    });
    console.log('✅ Created EnvVar:', supabaseUrl.properties.key);
    
    const supabaseKey = await createEnvVar('SUPABASE_ANON_KEY', {
      description: 'Supabase anonymous key', 
      required: true
    });
    console.log('✅ Created EnvVar:', supabaseKey.properties.key);
    
    // Create Relationships
    await linkServiceRequiresEnvVar('crm7', 'SUPABASE_URL');
    await linkServiceRequiresEnvVar('crm7', 'SUPABASE_ANON_KEY');
    console.log('✅ Linked service requirements\n');

    console.log('🔍 Step 2: Query Missing Environment Variables');
    console.log('--------------------------------------------');
    
    // Agent B query: What's missing for crm7?
    const missingEnvs = await findMissingEnvVarsForRollout('crm7', ['SUPABASE_URL']); // Only one present
    
    console.log('📊 Environment Variable Analysis:');
    console.log(`   Required: ${missingEnvs.required.map(env => env.properties.key).join(', ')}`);
    console.log(`   Present: ${missingEnvs.present.join(', ')}`);
    console.log(`   Missing: ${missingEnvs.missing.join(', ')}`);
    console.log('');
    
    console.log('📝 Step 3: Add Incident (Second Hop)');
    console.log('-----------------------------------');
    
    // Create incident from problem statement
    const incident = await createIncident('INC-101', {
      cause: 'missing SUPABASE_URL',
      impact: 'service outage',
      severity: 'high',
      dateOccurred: new Date().toISOString()
    });
    console.log('✅ Created Incident:', incident.properties.incidentId);
    
    // Link incident to service
    await linkIncidentImpactsService('INC-101', 'crm7');
    console.log('✅ Linked incident to service\n');

    console.log('🔍 Step 4: Multi-hop Reasoning Query');
    console.log('----------------------------------');
    
    // Agent B query: "Which incidents are related to current rollout risks?"
    const rolloutRisks = await getIncidentsRelatedToRolloutRisks('crm7');
    
    console.log('🚨 Rollout Risk Analysis:');
    console.log(`   Related Incidents: ${rolloutRisks.incidents.length}`);
    rolloutRisks.incidents.forEach(incident => {
      console.log(`     - ${incident.properties.incidentId}: ${incident.properties.cause}`);
    });
    
    console.log(`   Required Env Variables: ${rolloutRisks.requiredEnvVars.length}`);
    rolloutRisks.requiredEnvVars.forEach(env => {
      console.log(`     - ${env.properties.key}`);
    });
    
    console.log(`   Risk Connections: ${rolloutRisks.risks.length}`);
    console.log('');

    console.log('🧠 Step 5: Reasoning Chain Demonstration');
    console.log('---------------------------------------');
    
    console.log('💭 Multi-hop reasoning chain:');
    console.log('   1. Issue #412 → Service crm7');
    console.log('   2. Service crm7 → requires SUPABASE_URL');  
    console.log('   3. Missing SUPABASE_URL → caused INC-101');
    console.log('   4. INC-101 → impacts crm7 deployment');
    console.log('   5. Therefore: Fix env var before rollout');
    console.log('');

    console.log('🎉 Memory Graph Demo Completed Successfully!');
    console.log('\n📋 Key Capabilities Demonstrated:');
    console.log('- 🏗️  Entity creation (Service, EnvVar, Incident)');
    console.log('- 🔗 Relationship modeling (requires, impacts)'); 
    console.log('- 🔍 Graph-only queries (no raw text needed)');
    console.log('- 🧠 Multi-hop reasoning across connections');
    console.log('- 📊 Risk assessment and gap analysis');
    console.log('- 🎯 Context compression vs long prompts');

  } catch (error) {
    console.error('❌ Example Failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Check if this is being run directly
if (require.main === module) {
  runMemoryGraphExample();
}

module.exports = { runMemoryGraphExample };