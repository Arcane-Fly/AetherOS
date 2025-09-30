#!/usr/bin/env node

/**
 * Validation Script for Memory Graph Database Schema
 * Tests database connectivity and schema creation
 */

const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://aetheros:aetheros123@localhost:5432/aetheros',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function validateMemoryGraph() {
  console.log('🔍 Validating Memory Graph Database Schema');
  console.log('==========================================\n');

  try {
    // Test 1: Database Connection
    console.log('📡 Test 1: Database Connection');
    console.log('-----------------------------');
    
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    client.release();

    // Test 2: Check if tables exist
    console.log('\n📋 Test 2: Table Existence');
    console.log('-------------------------');
    
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('memory_nodes', 'memory_edges')
      ORDER BY table_name;
    `);
    
    const existingTables = tablesResult.rows.map(row => row.table_name);
    console.log('📊 Found tables:', existingTables.join(', '));
    
    if (existingTables.includes('memory_nodes')) {
      console.log('✅ memory_nodes table exists');
    } else {
      console.log('❌ memory_nodes table missing');
    }
    
    if (existingTables.includes('memory_edges')) {
      console.log('✅ memory_edges table exists');
    } else {
      console.log('❌ memory_edges table missing');
    }

    // Test 3: Test basic node operations
    console.log('\n🔧 Test 3: Basic Node Operations');
    console.log('-------------------------------');
    
    // Insert a test service node
    const testServiceId = 'svc:test-service';
    const serviceResult = await pool.query(`
      INSERT INTO memory_nodes (id, type, properties, source_info, updated_at) 
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (id) 
      DO UPDATE SET 
        type = EXCLUDED.type,
        properties = EXCLUDED.properties,
        source_info = EXCLUDED.source_info,
        updated_at = NOW()
      RETURNING *;
    `, [
      testServiceId, 
      'Service', 
      JSON.stringify({ name: 'test-service' }),
      JSON.stringify({ test: true })
    ]);
    
    console.log('✅ Test service node created/updated:', serviceResult.rows[0].id);

    // Insert a test env var node
    const testEnvVarId = 'env:TEST_VAR';
    const envVarResult = await pool.query(`
      INSERT INTO memory_nodes (id, type, properties, source_info, updated_at) 
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (id) 
      DO UPDATE SET 
        type = EXCLUDED.type,
        properties = EXCLUDED.properties,
        source_info = EXCLUDED.source_info,
        updated_at = NOW()
      RETURNING *;
    `, [
      testEnvVarId, 
      'EnvVar', 
      JSON.stringify({ key: 'TEST_VAR' }),
      JSON.stringify({ test: true })
    ]);
    
    console.log('✅ Test env var node created/updated:', envVarResult.rows[0].id);

    // Test 4: Test edge operations
    console.log('\n🔗 Test 4: Edge Operations');
    console.log('------------------------');
    
    const edgeResult = await pool.query(`
      INSERT INTO memory_edges (type, from_node, to_node, properties, source_info, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (type, from_node, to_node)
      DO UPDATE SET
        properties = EXCLUDED.properties,
        source_info = EXCLUDED.source_info,
        updated_at = NOW()
      RETURNING *;
    `, [
      'SERVICE_REQUIRES_ENVVAR',
      testServiceId,
      testEnvVarId,
      JSON.stringify({}),
      JSON.stringify({ test: true })
    ]);
    
    console.log('✅ Test edge created/updated:', edgeResult.rows[0].type);

    // Test 5: Test graph traversal
    console.log('\n🗺️  Test 5: Graph Traversal');
    console.log('---------------------------');
    
    const traversalResult = await pool.query(`
      WITH RECURSIVE neighbors(node_id, edge_type, level) AS (
        SELECT $1::varchar, ''::varchar, 0
        UNION
        SELECT 
          CASE 
            WHEN e.from_node = n.node_id THEN e.to_node
            ELSE e.from_node
          END,
          e.type,
          n.level + 1
        FROM neighbors n
        JOIN memory_edges e ON (e.from_node = n.node_id OR e.to_node = n.node_id)
        WHERE n.level < $2
      )
      SELECT DISTINCT mn.*, n.level, n.edge_type
      FROM neighbors n
      JOIN memory_nodes mn ON mn.id = n.node_id
      WHERE n.level > 0
      ORDER BY n.level, mn.id;
    `, [testServiceId, 2]);
    
    console.log(`✅ Graph traversal found ${traversalResult.rows.length} neighbors`);
    traversalResult.rows.forEach(neighbor => {
      console.log(`   - ${neighbor.id} (${neighbor.type}) at level ${neighbor.level}`);
    });

    // Test 6: Clean up test data
    console.log('\n🧹 Test 6: Cleanup');
    console.log('----------------');
    
    await pool.query('DELETE FROM memory_edges WHERE from_node = $1 OR to_node = $1', [testServiceId]);
    await pool.query('DELETE FROM memory_edges WHERE from_node = $1 OR to_node = $1', [testEnvVarId]);
    await pool.query('DELETE FROM memory_nodes WHERE id IN ($1, $2)', [testServiceId, testEnvVarId]);
    
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 Memory Graph Validation Completed Successfully!');
    console.log('\n📊 Summary:');
    console.log('- ✅ Database connection established');
    console.log('- ✅ Memory graph tables exist and accessible');
    console.log('- ✅ Node operations working (create, read, update)');
    console.log('- ✅ Edge operations working (create, read, update)');
    console.log('- ✅ Graph traversal queries functional');
    console.log('- ✅ Data cleanup successful');

  } catch (error) {
    console.error('❌ Validation Failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Database connection refused. Make sure PostgreSQL is running and accessible.');
      console.log('   Check your DATABASE_URL environment variable.');
    } else if (error.code === '42P01') {
      console.log('\n💡 Table does not exist. Run database migrations first:');
      console.log('   npm run migrate');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the validation
validateMemoryGraph();