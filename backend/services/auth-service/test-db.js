const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://aetheros:aetheros123@localhost:5432/aetheros',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Database connection successful');
    
    const result = await client.query('SELECT NOW()');
    console.log('Current time:', result.rows[0].now);
    
    client.release();
    await pool.end();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();
