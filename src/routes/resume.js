const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const resumeController = require('../controllers/resume');

// All resume routes require authentication
router.use(authMiddleware);

// Create new resume
router.post('/', resumeController.create);

// Get all resumes for current user
router.get('/', resumeController.getAllForUser);

// Get single resume by ID
router.get('/:id', resumeController.getById);

// Update resume
router.put('/:id', resumeController.update);

// Delete resume
router.delete('/:id', resumeController.delete);

// Archive resume
router.post('/:id/archive', resumeController.archive);

module.exports = router;
