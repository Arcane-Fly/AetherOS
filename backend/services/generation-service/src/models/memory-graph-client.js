const { Pool } = require('pg');

/**
 * Memory Graph Client for Generation Service
 * Provides access to memory graph functionality from generation service
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://aetheros:aetheros123@localhost:5432/aetheros',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Entity Types
const ENTITY_TYPES = {
  SERVICE: 'Service',
  ENVVAR: 'EnvVar', 
  INCIDENT: 'Incident'
};

// Relationship Types
const RELATIONSHIP_TYPES = {
  SERVICE_REQUIRES_ENVVAR: 'SERVICE_REQUIRES_ENVVAR',
  INCIDENT_IMPACTS_SERVICE: 'INCIDENT_IMPACTS_SERVICE'
};

// Generate unique node IDs
const generateNodeId = (type, identifier) => {
  const prefix = type.toLowerCase();
  return `${prefix}:${identifier}`;
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

// Service entity operations
const createService = async (name, properties = {}, sourceInfo = {}) => {
  const id = generateNodeId(ENTITY_TYPES.SERVICE, name);
  const serviceProps = {
    name,
    ...properties
  };
  
  return await upsertNode(id, ENTITY_TYPES.SERVICE, serviceProps, sourceInfo);
};

const getService = async (name) => {
  const id = generateNodeId(ENTITY_TYPES.SERVICE, name);
  return await getNode(id);
};

// EnvVar entity operations  
const createEnvVar = async (key, properties = {}, sourceInfo = {}) => {
  const id = generateNodeId(ENTITY_TYPES.ENVVAR, key);
  const envVarProps = {
    key,
    ...properties
  };
  
  return await upsertNode(id, ENTITY_TYPES.ENVVAR, envVarProps, sourceInfo);
};

const getEnvVar = async (key) => {
  const id = generateNodeId(ENTITY_TYPES.ENVVAR, key);
  return await getNode(id);
};

// Incident entity operations
const createIncident = async (incidentId, properties = {}, sourceInfo = {}) => {
  const id = generateNodeId(ENTITY_TYPES.INCIDENT, incidentId);
  const incidentProps = {
    incidentId,
    ...properties
  };
  
  return await upsertNode(id, ENTITY_TYPES.INCIDENT, incidentProps, sourceInfo);
};

const getIncident = async (incidentId) => {
  const id = generateNodeId(ENTITY_TYPES.INCIDENT, incidentId);
  return await getNode(id);
};

// Relationship operations
const linkServiceRequiresEnvVar = async (serviceName, envVarKey, properties = {}, sourceInfo = {}) => {
  const serviceId = generateNodeId(ENTITY_TYPES.SERVICE, serviceName);
  const envVarId = generateNodeId(ENTITY_TYPES.ENVVAR, envVarKey);
  
  return await upsertEdge(
    RELATIONSHIP_TYPES.SERVICE_REQUIRES_ENVVAR,
    serviceId,
    envVarId,
    properties,
    sourceInfo
  );
};

const linkIncidentImpactsService = async (incidentId, serviceName, properties = {}, sourceInfo = {}) => {
  const incidentNodeId = generateNodeId(ENTITY_TYPES.INCIDENT, incidentId);
  const serviceId = generateNodeId(ENTITY_TYPES.SERVICE, serviceName);
  
  return await upsertEdge(
    RELATIONSHIP_TYPES.INCIDENT_IMPACTS_SERVICE,
    incidentNodeId,
    serviceId,
    properties,
    sourceInfo
  );
};

// Query operations
const getRequiredEnvVarsForService = async (serviceName) => {
  const serviceId = generateNodeId(ENTITY_TYPES.SERVICE, serviceName);
  
  const neighbors = await getNeighbors(
    serviceId, 
    RELATIONSHIP_TYPES.SERVICE_REQUIRES_ENVVAR,
    1
  );
  
  return neighbors.filter(node => node.type === ENTITY_TYPES.ENVVAR);
};

const getServicesImpactedByIncident = async (incidentId) => {
  const incidentNodeId = generateNodeId(ENTITY_TYPES.INCIDENT, incidentId);
  
  const neighbors = await getNeighbors(
    incidentNodeId,
    RELATIONSHIP_TYPES.INCIDENT_IMPACTS_SERVICE,
    1
  );
  
  return neighbors.filter(node => node.type === ENTITY_TYPES.SERVICE);
};

const getIncidentsForService = async (serviceName) => {
  const serviceId = generateNodeId(ENTITY_TYPES.SERVICE, serviceName);
  
  const neighbors = await getNeighbors(
    serviceId,
    RELATIONSHIP_TYPES.INCIDENT_IMPACTS_SERVICE,
    1
  );
  
  return neighbors.filter(node => node.type === ENTITY_TYPES.INCIDENT);
};

// Multi-hop reasoning
const getIncidentsRelatedToRolloutRisks = async (serviceName) => {
  const serviceId = generateNodeId(ENTITY_TYPES.SERVICE, serviceName);
  
  // Get all neighbors up to 2 hops
  const allNeighbors = await getNeighbors(serviceId, null, 2);
  
  // Filter for incidents and analyze patterns
  const incidents = allNeighbors.filter(node => node.type === ENTITY_TYPES.INCIDENT);
  const envVars = allNeighbors.filter(node => node.type === ENTITY_TYPES.ENVVAR);
  
  // Get edges for risk analysis
  const edgeQuery = `
    SELECT * FROM memory_edges 
    WHERE (from_node = $1 OR to_node = $1)
       OR (from_node IN (${allNeighbors.map((_, i) => `$${i + 2}`).join(', ')}) 
           AND to_node IN (${allNeighbors.map((_, i) => `$${i + 2 + allNeighbors.length}`).join(', ')}))
  `;
  
  const edgeParams = [serviceId, ...allNeighbors.map(n => n.id), ...allNeighbors.map(n => n.id)];
  const edgeResult = await pool.query(edgeQuery, edgeParams);
  
  return {
    incidents,
    requiredEnvVars: envVars,
    risks: edgeResult.rows
  };
};

const findMissingEnvVarsForRollout = async (serviceName, presentEnvVars = []) => {
  const requiredEnvVars = await getRequiredEnvVarsForService(serviceName);
  const requiredKeys = requiredEnvVars.map(env => env.properties.key);
  const presentKeys = presentEnvVars.map(env => typeof env === 'string' ? env : env.key);
  
  const missing = requiredKeys.filter(key => !presentKeys.includes(key));
  
  return {
    required: requiredEnvVars,
    present: presentKeys,
    missing: missing,
    missingNodes: requiredEnvVars.filter(env => missing.includes(env.properties.key))
  };
};

module.exports = {
  ENTITY_TYPES,
  RELATIONSHIP_TYPES,
  generateNodeId,
  
  // Entity operations
  createService,
  getService,
  createEnvVar,
  getEnvVar,
  createIncident,
  getIncident,
  
  // Relationship operations
  linkServiceRequiresEnvVar,
  linkIncidentImpactsService,
  
  // Query operations
  getRequiredEnvVarsForService,
  getServicesImpactedByIncident,
  getIncidentsForService,
  getIncidentsRelatedToRolloutRisks,
  findMissingEnvVarsForRollout,
  getNeighbors
};