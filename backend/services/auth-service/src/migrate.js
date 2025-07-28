const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://aetheros:aetheros123@localhost:5432/aetheros'
});

const migrations = [
  {
    name: '001_create_users_table',
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `
  },
  {
    name: '002_create_creations_table',
    sql: `
      CREATE TABLE IF NOT EXISTS creations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL,
        content JSONB,
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `
  },
  {
    name: '003_create_indexes',
    sql: `
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_creations_user_id ON creations(user_id);
      CREATE INDEX IF NOT EXISTS idx_creations_type ON creations(type);
      CREATE INDEX IF NOT EXISTS idx_creations_status ON creations(status);
    `
  },
  {
    name: '004_create_migrations_table',
    sql: `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      );
    `
  },
  {
    name: '005_add_oauth_fields_to_users',
    sql: `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'local',
      ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS avatar TEXT,
      ADD COLUMN IF NOT EXISTS refresh_token TEXT,
      ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
      
      -- Make password_hash nullable for OAuth users
      ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
      
      -- Add unique constraint for provider + provider_id combination
      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_provider_id 
      ON users(provider, provider_id) 
      WHERE provider != 'local';
      
      -- Add index for last_login for performance
      CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);
    `
  }
];

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Running database migrations...');
    
    // First, create migrations table if it doesn't exist
    await client.query(migrations[3].sql);
    
    for (const migration of migrations) {
      // Check if migration has already been run
      const result = await client.query(
        'SELECT * FROM migrations WHERE name = $1',
        [migration.name]
      );
      
      if (result.rows.length === 0) {
        console.log(`⏳ Running migration: ${migration.name}`);
        await client.query(migration.sql);
        await client.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [migration.name]
        );
        console.log(`✅ Completed migration: ${migration.name}`);
      } else {
        console.log(`⏭️  Skipping migration: ${migration.name} (already run)`);
      }
    }
    
    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Database migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigrations };