const aiService = require('../services/ai');
const Resume = require('../models/resume');

const jobController = {
  // Analyze job description
  async analyzeJob(req, res) {
    try {
      const { jobDescription, resumeId } = req.body;

      // Parse job description using AI
      const analysis = await aiService.parseJobDescription(jobDescription);

      // If resumeId is provided, update the resume with parsed data
      if (resumeId) {
        const resume = await Resume.findOne({
          _id: resumeId,
          userId: req.user.userId
        });

        if (resume) {
          resume.jobDescription = jobDescription;
          resume.parsedKeywords = analysis.skills;
          resume.parsedRequirements = [
            ...analysis.required_qualifications,
            ...analysis.preferred_qualifications
          ];
          await resume.save();
        }
      }

      // Generate STAR questions based on requirements
      const questions = await aiService.generateQuestions(analysis);

      res.json({
        analysis,
        questions,
        message: 'Job description analyzed successfully'
      });
    } catch (error) {
      console.error('Job analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze job description' });
    }
  },

  // Generate optimized content
  async generateContent(req, res) {
    try {
      const { resumeId, section } = req.body;

      const resume = await Resume.findOne({
        _id: resumeId,
        userId: req.user.userId
      });

      if (!resume) {
        return res.status(404).json({ error: 'Resume not found' });
      }

      // Get job requirements from parsed data
      const jobRequirements = {
        keywords: resume.parsedKeywords,
        requirements: resume.parsedRequirements
      };

      // Get relevant experience from user's profile
      const experience = resume.sections[section];

      // Generate optimized content
      const optimizedContent = await aiService.optimizeContent(
        experience,
        jobRequirements
      );

      // Update resume with optimized content
      resume.sections[section] = optimizedContent;
      await resume.save();

      res.json({
        message: 'Content optimized successfully',
        optimizedContent
      });
    } catch (error) {
      console.error('Content generation error:', error);
      res.status(500).json({ error: 'Failed to generate optimized content' });
    }
  }
};

module.exports = jobController;
