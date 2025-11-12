const pool = require('../config/database');

class Event {
  /**
   * Create a new event
   */
  static async create(data) {
    const query = `
      INSERT INTO events (
        title, description, type, status, start_date, end_date,
        start_time, end_time, location, instructor_id, max_participants,
        color, is_online, meeting_url, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const values = [
      data.title,
      data.description || null,
      data.type,
      data.status || 'programado',
      data.start_date,
      data.end_date || data.start_date,
      data.start_time,
      data.end_time,
      data.location,
      data.instructor_id || null,
      data.max_participants || 50,
      data.color || 'blue',
      data.is_online || false,
      data.meeting_url || null,
      data.created_by
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find event by ID with instructor details
   */
  static async findById(id) {
    const query = `
      SELECT
        e.*,
        u.full_name as instructor_name,
        u.email as instructor_email,
        u.avatar_url as instructor_avatar,
        (SELECT COUNT(*) FROM event_participants WHERE event_id = e.id) as current_participants
      FROM events e
      LEFT JOIN users u ON e.instructor_id = u.id
      WHERE e.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get all events with filters
   */
  static async findAll({
    status = null,
    type = null,
    start_date = null,
    end_date = null,
    instructor_id = null,
    search = null,
    limit = 100,
    offset = 0
  } = {}) {
    let query = `
      SELECT
        e.*,
        u.full_name as instructor_name,
        u.email as instructor_email,
        u.avatar_url as instructor_avatar,
        (SELECT COUNT(*) FROM event_participants WHERE event_id = e.id) as current_participants
      FROM events e
      LEFT JOIN users u ON e.instructor_id = u.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (status) {
      query += ` AND e.status = $${paramCount}`;
      values.push(status);
      paramCount++;
    }

    if (type) {
      query += ` AND e.type = $${paramCount}`;
      values.push(type);
      paramCount++;
    }

    if (start_date) {
      query += ` AND e.start_date >= $${paramCount}`;
      values.push(start_date);
      paramCount++;
    }

    if (end_date) {
      query += ` AND e.start_date <= $${paramCount}`;
      values.push(end_date);
      paramCount++;
    }

    if (instructor_id) {
      query += ` AND e.instructor_id = $${paramCount}`;
      values.push(instructor_id);
      paramCount++;
    }

    if (search) {
      query += ` AND (e.title ILIKE $${paramCount} OR e.description ILIKE $${paramCount})`;
      values.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY e.start_date DESC, e.start_time DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Update event
   */
  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic update query
    const allowedFields = [
      'title', 'description', 'type', 'status', 'start_date', 'end_date',
      'start_time', 'end_time', 'location', 'instructor_id', 'max_participants',
      'color', 'is_online', 'meeting_url'
    ];

    Object.keys(data).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${paramCount}`);
        values.push(data[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);

    const query = `
      UPDATE events
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete event
   */
  static async delete(id) {
    const query = 'DELETE FROM events WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get events statistics
   */
  static async getStats() {
    const query = `
      SELECT
        COUNT(*) as total_events,
        COUNT(*) FILTER (WHERE status = 'programado') as programado,
        COUNT(*) FILTER (WHERE status = 'en_curso') as en_curso,
        COUNT(*) FILTER (WHERE status = 'completado') as completado,
        COUNT(*) FILTER (WHERE status = 'cancelado') as cancelado,
        (SELECT COUNT(*) FROM event_participants) as total_participants,
        SUM(max_participants) as total_capacity
      FROM events
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }

  /**
   * Get upcoming events
   */
  static async getUpcoming(limit = 10) {
    const query = `
      SELECT
        e.*,
        u.full_name as instructor_name,
        (SELECT COUNT(*) FROM event_participants WHERE event_id = e.id) as current_participants
      FROM events e
      LEFT JOIN users u ON e.instructor_id = u.id
      WHERE e.start_date >= CURRENT_DATE
        AND e.status = 'programado'
      ORDER BY e.start_date ASC, e.start_time ASC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  /**
   * Add participant to event
   */
  static async addParticipant(event_id, user_id) {
    const query = `
      INSERT INTO event_participants (event_id, user_id, attendance_status)
      VALUES ($1, $2, 'registered')
      RETURNING *
    `;
    const result = await pool.query(query, [event_id, user_id]);
    return result.rows[0];
  }

  /**
   * Get event participants
   */
  static async getParticipants(event_id) {
    const query = `
      SELECT
        ep.*,
        u.full_name,
        u.email,
        u.avatar_url
      FROM event_participants ep
      JOIN users u ON ep.user_id = u.id
      WHERE ep.event_id = $1
      ORDER BY ep.created_at DESC
    `;
    const result = await pool.query(query, [event_id]);
    return result.rows;
  }
}

module.exports = Event;
