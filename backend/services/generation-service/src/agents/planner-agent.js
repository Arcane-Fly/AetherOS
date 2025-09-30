const {
  getService,
  getEnvVar,
  getIncident,
  getRequiredEnvVarsForService,
  getServicesImpactedByIncident,
  getIncidentsForService,
  getIncidentsRelatedToRolloutRisks,
  findMissingEnvVarsForRollout,
  getNeighbors,
  ENTITY_TYPES
} = require('../models/memory-graph-client');

/**
 * Agent B: Planner
 * Answers tasks using only graph queries (no raw text)
 */

class PlannerAgent {
  constructor() {
    // Force graph-only queries - no LLM access
  }

  /**
   * Main planning interface - interprets questions and routes to graph queries
   */
  async answerQuestion(question, context = {}) {
    try {
      const normalizedQuestion = question.toLowerCase().trim();
      
      // Route to appropriate graph query based on question pattern
      if (normalizedQuestion.includes('blocking') && normalizedQuestion.includes('rollout')) {
        return await this.analyzeRolloutBlockers(context.serviceName);
      }
      
      if (normalizedQuestion.includes('missing') && normalizedQuestion.includes('env')) {
        return await this.findMissingEnvVars(context.serviceName, context.presentEnvVars);
      }
      
      if (normalizedQuestion.includes('incidents') && normalizedQuestion.includes('related')) {
        return await this.findRelatedIncidents(context.serviceName);
      }
      
      if (normalizedQuestion.includes('impact') && normalizedQuestion.includes('service')) {
        return await this.analyzeServiceImpacts(context.incidentId);
      }
      
      if (normalizedQuestion.includes('dependencies') || normalizedQuestion.includes('requires')) {
        return await this.analyzeDependencies(context.serviceName);
      }

      return {
        success: false,
        error: 'Question pattern not recognized. Supported queries: rollout blockers, missing env vars, related incidents, service impacts, dependencies'
      };
    } catch (error) {
      console.error('Planner agent error:', error);
      return {
        success: false,
        error: error.message || 'Failed to process question'
      };
    }
  }

  /**
   * What's blocking service rollout?
   */
  async analyzeRolloutBlockers(serviceName) {
    if (!serviceName) {
      return {
        success: false,
        error: 'Service name is required'
      };
    }

    const service = await getService(serviceName);
    if (!service) {
      return {
        success: false,
        error: `Service '${serviceName}' not found in graph`
      };
    }

    // Get all required environment variables
    const requiredEnvVars = await getRequiredEnvVarsForService(serviceName);
    
    // Get related incidents
    const relatedIncidents = await getIncidentsForService(serviceName);
    
    // Get comprehensive rollout risk analysis
    const rolloutRisks = await getIncidentsRelatedToRolloutRisks(serviceName);

    return {
      success: true,
      serviceName,
      analysis: {
        requiredEnvVars: requiredEnvVars.map(env => ({
          key: env.properties.key,
          id: env.id,
          properties: env.properties
        })),
        relatedIncidents: relatedIncidents.map(incident => ({
          id: incident.properties.incidentId,
          nodeId: incident.id,
          properties: incident.properties
        })),
        rolloutRisks: {
          totalIncidents: rolloutRisks.incidents.length,
          totalEnvVars: rolloutRisks.requiredEnvVars.length,
          riskFactors: rolloutRisks.risks.length
        }
      },
      recommendations: this.generateRolloutRecommendations(requiredEnvVars, relatedIncidents)
    };
  }

  /**
   * Find missing environment variables for a service
   */
  async findMissingEnvVars(serviceName, presentEnvVars = []) {
    if (!serviceName) {
      return {
        success: false,
        error: 'Service name is required'
      };
    }

    const analysis = await findMissingEnvVarsForRollout(serviceName, presentEnvVars);
    
    return {
      success: true,
      serviceName,
      envVarAnalysis: {
        required: analysis.required.map(env => env.properties.key),
        present: analysis.present,
        missing: analysis.missing,
        missingCount: analysis.missing.length,
        completionPercentage: analysis.present.length / analysis.required.length * 100
      },
      blockers: analysis.missing.map(key => ({
        envVar: key,
        severity: 'high',
        reason: 'Required for service operation'
      }))
    };
  }

  /**
   * Find incidents related to rollout risks
   */
  async findRelatedIncidents(serviceName) {
    if (!serviceName) {
      return {
        success: false,
        error: 'Service name is required'
      };
    }

    const rolloutAnalysis = await getIncidentsRelatedToRolloutRisks(serviceName);
    
    // Group incidents by type and severity
    const incidentAnalysis = this.analyzeIncidentPatterns(rolloutAnalysis.incidents);
    
    return {
      success: true,
      serviceName,
      incidentAnalysis: {
        totalIncidents: rolloutAnalysis.incidents.length,
        incidents: rolloutAnalysis.incidents.map(incident => ({
          id: incident.properties.incidentId,
          cause: incident.properties.cause || 'Unknown',
          impact: incident.properties.impact || 'Unknown',
          timestamp: incident.created_at
        })),
        patterns: incidentAnalysis
      },
      riskAssessment: this.assessRolloutRisk(rolloutAnalysis)
    };
  }

