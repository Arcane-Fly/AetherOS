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
      return res.status(400).json({ error: error.details[0].message });
    }

    const { prompt, language, options } = value;
    const result = await codeGenerator.generate(prompt, { language, ...options });
    
    res.json(result);
  } catch (error) {
    console.error('Code generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API generation endpoint
router.post('/api', async (req, res) => {
  try {
    const { error, value } = generateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { prompt, options } = value;
    const result = await apiGenerator.generate(prompt, options);
    
    res.json(result);
  } catch (error) {
    console.error('API generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UI generation endpoint
router.post('/ui', async (req, res) => {
  try {
    const { error, value } = generateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { prompt, options } = value;
    const result = await uiGenerator.generate(prompt, options);
    
    res.json(result);
  } catch (error) {
    console.error('UI generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CLI generation endpoint
router.post('/cli', async (req, res) => {
  try {
    const { error, value } = generateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { prompt, options } = value;
    const result = await cliGenerator.generate(prompt, options);
    
    res.json(result);
  } catch (error) {
    console.error('CLI generation error:', error);
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