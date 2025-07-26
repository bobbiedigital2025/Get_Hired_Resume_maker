const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const exportController = require('../controllers/export');

// All routes require authentication
router.use(authMiddleware);

// Get available export formats and styles
router.get('/options', exportController.getExportOptions);

// Export resume in specified format
router.get('/:id', exportController.exportResume);

module.exports = router;
