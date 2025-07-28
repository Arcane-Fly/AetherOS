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

const searchCreationsSchema = Joi.object({
  search: Joi.string().max(255).optional(),
  type: Joi.string().valid('code', 'api', 'ui', 'cli').optional(),
  limit: Joi.number().integer().min(1).max(100).default(50),
  offset: Joi.number().integer().min(0).default(0),
  sortBy: Joi.string().valid('created_at', 'updated_at', 'name', 'type').default('created_at'),
  sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC')
});

// Search creations with advanced filtering
router.get('/search', auth, async (req, res) => {
  try {
    const { error, value } = searchCreationsSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { search, type, limit, offset, sortBy, sortOrder } = value;
    
    // Build dynamic query
    let query = 'SELECT * FROM creations WHERE user_id = $1';
    const params = [req.user.id];
    let paramIndex = 2;
    
    // Add search filter
    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    // Add type filter
    if (type) {
      query += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }
    
    // Add sorting
    query += ` ORDER BY ${sortBy} ${sortOrder}`;
    
    // Add pagination
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    // Get count for pagination
    let countQuery = 'SELECT COUNT(*) FROM creations WHERE user_id = $1';
    const countParams = [req.user.id];
    let countParamIndex = 2;
    
    if (search) {
      countQuery += ` AND (name ILIKE $${countParamIndex} OR description ILIKE $${countParamIndex} OR content ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }
    
    if (type) {
      countQuery += ` AND type = $${countParamIndex}`;
      countParams.push(type);
    }
    
    const countResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);
    
    res.json({
      creations: result.rows,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + result.rows.length < totalCount
      },
      filters: { search, type, sortBy, sortOrder }
    });
  } catch (error) {
    console.error('Error searching creations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all creations for authenticated user with search and filtering
router.get('/', auth, async (req, res) => {
  try {
    const { search, type, limit = 50, offset = 0, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
    
    // Build dynamic query
    let query = 'SELECT * FROM creations WHERE user_id = $1';
    const params = [req.user.id];
    let paramIndex = 2;
    
    // Add search filter
    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    // Add type filter
    if (type && ['code', 'api', 'ui', 'cli'].includes(type)) {
      query += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }
    
    // Add sorting
    const validSortFields = ['created_at', 'updated_at', 'name', 'type'];
    const validSortOrders = ['ASC', 'DESC'];
    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    } else {
      query += ' ORDER BY created_at DESC';
    }
    
    // Add pagination
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await pool.query(query, params);
    
    // Get count for pagination
    let countQuery = 'SELECT COUNT(*) FROM creations WHERE user_id = $1';
    const countParams = [req.user.id];
    let countParamIndex = 2;
    
    if (search) {
      countQuery += ` AND (name ILIKE $${countParamIndex} OR description ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }
    
    if (type && ['code', 'api', 'ui', 'cli'].includes(type)) {
      countQuery += ` AND type = $${countParamIndex}`;
      countParams.push(type);
    }
    
    const countResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);
    
    // Get links for each creation
    for (let creation of result.rows) {
      const linksResult = await pool.query(
        'SELECT cl.*, c.name as target_name, c.type as target_type FROM creation_links cl JOIN creations c ON cl.target_id = c.id WHERE cl.source_id = $1',
        [creation.id]
      );
      creation.links = linksResult.rows;
    }
    
    res.json({
      creations: result.rows,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + result.rows.length < totalCount
      }
    });
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

// Export a single creation
router.get('/:id/export', auth, async (req, res) => {
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
    
    // Get links for this creation
    const linksResult = await pool.query(
      'SELECT cl.*, c.name as target_name, c.type as target_type FROM creation_links cl JOIN creations c ON cl.target_id = c.id WHERE cl.source_id = $1',
      [creation.id]
    );
    
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      creation: {
        name: creation.name,
        description: creation.description,
        type: creation.type,
        content: creation.content,
        language: creation.language,
        metadata: creation.metadata,
        framework: creation.framework,
        executable: creation.executable,
        links: linksResult.rows.map(link => ({
          targetName: link.target_name,
          targetType: link.target_type,
          linkType: link.link_type
        }))
      }
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${creation.name}-export.json"`);
    res.json(exportData);
  } catch (error) {
    console.error('Error exporting creation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export multiple creations or all user creations
router.post('/export', auth, async (req, res) => {
  try {
    const { creationIds, includeLinks = true } = req.body;
    
    let query, params;
    if (creationIds && Array.isArray(creationIds)) {
      const placeholders = creationIds.map((_, index) => `$${index + 2}`).join(',');
      query = `SELECT * FROM creations WHERE user_id = $1 AND id IN (${placeholders})`;
      params = [req.user.id, ...creationIds];
    } else {
      query = 'SELECT * FROM creations WHERE user_id = $1 ORDER BY created_at DESC';
      params = [req.user.id];
    }
    
    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No creations found' });
    }
    
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      creations: []
    };
    
    // Process each creation
    for (const creation of result.rows) {
      const creationData = {
        name: creation.name,
        description: creation.description,
        type: creation.type,
        content: creation.content,
        language: creation.language,
        metadata: creation.metadata,
        framework: creation.framework,
        executable: creation.executable
      };
      
      if (includeLinks) {
        const linksResult = await pool.query(
          'SELECT cl.*, c.name as target_name, c.type as target_type FROM creation_links cl JOIN creations c ON cl.target_id = c.id WHERE cl.source_id = $1',
          [creation.id]
        );
        
        creationData.links = linksResult.rows.map(link => ({
          targetName: link.target_name,
          targetType: link.target_type,
          linkType: link.link_type
        }));
      }
      
      exportData.creations.push(creationData);
    }
    
    const filename = creationIds ? `creations-${creationIds.length}-export.json` : 'all-creations-export.json';
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.json(exportData);
  } catch (error) {
    console.error('Error exporting creations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Import creations from exported data
router.post('/import', auth, async (req, res) => {
  try {
    const { importData, overwriteExisting = false, preserveLinks = true } = req.body;
    
    if (!importData || !importData.version || !importData.creations) {
      return res.status(400).json({ error: 'Invalid import data format' });
    }
    
    if (importData.version !== '1.0') {
      return res.status(400).json({ error: 'Unsupported import data version' });
    }
    
    const results = {
      imported: [],
      skipped: [],
      errors: []
    };
    
    // Process each creation
    for (const creationData of importData.creations) {
      try {
        // Check if creation with same name already exists
        const existingResult = await pool.query(
          'SELECT id FROM creations WHERE user_id = $1 AND name = $2',
          [req.user.id, creationData.name]
        );
        
        if (existingResult.rows.length > 0 && !overwriteExisting) {
          results.skipped.push({
            name: creationData.name,
            reason: 'Creation with same name already exists'
          });
          continue;
        }
        
        let creationId;
        
        if (existingResult.rows.length > 0 && overwriteExisting) {
          // Update existing creation
          const updateResult = await pool.query(
            `UPDATE creations SET description = $1, type = $2, content = $3, language = $4, 
             metadata = $5, framework = $6, executable = $7, updated_at = NOW()
             WHERE id = $8 AND user_id = $9 RETURNING id`,
            [
              creationData.description,
              creationData.type,
              creationData.content,
              creationData.language,
              JSON.stringify(creationData.metadata),
              creationData.framework,
              creationData.executable,
              existingResult.rows[0].id,
              req.user.id
            ]
          );
          creationId = updateResult.rows[0].id;
        } else {
          // Create new creation
          const insertResult = await pool.query(
            `INSERT INTO creations (user_id, name, description, type, content, language, metadata, framework, executable, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) 
             RETURNING id`,
            [
              req.user.id,
              creationData.name,
              creationData.description,
              creationData.type,
              creationData.content,
              creationData.language,
              JSON.stringify(creationData.metadata),
              creationData.framework,
              creationData.executable
            ]
          );
          creationId = insertResult.rows[0].id;
        }
        
        results.imported.push({
          id: creationId,
          name: creationData.name,
          type: creationData.type
        });
        
      } catch (error) {
        results.errors.push({
          name: creationData.name,
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      results,
      summary: {
        imported: results.imported.length,
        skipped: results.skipped.length,
        errors: results.errors.length
      }
    });
  } catch (error) {
    console.error('Error importing creations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;