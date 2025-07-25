const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://aetheros:aetheros123@localhost:5432/aetheros',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL database');
    
    // Create tables if they don't exist
    await createTables();
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
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
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
    CREATE INDEX IF NOT EXISTS idx_creation_links_source ON creation_links(source_id);
    CREATE INDEX IF NOT EXISTS idx_creation_links_target ON creation_links(target_id);
  `;

  try {
    await pool.query(createUsersTable);
    await pool.query(createCreationsTable);
    await pool.query(createCreationLinksTable);
    await pool.query(createIndexes);
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

module.exports = { pool, connectDB };