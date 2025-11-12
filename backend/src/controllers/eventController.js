const Event = require('../models/Event');

/**
 * Get all events
 */
exports.getAllEvents = async (req, res) => {
  try {
    const {
      status,
      type,
      start_date,
      end_date,
      instructor_id,
      search,
      limit = 100,
      offset = 0
    } = req.query;

    const events = await Event.findAll({
      status,
      type,
      start_date,
      end_date,
      instructor_id,
      search,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: events,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: events.length
      }
    });
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

/**
 * Get event by ID
 */
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

/**
 * Create new event
 */
exports.createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      created_by: req.user.id
    };

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

/**
 * Update event
 */
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.update(id, req.body);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

/**
 * Delete event
 */
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Event.delete(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

/**
 * Get events statistics
 */
exports.getStats = async (req, res) => {
  try {
    const stats = await Event.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

/**
 * Get upcoming events
 */
exports.getUpcoming = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const events = await Event.getUpcoming(parseInt(limit));

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming events',
      error: error.message
    });
  }
};

/**
 * Add participant to event
 */
exports.addParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    const participant = await Event.addParticipant(id, user_id || req.user.id);

    res.status(201).json({
      success: true,
      message: 'Participant added successfully',
      data: participant
    });
  } catch (error) {
    console.error('Add participant error:', error);

    if (error.code === '23505') { // Unique violation
      return res.status(400).json({
        success: false,
        message: 'User is already registered for this event'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error adding participant',
      error: error.message
    });
  }
};

/**
 * Get event participants
 */
exports.getParticipants = async (req, res) => {
  try {
    const { id } = req.params;

    const participants = await Event.getParticipants(id);

    res.json({
      success: true,
      data: participants
    });
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching participants',
      error: error.message
    });
  }
};
