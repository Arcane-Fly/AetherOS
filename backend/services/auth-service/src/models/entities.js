const { upsertNode, upsertEdge, getNode, getNeighbors, getSubgraph } = require('./memory-graph');

/**
 * Entity Schema Implementation for Memory Graph
 * Defines Service, EnvVar, and Incident entities with their relationships
 */

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

// Query operations for specific use cases
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

// Multi-hop reasoning: Get incidents related to rollout risks
const getIncidentsRelatedToRolloutRisks = async (serviceName) => {
  const serviceId = generateNodeId(ENTITY_TYPES.SERVICE, serviceName);
  
  // Get subgraph of service and its dependencies/incidents
  const subgraph = await getSubgraph([serviceId], 2);
  
  // Filter for incidents and analyze patterns
  const incidents = subgraph.nodes.filter(node => node.type === ENTITY_TYPES.INCIDENT);
  const envVars = subgraph.nodes.filter(node => node.type === ENTITY_TYPES.ENVVAR);
  
  return {
    incidents,
    requiredEnvVars: envVars,
    risks: subgraph.edges.filter(edge => 
      edge.type === RELATIONSHIP_TYPES.INCIDENT_IMPACTS_SERVICE ||
      edge.type === RELATIONSHIP_TYPES.SERVICE_REQUIRES_ENVVAR
    )
  };
};

// Find missing environment variables that could cause issues
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
  findMissingEnvVarsForRollout
};