const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const eventController = require('../controllers/eventController');
const { verifyToken, requireRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');

// Validation rules
const createEventValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('type').isIn(['capacitacion', 'workshop', 'seminario', 'taller', 'conferencia', 'webinar'])
    .withMessage('Invalid event type'),
  body('status').optional().isIn(['programado', 'en_curso', 'completado', 'cancelado'])
    .withMessage('Invalid status'),
  body('start_date').isISO8601().withMessage('Valid start date is required'),
  body('end_date').optional().isISO8601().withMessage('Invalid end date'),
  body('start_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Invalid start time format (HH:MM:SS)'),
  body('end_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Invalid end time format (HH:MM:SS)'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('instructor_id').optional().isInt().withMessage('Invalid instructor ID'),
  body('max_participants').optional().isInt({ min: 1 }).withMessage('Max participants must be at least 1'),
  body('color').optional().isString(),
  body('is_online').optional().isBoolean(),
  body('meeting_url').optional().isURL().withMessage('Invalid URL format')
];

const updateEventValidation = [
  param('id').isInt().withMessage('Invalid event ID'),
  ...createEventValidation.map(rule => {
    // Make all fields optional for updates
    const newRule = rule.optional();
    return newRule;
  })
];

const idValidation = [
  param('id').isInt().withMessage('Invalid event ID')
];

const participantValidation = [
  param('id').isInt().withMessage('Invalid event ID'),
  body('user_id').optional().isInt().withMessage('Invalid user ID')
];

// Routes
router.get('/', verifyToken, eventController.getAllEvents);
router.get('/stats', verifyToken, eventController.getStats);
router.get('/upcoming', verifyToken, eventController.getUpcoming);
router.get('/:id', verifyToken, idValidation, validate, eventController.getEventById);
router.post('/', verifyToken, requireRole('admin', 'supervisor', 'instructor'),
  createEventValidation, validate, eventController.createEvent);
router.put('/:id', verifyToken, requireRole('admin', 'supervisor', 'instructor'),
  updateEventValidation, validate, eventController.updateEvent);
router.delete('/:id', verifyToken, requireRole('admin', 'supervisor'),
  idValidation, validate, eventController.deleteEvent);

// Participants
router.post('/:id/participants', verifyToken, participantValidation, validate, eventController.addParticipant);
router.get('/:id/participants', verifyToken, idValidation, validate, eventController.getParticipants);

module.exports = router;
