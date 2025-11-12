const pool = require('../config/database');

class Evidence {
  /**
   * Create a new evidence
   */
  static async create(data) {
    const query = `
      INSERT INTO evidences (
        event_id, title, description, evidence_type, location,
        latitude, longitude, uploaded_by, tags, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      data.event_id || null,
      data.title,
      data.description || null,
      data.evidence_type,
      data.location || null,
      data.latitude || null,
      data.longitude || null,
      data.uploaded_by,
      data.tags || [],
      JSON.stringify(data.metadata || {})
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Add file to evidence
   */
  static async addFile(evidence_id, fileData) {
    const query = `
      INSERT INTO evidence_files (
        evidence_id, file_name, file_path, file_url, file_size,
        mime_type, thumbnail_url, duration, width, height
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      evidence_id,
      fileData.file_name,
      fileData.file_path,
      fileData.file_url || null,
      fileData.file_size || null,
      fileData.mime_type || null,
      fileData.thumbnail_url || null,
      fileData.duration || null,
      fileData.width || null,
      fileData.height || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find evidence by ID with files
   */
  static async findById(id) {
    // Get evidence details
    const evidenceQuery = `
      SELECT
        e.*,
        u.full_name as uploaded_by_name,
        ev.title as event_title
      FROM evidences e
      LEFT JOIN users u ON e.uploaded_by = u.id
      LEFT JOIN events ev ON e.event_id = ev.id
      WHERE e.id = $1
    `;
    const evidenceResult = await pool.query(evidenceQuery, [id]);

    if (evidenceResult.rows.length === 0) {
      return null;
    }

    const evidence = evidenceResult.rows[0];

    // Get files
    const filesQuery = `
      SELECT * FROM evidence_files
      WHERE evidence_id = $1
      ORDER BY created_at ASC
    `;
    const filesResult = await pool.query(filesQuery, [id]);

    evidence.files = filesResult.rows;
    return evidence;
  }

  /**
   * Get all evidences with filters
   */
  static async findAll({
    event_id = null,
    evidence_type = null,
    uploaded_by = null,
    tags = null,
    search = null,
    start_date = null,
    end_date = null,
    limit = 100,
    offset = 0
  } = {}) {
    let query = `
      SELECT
        e.*,
        u.full_name as uploaded_by_name,
        ev.title as event_title,
        COUNT(ef.id) as file_count,
        COALESCE(SUM(ef.file_size), 0) as total_size
      FROM evidences e
      LEFT JOIN users u ON e.uploaded_by = u.id
      LEFT JOIN events ev ON e.event_id = ev.id
      LEFT JOIN evidence_files ef ON e.id = ef.evidence_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (event_id) {
      query += ` AND e.event_id = $${paramCount}`;
      values.push(event_id);
      paramCount++;
    }

    if (evidence_type) {
      query += ` AND e.evidence_type = $${paramCount}`;
      values.push(evidence_type);
      paramCount++;
    }

    if (uploaded_by) {
      query += ` AND e.uploaded_by = $${paramCount}`;
      values.push(uploaded_by);
      paramCount++;
    }

    if (tags && tags.length > 0) {
      query += ` AND e.tags && $${paramCount}`;
      values.push(tags);
      paramCount++;
    }

    if (search) {
      query += ` AND (e.title ILIKE $${paramCount} OR e.description ILIKE $${paramCount})`;
      values.push(`%${search}%`);
      paramCount++;
    }

    if (start_date) {
      query += ` AND e.captured_at >= $${paramCount}`;
      values.push(start_date);
      paramCount++;
    }

    if (end_date) {
      query += ` AND e.captured_at <= $${paramCount}`;
      values.push(end_date);
      paramCount++;
    }

    query += ` GROUP BY e.id, u.full_name, ev.title`;
    query += ` ORDER BY e.captured_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Update evidence
   */
  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = [
      'title', 'description', 'evidence_type', 'location',
      'latitude', 'longitude', 'tags', 'metadata'
    ];

    Object.keys(data).forEach(key => {
      if (allowedFields.includes(key)) {
        if (key === 'metadata') {
          fields.push(`${key} = $${paramCount}`);
          values.push(JSON.stringify(data[key]));
        } else {
          fields.push(`${key} = $${paramCount}`);
          values.push(data[key]);
        }
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);

    const query = `
      UPDATE evidences
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete evidence
   */
  static async delete(id) {
    const query = 'DELETE FROM evidences WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get evidences statistics
   */
  static async getStats() {
    const query = `
      SELECT
        COUNT(*) as total_evidences,
        COUNT(*) FILTER (WHERE evidence_type = 'foto') as fotos,
        COUNT(*) FILTER (WHERE evidence_type = 'video') as videos,
        COUNT(*) FILTER (WHERE evidence_type = 'documento') as documentos,
        COUNT(*) FILTER (WHERE evidence_type = 'audio') as audios,
        COUNT(DISTINCT event_id) as events_with_evidence,
        (SELECT COUNT(*) FROM evidence_files) as total_files,
        (SELECT COALESCE(SUM(file_size), 0) FROM evidence_files) as total_storage
      FROM evidences
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }

  /**
   * Get recent evidences
   */
  static async getRecent(limit = 10) {
    const query = `
      SELECT
        e.*,
        u.full_name as uploaded_by_name,
        ev.title as event_title
      FROM evidences e
      LEFT JOIN users u ON e.uploaded_by = u.id
      LEFT JOIN events ev ON e.event_id = ev.id
      ORDER BY e.created_at DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  /**
   * Search evidences by tags
   */
  static async searchByTags(tags) {
    const query = `
      SELECT
        e.*,
        u.full_name as uploaded_by_name,
        ev.title as event_title,
        COUNT(ef.id) as file_count
      FROM evidences e
      LEFT JOIN users u ON e.uploaded_by = u.id
      LEFT JOIN events ev ON e.event_id = ev.id
      LEFT JOIN evidence_files ef ON e.id = ef.evidence_id
      WHERE e.tags && $1
      GROUP BY e.id, u.full_name, ev.title
      ORDER BY e.created_at DESC
    `;
    const result = await pool.query(query, [tags]);
    return result.rows;
  }
}

module.exports = Evidence;
