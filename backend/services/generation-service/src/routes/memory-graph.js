const express = require('express');
const Joi = require('joi');
const IngestorAgent = require('../agents/ingestor-agent');
const PlannerAgent = require('../agents/planner-agent');

const router = express.Router();

// Initialize agents
const ingestorAgent = new IngestorAgent();
const plannerAgent = new PlannerAgent();

// Validation schemas
const ingestSchema = Joi.object({
  text: Joi.string().min(1).max(5000).required(),
  options: Joi.object({
    runId: Joi.string().optional(),
    sourceFile: Joi.string().optional(),
    lineNumber: Joi.number().optional()
  }).optional()
});

const plannerSchema = Joi.object({
  question: Joi.string().min(1).max(500).required(),
  context: Joi.object({
    serviceName: Joi.string().optional(),
    incidentId: Joi.string().optional(),
    presentEnvVars: Joi.array().items(Joi.string()).optional()
  }).optional()
});

/**
 * Agent A: Ingestor endpoint
 * POST /memory-graph/ingest
 * Extracts entities and relationships from text
 */
router.post('/ingest', async (req, res) => {
  try {
    const { error, value } = ingestSchema.validate(req.body);
    if (error) {
      req.logger?.warn('Memory graph ingest validation failed', { error: error.details[0].message });
      return res.status(400).json({ error: error.details[0].message });
    }

    const { text, options = {} } = value;
    
    req.logger?.info('Memory graph ingest started', { 
      textLength: text.length,
      hasOptions: !!Object.keys(options).length 
    });
    
    const result = await ingestorAgent.ingest(text, options);
    
    req.logger?.info('Memory graph ingest completed', { 
      success: result.success,
      nodesCreated: result.nodes?.length || 0,
      edgesCreated: result.edges?.length || 0,
      errors: result.errors?.length || 0
    });
    
    res.json(result);
  } catch (error) {
    req.logger?.error('Memory graph ingest error', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Agent B: Planner endpoint  
 * POST /memory-graph/query
 * Answers questions using graph-only queries
 */
router.post('/query', async (req, res) => {
  try {
    const { error, value } = plannerSchema.validate(req.body);
    if (error) {
      req.logger?.warn('Memory graph query validation failed', { error: error.details[0].message });
      return res.status(400).json({ error: error.details[0].message });
    }

    const { question, context = {} } = value;
    
    req.logger?.info('Memory graph query started', { 
      question,
      hasContext: !!Object.keys(context).length 
    });
    
    const result = await plannerAgent.answerQuestion(question, context);
    
    req.logger?.info('Memory graph query completed', { 
      success: result.success,
      analysisType: result.serviceName ? 'service' : result.incidentId ? 'incident' : 'general'
    });
    
    res.json(result);
  } catch (error) {
    req.logger?.error('Memory graph query error', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Convenience endpoints for specific use cases
 */

// Ingest deployment information
router.post('/ingest/deployment', async (req, res) => {
  try {
    const { text, serviceName } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const result = await ingestorAgent.ingestDeploymentInfo(text, serviceName);
    res.json(result);
  } catch (error) {
    req.logger?.error('Deployment ingest error', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ingest incident information
router.post('/ingest/incident', async (req, res) => {
  try {
    const { text, incidentId } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const result = await ingestorAgent.ingestIncidentInfo(text, incidentId);
    res.json(result);
  } catch (error) {
    req.logger?.error('Incident ingest error', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Query rollout blockers
router.post('/query/rollout-blockers', async (req, res) => {
  try {
    const { serviceName } = req.body;
    if (!serviceName) {
      return res.status(400).json({ error: 'Service name is required' });
    }
    
    const result = await plannerAgent.analyzeRolloutBlockers(serviceName);
    res.json(result);
  } catch (error) {
    req.logger?.error('Rollout blockers query error', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Query missing environment variables
router.post('/query/missing-env-vars', async (req, res) => {
  try {
    const { serviceName, presentEnvVars = [] } = req.body;
    if (!serviceName) {
      return res.status(400).json({ error: 'Service name is required' });
    }
    
    const result = await plannerAgent.findMissingEnvVars(serviceName, presentEnvVars);
    res.json(result);
  } catch (error) {
    req.logger?.error('Missing env vars query error', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Query related incidents
router.post('/query/related-incidents', async (req, res) => {
  try {
    const { serviceName } = req.body;
    if (!serviceName) {
      return res.status(400).json({ error: 'Service name is required' });
    }
    
    const result = await plannerAgent.findRelatedIncidents(serviceName);
    res.json(result);
  } catch (error) {
    req.logger?.error('Related incidents query error', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check for memory graph service
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    agents: ['ingestor', 'planner'],
    features: ['entity-extraction', 'graph-queries', 'multi-hop-reasoning'],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;