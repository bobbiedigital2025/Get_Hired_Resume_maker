const exportService = require('../services/export');
const Resume = require('../models/resume');
const User = require('../models/user');
const { Packer } = require('docx');

const exportController = {
  // Export resume in various formats
  async exportResume(req, res) {
    try {
      const { id } = req.params;
      const { format, style } = req.query;

      const resume = await Resume.findOne({
        _id: id,
        userId: req.user.userId
      });

      if (!resume) {
        return res.status(404).json({ error: 'Resume not found' });
      }

      // Get user data for name and contact info
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      let result;
      let contentType;
      let fileName;

      switch (format.toLowerCase()) {
        case 'pdf':
          result = await exportService.generatePDF(resume, user, style);
          contentType = 'application/pdf';
          fileName = `resume-${style}.pdf`;
          break;

        case 'docx':
          result = await exportService.generateDOCX(resume, user, style);
          contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          fileName = `resume-${style}.docx`;
          break;

        case 'txt':
          result = exportService.generatePlainText(resume, user);
          contentType = 'text/plain';
          fileName = 'resume.txt';
          break;

        case 'ats':
          result = exportService.generateATSVersion(resume, user);
          contentType = 'text/plain';
          fileName = 'resume-ats.txt';
          break;

        default:
          return res.status(400).json({ error: 'Unsupported format' });
      }

      // Set response headers
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      // Send the file
      if (format === 'pdf') {
        result.pipe(res);
      } else if (format === 'docx') {
        const buffer = await Packer.toBuffer(result);
        res.send(buffer);
      } else {
        res.send(result);
      }
    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({ error: 'Failed to export resume' });
    }
  },

  // Get available export formats and styles
  async getExportOptions(req, res) {
    const options = {
      formats: [
        {
          id: 'pdf',
          name: 'PDF Document',
          description: 'High-quality PDF suitable for printing and sharing'
        },
        {
          id: 'docx',
          name: 'Word Document',
          description: 'Editable Microsoft Word document'
        },
        {
          id: 'txt',
          name: 'Plain Text',
          description: 'Simple text format, great for copy-pasting'
        },
        {
          id: 'ats',
          name: 'ATS Optimized',
          description: 'Plain text format optimized for Applicant Tracking Systems'
        },
        {
          id: 'linkedin',
          name: 'LinkedIn Format',
          description: 'Ready to import into LinkedIn profile'
        },
        {
          id: 'indeed',
          name: 'Indeed Format',
          description: 'Compatible with Indeed resume upload'
        },
        {
          id: 'jsonld',
          name: 'Structured Data',
          description: 'Schema.org compatible JSON-LD format'
        },
        {
          id: 'latex',
          name: 'LaTeX Document',
          description: 'Professional typesetting format popular in academia'
        }
      ],
      styles: [
        {
          id: 'professional',
          name: 'Professional',
          description: 'Traditional resume style suitable for most industries'
        },
        {
          id: 'modern',
          name: 'Modern',
          description: 'Clean, contemporary design with subtle styling'
        },
        {
          id: 'creative',
          name: 'Creative',
          description: 'Bold design for creative industries'
        },
        {
          id: 'minimal',
          name: 'Minimal',
          description: 'Simple, straightforward layout focusing on content'
        },
        {
          id: 'executive',
          name: 'Executive',
          description: 'Sophisticated style for senior positions'
        },
        {
          id: 'technical',
          name: 'Technical',
          description: 'Optimized for IT and engineering roles'
        },
        {
          id: 'academic',
          name: 'Academic',
          description: 'Formal style for education and research positions'
        },
        {
          id: 'federal',
          name: 'Federal',
          description: 'Compliant with government position requirements'
        }
      ]
    };

    res.json(options);
  }
};

module.exports = exportController;
