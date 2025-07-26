const Resume = require('../models/resume');

const resumeController = {
  // Create new resume
  async create(req, res) {
    try {
      const { targetJobTitle, targetCompany, jobDescription } = req.body;
      
      const resume = new Resume({
        userId: req.user.userId,
        targetJobTitle,
        targetCompany,
        jobDescription,
        sections: {
          summary: 'To be generated...',
          experience: [],
          education: [],
          skills: [],
          certifications: []
        }
      });

      await resume.save();
      res.status(201).json({ message: 'Resume created successfully', resume });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create resume' });
    }
  },

  // Get all resumes for current user
  async getAllForUser(req, res) {
    try {
      const resumes = await Resume.find({ userId: req.user.userId })
        .sort({ updatedAt: -1 });
      res.json({ resumes });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch resumes' });
    }
  },

  // Get single resume by ID
  async getById(req, res) {
    try {
      const resume = await Resume.findOne({
        _id: req.params.id,
        userId: req.user.userId
      });

      if (!resume) {
        return res.status(404).json({ error: 'Resume not found' });
      }

      res.json({ resume });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch resume' });
    }
  },

  // Update resume
  async update(req, res) {
    try {
      const resume = await Resume.findOne({
        _id: req.params.id,
        userId: req.user.userId
      });

      if (!resume) {
        return res.status(404).json({ error: 'Resume not found' });
      }

      // Increment version on content changes
      if (req.body.sections || req.body.targetJobTitle || req.body.jobDescription) {
        resume.version += 1;
      }

      // Update allowed fields
      const allowedUpdates = [
        'targetJobTitle',
        'targetCompany',
        'jobDescription',
        'sections',
        'format',
        'status'
      ];

      allowedUpdates.forEach(update => {
        if (req.body[update] !== undefined) {
          resume[update] = req.body[update];
        }
      });

      await resume.save();
      res.json({ message: 'Resume updated successfully', resume });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update resume' });
    }
  },

  // Delete resume
  async delete(req, res) {
    try {
      const resume = await Resume.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.userId
      });

      if (!resume) {
        return res.status(404).json({ error: 'Resume not found' });
      }

      res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete resume' });
    }
  },

  // Archive resume
  async archive(req, res) {
    try {
      const resume = await Resume.findOne({
        _id: req.params.id,
        userId: req.user.userId
      });

      if (!resume) {
        return res.status(404).json({ error: 'Resume not found' });
      }

      resume.status = 'archived';
      await resume.save();

      res.json({ message: 'Resume archived successfully', resume });
    } catch (error) {
      res.status(500).json({ error: 'Failed to archive resume' });
    }
  }
};

module.exports = resumeController;
