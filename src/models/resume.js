const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetJobTitle: {
    type: String,
    required: true,
    trim: true
  },
  targetCompany: {
    type: String,
    trim: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  parsedKeywords: [{
    type: String,
    trim: true
  }],
  parsedSkills: [{
    type: String,
    trim: true
  }],
  parsedRequirements: [{
    type: String,
    trim: true
  }],
  sections: {
    summary: {
      type: String,
      required: true
    },
    experience: [{
      company: String,
      title: String,
      location: String,
      startDate: Date,
      endDate: Date,
      current: Boolean,
      highlights: [String],
      keywords: [String]
    }],
    education: [{
      institution: String,
      degree: String,
      fieldOfStudy: String,
      graduationYear: Number,
      achievements: [String]
    }],
    skills: [{
      category: String,
      items: [String]
    }],
    certifications: [{
      name: String,
      issuer: String,
      issueDate: Date,
      expiryDate: Date
    }]
  },
  atsScore: {
    type: Number,
    min: 0,
    max: 100
  },
  format: {
    template: {
      type: String,
      default: 'professional'
    },
    fontSize: {
      type: Number,
      default: 11
    },
    fontFamily: {
      type: String,
      default: 'Arial'
    },
    spacing: {
      type: Number,
      default: 1.15
    }
  },
  status: {
    type: String,
    enum: ['draft', 'complete', 'archived'],
    default: 'draft'
  },
  version: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
resumeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