  /**
   * Analyze which services are impacted by an incident
   */
  async analyzeServiceImpacts(incidentId) {
    if (!incidentId) {
      return {
        success: false,
        error: 'Incident ID is required'
      };
    }

    const incident = await getIncident(incidentId);
    if (!incident) {
      return {
        success: false,
        error: `Incident '${incidentId}' not found in graph`
      };
    }

    const impactedServices = await getServicesImpactedByIncident(incidentId);
    
    // Get extended impact analysis
    const extendedImpact = await this.analyzeExtendedImpact(incidentId, impactedServices);
    
    return {
      success: true,
      incidentId,
      incident: {
        id: incident.properties.incidentId,
        cause: incident.properties.cause,
        properties: incident.properties
      },
      directImpacts: impactedServices.map(service => ({
        serviceName: service.properties.name,
        serviceId: service.id
      })),
      extendedAnalysis: extendedImpact
    };
  }

  /**
   * Analyze service dependencies
   */
  async analyzeDependencies(serviceName) {
    if (!serviceName) {
      return {
        success: false,
        error: 'Service name is required'
      };
    }

    const service = await getService(serviceName);
    if (!service) {
      return {
        success: false,
        error: `Service '${serviceName}' not found in graph`
      };
    }

    // Get all neighbors (dependencies and dependents)
    const neighbors = await getNeighbors(service.id, null, 2);
    
    // Categorize dependencies
    const dependencies = this.categorizeDependencies(neighbors);
    
    return {
      success: true,
      serviceName,
      dependencies: {
        envVars: dependencies.envVars,
        incidents: dependencies.incidents,
        totalDependencies: dependencies.total
      },
      dependencyHealth: this.assessDependencyHealth(dependencies)
    };
  }

  // Helper methods
  generateRolloutRecommendations(requiredEnvVars, relatedIncidents) {
    const recommendations = [];
    
    if (requiredEnvVars.length > 0) {
      recommendations.push({
        type: 'environment',
        priority: 'high',
        action: `Verify all ${requiredEnvVars.length} required environment variables are set`
      });
    }
    
    if (relatedIncidents.length > 0) {
      recommendations.push({
        type: 'incidents',
        priority: 'medium', 
        action: `Review ${relatedIncidents.length} related incidents before deploying`
      });
    }
    
    return recommendations;
  }

  analyzeIncidentPatterns(incidents) {
    const patterns = {
      byType: {},
      recurrent: [],
      recent: []
    };
    
    incidents.forEach(incident => {
      const cause = incident.properties.cause || 'unknown';
      patterns.byType[cause] = (patterns.byType[cause] || 0) + 1;
      
      // Check if incident is recent (within last 30 days)
      const incidentDate = new Date(incident.created_at);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      if (incidentDate > thirtyDaysAgo) {
        patterns.recent.push(incident);
      }
    });
    
    return patterns;
  }

  assessRolloutRisk(rolloutAnalysis) {
    const { incidents, requiredEnvVars } = rolloutAnalysis;
    
    let riskScore = 0;
    if (incidents.length > 0) riskScore += incidents.length * 10;
    if (requiredEnvVars.length > 5) riskScore += 20;
    
    return {
      score: riskScore,
      level: riskScore < 20 ? 'low' : riskScore < 50 ? 'medium' : 'high',
      factors: [
        `${incidents.length} related incidents found`,
        `${requiredEnvVars.length} environment variables required`
      ]
    };
  }

  async analyzeExtendedImpact(incidentId, directServices) {
    // For each directly impacted service, find what depends on it
    const extendedImpacts = [];
    
    for (const service of directServices) {
      const serviceDeps = await getNeighbors(service.id, null, 1);
      extendedImpacts.push({
        service: service.properties.name,
        dependentServices: serviceDeps.filter(dep => dep.type === ENTITY_TYPES.SERVICE).length,
        requiredEnvVars: serviceDeps.filter(dep => dep.type === ENTITY_TYPES.ENVVAR).length
      });
    }
    
    return extendedImpacts;
  }

  categorizeDependencies(neighbors) {
    const dependencies = {
      envVars: neighbors.filter(node => node.type === ENTITY_TYPES.ENVVAR),
      incidents: neighbors.filter(node => node.type === ENTITY_TYPES.INCIDENT),
      services: neighbors.filter(node => node.type === ENTITY_TYPES.SERVICE),
      total: neighbors.length
    };
    
    return dependencies;
  }

  assessDependencyHealth(dependencies) {
    const health = {
      status: 'healthy',
      issues: []
    };
    
    if (dependencies.incidents.length > 0) {
      health.status = 'warning';
      health.issues.push(`${dependencies.incidents.length} related incidents found`);
    }
    
    if (dependencies.envVars.length > 10) {
      health.issues.push(`High number of environment dependencies (${dependencies.envVars.length})`);
    }
    
    return health;
  }
}

module.exports = PlannerAgent;