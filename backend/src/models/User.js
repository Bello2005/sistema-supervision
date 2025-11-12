const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  /**
   * Create a new user
   */
  static async create({ email, password, full_name, role = 'viewer', avatar_url = null }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (email, password, full_name, role, avatar_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, full_name, role, avatar_url, is_active, created_at
    `;

    const values = [email, hashedPassword, full_name, role, avatar_url];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    const query = `
      SELECT id, email, full_name, role, avatar_url, is_active, created_at, updated_at
      FROM users
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get all users
   */
  static async findAll({ role = null, is_active = null, limit = 100, offset = 0 } = {}) {
    let query = `
      SELECT id, email, full_name, role, avatar_url, is_active, created_at
      FROM users
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (role) {
      query += ` AND role = $${paramCount}`;
      values.push(role);
      paramCount++;
    }

    if (is_active !== null) {
      query += ` AND is_active = $${paramCount}`;
      values.push(is_active);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Update user
   */
  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic update query
    Object.keys(data).forEach(key => {
      if (key !== 'id' && key !== 'password') {
        fields.push(`${key} = $${paramCount}`);
        values.push(data[key]);
        paramCount++;
      }
    });

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      fields.push(`password = $${paramCount}`);
      values.push(hashedPassword);
      paramCount++;
    }

    values.push(id);

    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, full_name, role, avatar_url, is_active, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete user (soft delete by setting is_active = false)
   */
  static async delete(id) {
    const query = 'UPDATE users SET is_active = false WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Count users
   */
  static async count({ role = null, is_active = null } = {}) {
    let query = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (role) {
      query += ` AND role = $${paramCount}`;
      values.push(role);
      paramCount++;
    }

    if (is_active !== null) {
      query += ` AND is_active = $${paramCount}`;
      values.push(is_active);
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].total);
  }
}

module.exports = User;
