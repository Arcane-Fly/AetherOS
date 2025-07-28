const express = require('express');
const Joi = require('joi');
const CodeGenerator = require('../generators/code-generator');
const APIGenerator = require('../generators/api-generator');
const UIGenerator = require('../generators/ui-generator');
const CLIGenerator = require('../generators/cli-generator');

const router = express.Router();

// Initialize generators
const codeGenerator = new CodeGenerator();
const apiGenerator = new APIGenerator();
const uiGenerator = new UIGenerator();
const cliGenerator = new CLIGenerator();

// Validation schemas
const generateSchema = Joi.object({
  prompt: Joi.string().min(5).max(2000).required(),
  language: Joi.string().optional(),
  options: Joi.object().optional()
});

// Code generation endpoint
router.post('/code', async (req, res) => {
  try {
    const { error, value } = generateSchema.validate(req.body);
    if (error) {
      req.logger?.warn('Code generation validation failed', { error: error.details[0].message });
      return res.status(400).json({ error: error.details[0].message });
    }

    const { prompt, language, options } = value;
    
    req.logger?.info('Code generation request started', { 
      language, 
      promptLength: prompt.length,
      hasOptions: !!options 
    });
    
    const result = await codeGenerator.generate(prompt, { language, ...options }, req.logger);
    
    req.logger?.info('Code generation completed', { 
      success: result.success,
      language: result.language,
      codeLength: result.code?.length || 0
    });
    
    res.json(result);
  } catch (error) {
    req.logger?.error('Code generation error', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API generation endpoint
router.post('/api', async (req, res) => {
  try {
    const { error, value } = generateSchema.validate(req.body);
    if (error) {
      req.logger?.warn('API generation validation failed', { error: error.details[0].message });
      return res.status(400).json({ error: error.details[0].message });
    }

    const { prompt, options } = value;
    
    req.logger?.info('API generation request started', { 
      promptLength: prompt.length,
      hasOptions: !!options 
    });
    
    const result = await apiGenerator.generate(prompt, options, req.logger);
    
    req.logger?.info('API generation completed', { 
      success: result.success,
      specLength: result.spec?.length || 0
    });
    
    res.json(result);
  } catch (error) {
    req.logger?.error('API generation error', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UI generation endpoint
router.post('/ui', async (req, res) => {
  try {
    const { error, value } = generateSchema.validate(req.body);
    if (error) {
      req.logger?.warn('UI generation validation failed', { error: error.details[0].message });
      return res.status(400).json({ error: error.details[0].message });
    }

    const { prompt, options } = value;
    
    req.logger?.info('UI generation request started', { 
      promptLength: prompt.length,
      hasOptions: !!options 
    });
    
    const result = await uiGenerator.generate(prompt, options, req.logger);
    
    req.logger?.info('UI generation completed', { 
      success: result.success,
      componentLength: result.component?.length || 0
    });
    
    res.json(result);
  } catch (error) {
    req.logger?.error('UI generation error', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CLI generation endpoint
router.post('/cli', async (req, res) => {
  try {
    const { error, value } = generateSchema.validate(req.body);
    if (error) {
      req.logger?.warn('CLI generation validation failed', { error: error.details[0].message });
      return res.status(400).json({ error: error.details[0].message });
    }

    const { prompt, options } = value;
    
    req.logger?.info('CLI generation request started', { 
      promptLength: prompt.length,
      hasOptions: !!options 
    });
    
    const result = await cliGenerator.generate(prompt, options, req.logger);
    
    req.logger?.info('CLI generation completed', { 
      success: result.success,
      language: result.language,
      cliLength: result.cli?.length || 0
    });
    
    res.json(result);
  } catch (error) {
    req.logger?.error('CLI generation error', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check for generation service
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    generators: ['code', 'api', 'ui', 'cli'],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;