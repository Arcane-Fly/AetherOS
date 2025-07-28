const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://aetheros:aetheros123@localhost:5432/aetheros',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    client.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

const createTables = async () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      name VARCHAR(255) NOT NULL,
      provider VARCHAR(50) DEFAULT 'local',
      provider_id VARCHAR(255),
      avatar VARCHAR(500),
      refresh_token TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      last_login TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(provider, provider_id)
    );
  `;

  const createCreationsTable = `
    CREATE TABLE IF NOT EXISTS creations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      type VARCHAR(50) NOT NULL,
      content TEXT,
      language VARCHAR(50),
      metadata JSONB,
      framework VARCHAR(100),
      executable BOOLEAN DEFAULT FALSE,
      version INTEGER DEFAULT 1,
      parent_version_id INTEGER REFERENCES creations(id) ON DELETE SET NULL,
      is_current_version BOOLEAN DEFAULT TRUE,
      is_template BOOLEAN DEFAULT FALSE,
      template_category VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  const createCreationLinksTable = `
    CREATE TABLE IF NOT EXISTS creation_links (
      id SERIAL PRIMARY KEY,
      source_id INTEGER REFERENCES creations(id) ON DELETE CASCADE,
      target_id INTEGER REFERENCES creations(id) ON DELETE CASCADE,
      link_type VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(source_id, target_id)
    );
  `;

  const createIndexes = `
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_creations_user_id ON creations(user_id);
    CREATE INDEX IF NOT EXISTS idx_creations_type ON creations(type);
    CREATE INDEX IF NOT EXISTS idx_creations_version ON creations(version);
    CREATE INDEX IF NOT EXISTS idx_creations_current ON creations(is_current_version);
    CREATE INDEX IF NOT EXISTS idx_creations_parent ON creations(parent_version_id);
    CREATE INDEX IF NOT EXISTS idx_creations_template ON creations(is_template);
    CREATE INDEX IF NOT EXISTS idx_creations_template_category ON creations(template_category);
    CREATE INDEX IF NOT EXISTS idx_creation_links_source ON creation_links(source_id);
    CREATE INDEX IF NOT EXISTS idx_creation_links_target ON creation_links(target_id);
  `;

  try {
    await pool.query(createUsersTable);
    await pool.query(createCreationsTable);
    await pool.query(createCreationLinksTable);
    
    // Add version control columns to existing tables if they don't exist
    await addVersionControlColumns();
    
    await pool.query(createIndexes);
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

const addVersionControlColumns = async () => {
  try {
    // Check if version column exists
    const versionColumnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'creations' AND column_name = 'version'
    `);
    
    if (versionColumnCheck.rows.length === 0) {
      console.log('Adding version control columns to existing creations table...');
      
      await pool.query(`
        ALTER TABLE creations 
        ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
        ADD COLUMN IF NOT EXISTS parent_version_id INTEGER REFERENCES creations(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS is_current_version BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS template_category VARCHAR(100)
      `);
      
      // Update existing records to have version 1 and be current
      await pool.query(`
        UPDATE creations 
        SET version = 1, is_current_version = TRUE 
        WHERE version IS NULL OR is_current_version IS NULL
      `);
      
      console.log('Version control columns added successfully');
    }
  } catch (error) {
    console.log('Version control columns may already exist or error occurred:', error.message);
  }
};

module.exports = { pool, connectDB };