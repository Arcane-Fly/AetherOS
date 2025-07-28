const { pool } = require('./database');

class User {
  static async create(email, passwordHash, name) {
    const query = `
      INSERT INTO users (email, password_hash, name) 
      VALUES ($1, $2, $3) 
      RETURNING id, email, name, created_at
    `;
    const result = await pool.query(query, [email, passwordHash, name]);
    return result.rows[0];
  }

  static async createOAuth(userData) {
    const query = `
      INSERT INTO users (email, name, provider, provider_id, avatar, refresh_token) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, email, name, provider, provider_id, avatar, created_at
    `;
    const { email, name, provider, providerId, avatar, refreshToken } = userData;
    const result = await pool.query(query, [email, name, provider, providerId, avatar, refreshToken]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findByProvider(provider, providerId) {
    const query = 'SELECT * FROM users WHERE provider = $1 AND provider_id = $2';
    const result = await pool.query(query, [provider, providerId]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, name, provider, avatar, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateById(id, updates) {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id') {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);
    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}, updated_at = NOW() 
      WHERE id = $${paramCount} 
      RETURNING id, email, name, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateLastLogin(id) {
    const query = `
      UPDATE users 
      SET last_login = NOW() 
      WHERE id = $1 
      RETURNING id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async deleteById(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

// Export functions for passport configuration
const findUserByProvider = User.findByProvider;
const createOAuthUser = User.createOAuth;

module.exports = { 
  User, 
  findUserByProvider, 
  createOAuthUser 
};