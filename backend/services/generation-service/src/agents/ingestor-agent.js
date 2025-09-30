const LLMClient = require('../llm/client');
const { 
  createService,
  createEnvVar,
  createIncident,
  linkServiceRequiresEnvVar,
  linkIncidentImpactsService,
  ENTITY_TYPES,
  RELATIONSHIP_TYPES
} = require('../models/memory-graph-client');

/**
 * Agent A: Ingestor
 * Extracts entities and relationships from text sources
 */

class IngestorAgent {
  constructor() {
    this.llmClient = new LLMClient();
  }

  /**
   * Ingest text and extract structured entities/relationships
   */
  async ingest(text, options = {}) {
    try {
      const { runId = 'ingest-' + Date.now(), sourceFile = null, lineNumber = null } = options;
      
      // Extract entities and relationships using LLM
      const extractionResult = await this.extractEntitiesAndRelations(text);
      
      if (!extractionResult.success) {
        return {
          success: false,
          error: extractionResult.error
        };
      }

      // Source information for auditability
      const sourceInfo = {
        runId,
        sourceFile,
        lineNumber,
        originalText: text,
        extractedAt: new Date().toISOString()
      };

      // Upsert nodes and edges
      const results = await this.upsertGraph(extractionResult.data, sourceInfo);
      
      return {
        success: true,
        ...results,
        sourceInfo
      };
    } catch (error) {
      console.error('Ingestor agent error:', error);
      return {
        success: false,
        error: error.message || 'Failed to ingest data'
      };
    }
  }

  /**
   * Extract entities and relationships using LLM
   */
  async extractEntitiesAndRelations(text) {
    const extractionPrompt = `
You are an entity and relationship extraction agent. Your job is to extract structured information from text about services, environment variables, and incidents.

Extract the following entity types:
- Service: Any service, application, or system mentioned
- EnvVar: Environment variables, configuration keys, or settings  
- Incident: Problems, outages, errors, or failures mentioned

Extract these relationship types:
- SERVICE_REQUIRES_ENVVAR: When a service needs/requires an environment variable
- INCIDENT_IMPACTS_SERVICE: When an incident affects/impacts a service

Text to analyze: "${text}"

Return a JSON object with this exact structure:
{
  "entities": [
    {
      "type": "Service|EnvVar|Incident", 
      "identifier": "unique_name_or_key",
      "properties": {}
    }
  ],
  "relationships": [
    {
      "type": "SERVICE_REQUIRES_ENVVAR|INCIDENT_IMPACTS_SERVICE",
      "from": "from_entity_identifier", 
      "to": "to_entity_identifier",
      "properties": {}
    }
  ]
}

Only extract entities and relationships that are explicitly mentioned or strongly implied in the text.
Use clear, consistent identifiers (e.g., service names, env var keys, incident IDs).
`;

    try {
      const response = await this.llmClient.generateText(extractionPrompt);
      
      // Parse JSON response
      let extractedData;
      try {
        extractedData = JSON.parse(response.trim());
      } catch (parseError) {
        // Try to extract JSON from response if wrapped in other text
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          extractedData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not parse extraction result as JSON');
        }
      }

      // Validate structure
      if (!extractedData.entities || !extractedData.relationships) {
        throw new Error('Invalid extraction format: missing entities or relationships');
      }

      return {
        success: true,
        data: extractedData
      };
    } catch (error) {
      return {
        success: false,
        error: `Extraction failed: ${error.message}`
      };
    }
  }

  /**
   * Upsert extracted entities and relationships into the graph
   */
  async upsertGraph(extractedData, sourceInfo) {
    const results = {
      nodes: [],
      edges: [],
      errors: []
    };

    // Create entities
    for (const entity of extractedData.entities || []) {
      try {
        let node;
        
        switch (entity.type) {
          case ENTITY_TYPES.SERVICE:
            node = await createService(entity.identifier, entity.properties, sourceInfo);
            break;
          case ENTITY_TYPES.ENVVAR:
            node = await createEnvVar(entity.identifier, entity.properties, sourceInfo);
            break;
          case ENTITY_TYPES.INCIDENT:
            node = await createIncident(entity.identifier, entity.properties, sourceInfo);
            break;
          default:
            throw new Error(`Unknown entity type: ${entity.type}`);
        }
        
        results.nodes.push(node);
      } catch (error) {
        results.errors.push({
          type: 'entity',
          entity,
          error: error.message
        });
      }
    }

    // Create relationships
    for (const relationship of extractedData.relationships || []) {
      try {
        let edge;
        
        switch (relationship.type) {
          case RELATIONSHIP_TYPES.SERVICE_REQUIRES_ENVVAR:
            edge = await linkServiceRequiresEnvVar(
              relationship.from, 
              relationship.to, 
              relationship.properties, 
              sourceInfo
            );
            break;
          case RELATIONSHIP_TYPES.INCIDENT_IMPACTS_SERVICE:
            edge = await linkIncidentImpactsService(
              relationship.from, 
              relationship.to, 
              relationship.properties, 
              sourceInfo
            );
            break;
          default:
            throw new Error(`Unknown relationship type: ${relationship.type}`);
        }
        
        results.edges.push(edge);
      } catch (error) {
        results.errors.push({
          type: 'relationship',
          relationship,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Convenience method to ingest a deployment log or README snippet
   */
  async ingestDeploymentInfo(text, serviceName = null) {
    const options = {
      runId: `deploy-${serviceName || 'unknown'}-${Date.now()}`,
      sourceFile: 'deployment-log'
    };
    
    return await this.ingest(text, options);
  }

  /**
   * Convenience method to ingest incident information
   */
  async ingestIncidentInfo(text, incidentId = null) {
    const options = {
      runId: `incident-${incidentId || 'unknown'}-${Date.now()}`,
      sourceFile: 'incident-report'
    };
    
    return await this.ingest(text, options);
  }
}

module.exports = IngestorAgent;