const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const evidenceController = require('../controllers/evidenceController');
const { verifyToken, requireRole } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');
const { upload, handleMulterError } = require('../middlewares/upload');

// Validation rules
const createEvidenceValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('evidence_type').isIn(['foto', 'video', 'documento', 'audio'])
    .withMessage('Invalid evidence type'),
  body('event_id').optional().isInt().withMessage('Invalid event ID'),
  body('location').optional().trim(),
  body('latitude').optional().isDecimal().withMessage('Invalid latitude'),
  body('longitude').optional().isDecimal().withMessage('Invalid longitude'),
  body('tags').optional()
];

const updateEvidenceValidation = [
  param('id').isInt().withMessage('Invalid evidence ID'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim(),
  body('evidence_type').optional().isIn(['foto', 'video', 'documento', 'audio'])
    .withMessage('Invalid evidence type'),
  body('location').optional().trim(),
  body('latitude').optional().isDecimal().withMessage('Invalid latitude'),
  body('longitude').optional().isDecimal().withMessage('Invalid longitude'),
  body('tags').optional()
];

const idValidation = [
  param('id').isInt().withMessage('Invalid evidence ID')
];

// Routes
router.get('/', verifyToken, evidenceController.getAllEvidences);
router.get('/stats', verifyToken, evidenceController.getStats);
router.get('/recent', verifyToken, evidenceController.getRecent);
router.get('/search/tags', verifyToken, evidenceController.searchByTags);
router.get('/:id', verifyToken, idValidation, validate, evidenceController.getEvidenceById);

// Create with file upload (multiple files)
router.post('/',
  verifyToken,
  requireRole('admin', 'supervisor', 'instructor'),
  upload.array('files', 10),
  handleMulterError,
  createEvidenceValidation,
  validate,
  evidenceController.createEvidence
);

router.put('/:id',
  verifyToken,
  requireRole('admin', 'supervisor', 'instructor'),
  upload.array('files', 10),
  handleMulterError,
  updateEvidenceValidation,
  validate,
  evidenceController.updateEvidence
);

router.delete('/:id',
  verifyToken,
  requireRole('admin', 'supervisor'),
  idValidation,
  validate,
  evidenceController.deleteEvidence
);

// Download file endpoint (accepts token in query or header)
router.get('/:evidenceId/files/:fileId/download',
  (req, res, next) => {
    // Allow token in query string for download links
    if (req.query.token) {
      req.headers.authorization = `Bearer ${req.query.token}`;
    }
    verifyToken(req, res, next);
  },
  evidenceController.downloadFile
);

// Delete file endpoint
router.delete('/:evidenceId/files/:fileId',
  verifyToken,
  requireRole('admin', 'supervisor', 'instructor'),
  evidenceController.deleteFile
);

module.exports = router;
