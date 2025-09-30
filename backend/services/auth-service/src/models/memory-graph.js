const { pool } = require('./database');

/**
 * Memory Graph Database Schema and Utilities
 * Implements a property graph model for multi-agent reasoning
 */

// Create memory graph tables
const createMemoryGraphTables = async () => {
  const createNodesTable = `
    CREATE TABLE IF NOT EXISTS memory_nodes (
      id VARCHAR(255) PRIMARY KEY,
      type VARCHAR(50) NOT NULL,
      properties JSONB DEFAULT '{}',
      source_info JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  const createEdgesTable = `
    CREATE TABLE IF NOT EXISTS memory_edges (
      id SERIAL PRIMARY KEY,
      type VARCHAR(100) NOT NULL,
      from_node VARCHAR(255) NOT NULL REFERENCES memory_nodes(id) ON DELETE CASCADE,
      to_node VARCHAR(255) NOT NULL REFERENCES memory_nodes(id) ON DELETE CASCADE,
      properties JSONB DEFAULT '{}',
      source_info JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(type, from_node, to_node)
    );
  `;

  const createIndexes = `
    CREATE INDEX IF NOT EXISTS idx_memory_nodes_type ON memory_nodes(type);
    CREATE INDEX IF NOT EXISTS idx_memory_nodes_props ON memory_nodes USING GIN(properties);
    CREATE INDEX IF NOT EXISTS idx_memory_edges_type ON memory_edges(type);
    CREATE INDEX IF NOT EXISTS idx_memory_edges_from ON memory_edges(from_node);
    CREATE INDEX IF NOT EXISTS idx_memory_edges_to ON memory_edges(to_node);
    CREATE INDEX IF NOT EXISTS idx_memory_edges_props ON memory_edges USING GIN(properties);
  `;

  try {
    await pool.query(createNodesTable);
    await pool.query(createEdgesTable);
    await pool.query(createIndexes);
    console.log('Memory graph tables created successfully');
  } catch (error) {
    console.error('Error creating memory graph tables:', error);
    throw error;
  }
};

// Node operations
const upsertNode = async (id, type, properties = {}, sourceInfo = {}) => {
  const query = `
    INSERT INTO memory_nodes (id, type, properties, source_info, updated_at) 
    VALUES ($1, $2, $3, $4, NOW())
    ON CONFLICT (id) 
    DO UPDATE SET 
      type = EXCLUDED.type,
      properties = EXCLUDED.properties,
      source_info = EXCLUDED.source_info,
      updated_at = NOW()
    RETURNING *;
  `;
  
  const result = await pool.query(query, [id, type, JSON.stringify(properties), JSON.stringify(sourceInfo)]);
  return result.rows[0];
};

const getNode = async (id) => {
  const query = 'SELECT * FROM memory_nodes WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const getNodesByType = async (type, limit = 100) => {
  const query = 'SELECT * FROM memory_nodes WHERE type = $1 LIMIT $2';
  const result = await pool.query(query, [type, limit]);
  return result.rows;
};

// Edge operations  
const upsertEdge = async (type, fromNode, toNode, properties = {}, sourceInfo = {}) => {
  const query = `
    INSERT INTO memory_edges (type, from_node, to_node, properties, source_info, updated_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    ON CONFLICT (type, from_node, to_node)
    DO UPDATE SET
      properties = EXCLUDED.properties,
      source_info = EXCLUDED.source_info,
      updated_at = NOW()
    RETURNING *;
  `;
  
  const result = await pool.query(query, [type, fromNode, toNode, JSON.stringify(properties), JSON.stringify(sourceInfo)]);
  return result.rows[0];
};

const getEdgesByNode = async (nodeId, direction = 'both') => {
  let query;
  if (direction === 'outgoing') {
    query = 'SELECT * FROM memory_edges WHERE from_node = $1';
  } else if (direction === 'incoming') {
    query = 'SELECT * FROM memory_edges WHERE to_node = $1';
  } else {
    query = 'SELECT * FROM memory_edges WHERE from_node = $1 OR to_node = $1';
  }
  
  const result = await pool.query(query, [nodeId]);
  return result.rows;
};

const getEdgesByType = async (type, limit = 100) => {
  const query = 'SELECT * FROM memory_edges WHERE type = $1 LIMIT $2';
  const result = await pool.query(query, [type, limit]);
  return result.rows;
};

// Graph traversal operations
const getNeighbors = async (nodeId, edgeType = null, hops = 1) => {
  let query = `
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
  `;
  
  const params = [nodeId, hops];
  
  if (edgeType) {
    query += ' AND e.type = $3';
    params.push(edgeType);
  }
  
  query += `
    )
    SELECT DISTINCT mn.*, n.level, n.edge_type
    FROM neighbors n
    JOIN memory_nodes mn ON mn.id = n.node_id
    WHERE n.level > 0
    ORDER BY n.level, mn.id;
  `;
  
  const result = await pool.query(query, params);
  return result.rows;
};

const getSubgraph = async (nodeIds, maxHops = 2) => {
  if (!Array.isArray(nodeIds) || nodeIds.length === 0) {
    return { nodes: [], edges: [] };
  }

  // Get nodes and their neighbors up to maxHops
  const nodeQuery = `
    WITH RECURSIVE subgraph_nodes(node_id, level) AS (
      SELECT unnest($1::varchar[]), 0
      UNION
      SELECT 
        CASE 
          WHEN e.from_node = sn.node_id THEN e.to_node
          ELSE e.from_node
        END,
        sn.level + 1
      FROM subgraph_nodes sn
      JOIN memory_edges e ON (e.from_node = sn.node_id OR e.to_node = sn.node_id)
      WHERE sn.level < $2
    )
    SELECT DISTINCT mn.*
    FROM subgraph_nodes sn
    JOIN memory_nodes mn ON mn.id = sn.node_id;
  `;
  
  const edgeQuery = `
    WITH subgraph_node_ids AS (
      WITH RECURSIVE subgraph_nodes(node_id, level) AS (
        SELECT unnest($1::varchar[]), 0
        UNION
        SELECT 
          CASE 
            WHEN e.from_node = sn.node_id THEN e.to_node
            ELSE e.from_node
          END,
          sn.level + 1
        FROM subgraph_nodes sn
        JOIN memory_edges e ON (e.from_node = sn.node_id OR e.to_node = sn.node_id)
        WHERE sn.level < $2
      )
      SELECT DISTINCT node_id FROM subgraph_nodes
    )
    SELECT me.*
    FROM memory_edges me
    WHERE me.from_node IN (SELECT node_id FROM subgraph_node_ids)
      AND me.to_node IN (SELECT node_id FROM subgraph_node_ids);
  `;
  
  const [nodesResult, edgesResult] = await Promise.all([
    pool.query(nodeQuery, [nodeIds, maxHops]),
    pool.query(edgeQuery, [nodeIds, maxHops])
  ]);
  
  return {
    nodes: nodesResult.rows,
    edges: edgesResult.rows
  };
};

module.exports = {
  createMemoryGraphTables,
  upsertNode,
  getNode,
  getNodesByType,
  upsertEdge,
  getEdgesByNode,
  getEdgesByType,
  getNeighbors,
  getSubgraph
};