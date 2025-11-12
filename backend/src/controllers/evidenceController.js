const Evidence = require('../models/Evidence');
const path = require('path');
const pool = require('../config/database');

/**
 * Get all evidences
 */
exports.getAllEvidences = async (req, res) => {
  try {
    const {
      event_id,
      evidence_type,
      uploaded_by,
      tags,
      search,
      start_date,
      end_date,
      limit = 100,
      offset = 0
    } = req.query;

    const evidences = await Evidence.findAll({
      event_id,
      evidence_type,
      uploaded_by,
      tags: tags ? tags.split(',') : null,
      search,
      start_date,
      end_date,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: evidences,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: evidences.length
      }
    });
  } catch (error) {
    console.error('Get all evidences error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching evidences',
      error: error.message
    });
  }
};

/**
 * Get evidence by ID
 */
exports.getEvidenceById = async (req, res) => {
  try {
    const { id } = req.params;

    const evidence = await Evidence.findById(id);

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: 'Evidence not found'
      });
    }

    res.json({
      success: true,
      data: evidence
    });
  } catch (error) {
    console.error('Get evidence error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching evidence',
      error: error.message
    });
  }
};

/**
 * Create new evidence with file upload
 */
exports.createEvidence = async (req, res) => {
  try {
    const {
      event_id,
      title,
      description,
      evidence_type,
      location,
      latitude,
      longitude,
      tags
    } = req.body;

    // Create evidence record
    const evidence = await Evidence.create({
      event_id: event_id || null,
      title,
      description,
      evidence_type,
      location,
      latitude,
      longitude,
      uploaded_by: req.user.id,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',')) : [],
      metadata: {}
    });

    // Process uploaded files
    if (req.files && req.files.length > 0) {
      const filePromises = req.files.map(file => {
        return Evidence.addFile(evidence.id, {
          file_name: file.originalname,
          file_path: file.path,
          file_url: `/uploads/${path.relative('./uploads', file.path)}`,
          file_size: file.size,
          mime_type: file.mimetype
        });
      });

      await Promise.all(filePromises);
    }

    // Get complete evidence with files
    const completeEvidence = await Evidence.findById(evidence.id);

    res.status(201).json({
      success: true,
      message: 'Evidence created successfully',
      data: completeEvidence
    });
  } catch (error) {
    console.error('Create evidence error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating evidence',
      error: error.message
    });
  }
};

/**
 * Update evidence
 */
exports.updateEvidence = async (req, res) => {
  try {
    const { id } = req.params;

    // Parse tags if it's a string
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',');
    }

    // Update evidence metadata
    const evidence = await Evidence.update(id, req.body);

    if (!evidence) {
      return res.status(404).json({
        success: false,
        message: 'Evidence not found'
      });
    }

    // Process new uploaded files if any
    if (req.files && req.files.length > 0) {
      const filePromises = req.files.map(file => {
        return Evidence.addFile(evidence.id, {
          file_name: file.originalname,
          file_path: file.path,
          file_url: `/uploads/${path.relative('./uploads', file.path)}`,
          file_size: file.size,
          mime_type: file.mimetype
        });
      });

      await Promise.all(filePromises);
    }

    // Get complete evidence with files
    const completeEvidence = await Evidence.findById(evidence.id);

    res.json({
      success: true,
      message: 'Evidence updated successfully',
      data: completeEvidence
    });
  } catch (error) {
    console.error('Update evidence error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating evidence',
      error: error.message
    });
  }
};

/**
 * Delete evidence
 */
exports.deleteEvidence = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Evidence.delete(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Evidence not found'
      });
    }

    res.json({
      success: true,
      message: 'Evidence deleted successfully'
    });
  } catch (error) {
    console.error('Delete evidence error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting evidence',
      error: error.message
    });
  }
};

/**
 * Get evidences statistics
 */
exports.getStats = async (req, res) => {
  try {
    const stats = await Evidence.getStats();

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
 * Delete evidence file
 */
exports.deleteFile = async (req, res) => {
  try {
    const { evidenceId, fileId } = req.params;
    const fs = require('fs').promises;

    // Get file info from database
    const fileQuery = `
      SELECT * FROM evidence_files
      WHERE id = $1 AND evidence_id = $2
    `;
    const fileResult = await pool.query(fileQuery, [fileId, evidenceId]);

    if (fileResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const file = fileResult.rows[0];

    // Determine file path
    let filePath;
    const uploadsDir = process.env.UPLOAD_PATH || path.join(__dirname, '../../uploads');
    
    if (file.file_path) {
      if (path.isAbsolute(file.file_path)) {
        filePath = file.file_path;
      } else {
        // Try multiple possible locations
        const tryPath1 = path.join(uploadsDir, file.file_path);
        const tryPath2 = path.join(__dirname, '../../', file.file_path);
        
        try {
          await fs.access(tryPath1);
          filePath = tryPath1;
        } catch {
          filePath = tryPath2;
        }
      }
    } else if (file.file_url) {
      const urlPath = file.file_url.replace(/^\/uploads\//, '').replace(/^\//, '');
      filePath = path.join(uploadsDir, urlPath);
    }
    
    filePath = path.resolve(filePath);

    // Delete file from filesystem if it exists
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        // File might not exist, continue with database deletion
        console.warn('File not found on filesystem, continuing with database deletion:', filePath);
      }
    }

    // Delete file record from database
    const deleteQuery = `
      DELETE FROM evidence_files
      WHERE id = $1 AND evidence_id = $2
      RETURNING id
    `;
    const deleteResult = await pool.query(deleteQuery, [fileId, evidenceId]);

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'File not found in database'
      });
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message
    });
  }
};

