const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const jobController = require('../controllers/job');

// All routes require authentication
router.use(authMiddleware);

// Analyze job description
router.post('/analyze', jobController.analyzeJob);

// Generate optimized content
router.post('/optimize', jobController.generateContent);

module.exports = router;
