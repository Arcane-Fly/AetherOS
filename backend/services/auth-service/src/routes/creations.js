const express = require('express');
const Joi = require('joi');
const auth = require('../middleware/auth');
const { Pool } = require('pg');

const router = express.Router();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/aetheros'
});

// Validation schemas
const createCreationSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000).required(),
  type: Joi.string().valid('code', 'api', 'ui', 'cli').required(),
  content: Joi.string().required(),
  language: Joi.string().optional(),
  metadata: Joi.object().optional(),
  framework: Joi.string().optional(),
  executable: Joi.boolean().optional()
});

const linkCreationsSchema = Joi.object({
  sourceId: Joi.number().required(),
  targetId: Joi.number().required(),
  linkType: Joi.string().valid('reference', 'extends', 'imports', 'dependency').required()
});

// Get all creations for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM creations WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    
    // Get links for each creation
    for (let creation of result.rows) {
      const linksResult = await pool.query(
        'SELECT cl.*, c.name as target_name, c.type as target_type FROM creation_links cl JOIN creations c ON cl.target_id = c.id WHERE cl.source_id = $1',
        [creation.id]
      );
      creation.links = linksResult.rows;
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching creations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new creation
router.post('/', auth, async (req, res) => {
  try {
    const { error, value } = createCreationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, description, type, content, language, metadata, framework, executable } = value;
    
    const result = await pool.query(
      `INSERT INTO creations (user_id, name, description, type, content, language, metadata, framework, executable, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) 
       RETURNING *`,
      [req.user.id, name, description, type, content, language, JSON.stringify(metadata), framework, executable]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating creation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a creation
router.put('/:id', auth, async (req, res) => {
  try {
    const creationId = parseInt(req.params.id);
    const { name, description, content, metadata } = req.body;
    
    const result = await pool.query(
      `UPDATE creations SET name = COALESCE($1, name), description = COALESCE($2, description), 
       content = COALESCE($3, content), metadata = COALESCE($4, metadata), updated_at = NOW()
       WHERE id = $5 AND user_id = $6 RETURNING *`,
      [name, description, content, JSON.stringify(metadata), creationId, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Creation not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating creation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a creation
router.delete('/:id', auth, async (req, res) => {
  try {
    const creationId = parseInt(req.params.id);
    
    // Delete links first
    await pool.query('DELETE FROM creation_links WHERE source_id = $1 OR target_id = $1', [creationId]);
    
    // Delete creation
    const result = await pool.query(
      'DELETE FROM creations WHERE id = $1 AND user_id = $2 RETURNING *',
      [creationId, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Creation not found' });
    }
    
    res.json({ message: 'Creation deleted successfully' });
  } catch (error) {
    console.error('Error deleting creation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Link two creations
router.post('/link', auth, async (req, res) => {
  try {
    const { error, value } = linkCreationsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { sourceId, targetId, linkType } = value;
    
    // Verify both creations belong to the user
    const verifyResult = await pool.query(
      'SELECT COUNT(*) as count FROM creations WHERE id IN ($1, $2) AND user_id = $3',
      [sourceId, targetId, req.user.id]
    );
    
    if (parseInt(verifyResult.rows[0].count) !== 2) {
      return res.status(403).json({ error: 'Cannot link creations you do not own' });
    }
    
    // Check if link already exists
    const existingLink = await pool.query(
      'SELECT * FROM creation_links WHERE source_id = $1 AND target_id = $2',
      [sourceId, targetId]
    );
    
    if (existingLink.rows.length > 0) {
      return res.status(400).json({ error: 'Link already exists' });
    }
    
    // Create the link
    const result = await pool.query(
      'INSERT INTO creation_links (source_id, target_id, link_type, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [sourceId, targetId, linkType]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error linking creations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unlink two creations
router.delete('/link/:sourceId/:targetId', auth, async (req, res) => {
  try {
    const sourceId = parseInt(req.params.sourceId);
    const targetId = parseInt(req.params.targetId);
    
    // Verify both creations belong to the user
    const verifyResult = await pool.query(
      'SELECT COUNT(*) as count FROM creations WHERE id IN ($1, $2) AND user_id = $3',
      [sourceId, targetId, req.user.id]
    );
    
    if (parseInt(verifyResult.rows[0].count) !== 2) {
      return res.status(403).json({ error: 'Cannot unlink creations you do not own' });
    }
    
    const result = await pool.query(
      'DELETE FROM creation_links WHERE source_id = $1 AND target_id = $2 RETURNING *',
      [sourceId, targetId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json({ message: 'Link removed successfully' });
  } catch (error) {
    console.error('Error unlinking creations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get links for a specific creation
router.get('/:id/links', auth, async (req, res) => {
  try {
    const creationId = parseInt(req.params.id);
    
    // Verify creation belongs to the user
    const verifyResult = await pool.query(
      'SELECT * FROM creations WHERE id = $1 AND user_id = $2',
      [creationId, req.user.id]
    );
    
    if (verifyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Creation not found' });
    }
    
    const result = await pool.query(
      `SELECT cl.*, c.name as target_name, c.type as target_type, c.description as target_description 
       FROM creation_links cl 
       JOIN creations c ON cl.target_id = c.id 
       WHERE cl.source_id = $1`,
      [creationId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching creation links:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get creation mesh (all connections)
router.get('/mesh', auth, async (req, res) => {
  try {
    const creationsResult = await pool.query(
      'SELECT id, name, type, description FROM creations WHERE user_id = $1',
      [req.user.id]
    );
    
    const linksResult = await pool.query(
      `SELECT cl.* FROM creation_links cl 
       JOIN creations c1 ON cl.source_id = c1.id 
       JOIN creations c2 ON cl.target_id = c2.id 
       WHERE c1.user_id = $1 AND c2.user_id = $1`,
      [req.user.id]
    );
    
    res.json({
      nodes: creationsResult.rows,
      links: linksResult.rows
    });
  } catch (error) {
    console.error('Error fetching creation mesh:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Execute/preview a creation (placeholder for future implementation)
router.post('/:id/execute', auth, async (req, res) => {
  try {
    const creationId = parseInt(req.params.id);
    
    const result = await pool.query(
      'SELECT * FROM creations WHERE id = $1 AND user_id = $2',
      [creationId, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Creation not found' });
    }
    
    const creation = result.rows[0];
    
    // For now, just return success with metadata
    // Future implementation could actually execute code in sandboxed environment
    res.json({
      success: true,
      message: `Execution of ${creation.type} creation completed`,
      output: 'Execution feature coming soon...',
      creation: creation
    });
  } catch (error) {
    console.error('Error executing creation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;