/**
 * Download evidence file
 */
exports.downloadFile = async (req, res) => {
  try {
    const { evidenceId, fileId } = req.params;
    const fs = require('fs').promises;

    // Get file info from database
    const fileQuery = `
      SELECT * FROM evidence_files
      WHERE id = $1 AND evidence_id = $2
    `;
    const fileResult = await pool.query(fileQuery, [parseInt(fileId), parseInt(evidenceId)]);

    if (fileResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const file = fileResult.rows[0];
    
    // Determine file path
    let filePath;
    const projectRoot = path.join(__dirname, '../..');
    const uploadsDir = process.env.UPLOAD_PATH || path.join(projectRoot, 'uploads');
    
    console.log('Download request - File data:', {
      file_path: file.file_path,
      file_url: file.file_url,
      file_name: file.file_name,
      projectRoot,
      uploadsDir
    });
    
    if (file.file_path) {
      // If file_path is absolute, use it directly
      if (path.isAbsolute(file.file_path)) {
        filePath = file.file_path;
      } else {
        // file.path from multer is relative to project root (e.g., "uploads/images/file.jpg")
        // Try different possible locations
        const possiblePaths = [
          path.join(projectRoot, file.file_path), // Most common: relative to project root
          path.join(uploadsDir, path.basename(file.file_path)), // Just filename in uploads
          file.file_path // Direct path if it's already correct
        ];
        
        console.log('Trying paths:', possiblePaths);
        
        // Find the first path that exists
        let found = false;
        for (const tryPath of possiblePaths) {
          try {
            const resolvedPath = path.resolve(tryPath);
            await fs.access(resolvedPath);
            filePath = resolvedPath;
            found = true;
            console.log('Found file at:', filePath);
            break;
          } catch (err) {
            console.log('Path not found:', tryPath, err.message);
            continue;
          }
        }
        
        if (!found) {
          // Default to project root + file_path
          filePath = path.resolve(path.join(projectRoot, file.file_path));
          console.log('Using default path:', filePath);
        }
      }
    } else if (file.file_url) {
      // Convert URL path to file system path
      // file_url format: /uploads/images/file.jpg
      const urlPath = file.file_url.replace(/^\/uploads\//, '').replace(/^\//, '');
      filePath = path.resolve(path.join(uploadsDir, urlPath));
      console.log('Using file_url, resolved path:', filePath);
    } else {
      console.error('No file_path or file_url found');
      return res.status(404).json({
        success: false,
        message: 'File path not found in database'
      });
    }

    // Check if file exists
    try {
      await fs.access(filePath);
      console.log('File exists at:', filePath);
    } catch (error) {
      console.error('File access error:', error.message);
      console.error('Looking for file at:', filePath);
      console.error('File data:', { 
        file_path: file.file_path, 
        file_url: file.file_url,
        uploadsDir: uploadsDir,
        projectRoot: projectRoot,
        __dirname: __dirname
      });
      
      // Try to list files in uploads directory for debugging
      try {
        const uploadsContents = await fs.readdir(uploadsDir, { recursive: true });
        console.log('Uploads directory contents:', uploadsContents);
      } catch (listError) {
        console.error('Could not list uploads directory:', listError.message);
      }
      
      return res.status(404).json({
        success: false,
        message: 'File not found on server',
        debug: { 
          filePath, 
          file_path: file.file_path, 
          file_url: file.file_url,
          uploadsDir: uploadsDir,
          projectRoot: projectRoot
        }
      });
    }

    // Get filename from database or file path
    const filename = file.original_filename || file.file_name || path.basename(filePath);

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Content-Type', file.mime_type || 'application/octet-stream');

    // Send file
    console.log('Sending file:', filePath);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Error sending file',
            error: err.message
          });
        }
      }
    });
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading file',
      error: error.message
    });
  }
};

/**
 * Get recent evidences
 */
exports.getRecent = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const evidences = await Evidence.getRecent(parseInt(limit));

    res.json({
      success: true,
      data: evidences
    });
  } catch (error) {
    console.error('Get recent evidences error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent evidences',
      error: error.message
    });
  }
};

/**
 * Search evidences by tags
 */
exports.searchByTags = async (req, res) => {
  try {
    const { tags } = req.query;

    if (!tags) {
      return res.status(400).json({
        success: false,
        message: 'Tags parameter is required'
      });
    }

    const tagsArray = tags.split(',');
    const evidences = await Evidence.searchByTags(tagsArray);

    res.json({
      success: true,
      data: evidences
    });
  } catch (error) {
    console.error('Search by tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching evidences',
      error: error.message
    });
  }
};
