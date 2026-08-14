const mongoose = require('mongoose');

const SectionScoreSchema = new mongoose.Schema({
  score: { type: Number, default: 0 },
  feedback: { type: String, default: '' },
  status: { type: String, enum: ['good', 'warning', 'needs-improvement'], default: 'good' }
}, { _id: false });

const ResumeAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fileName: {
    type: String,
    default: 'Resume.pdf'
  },
  resumeText: {
    type: String,
    required: true
  },
  
  // ATS Breakdown
  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  structureScore: {
    type: Number,
    default: 0
  },
  readabilityScore: {
    type: Number,
    default: 0
  },
  
  // Categorized Skills
  skillsDetected: {
    technical: { type: [String], default: [] },
    soft: { type: [String], default: [] },
    frameworks: { type: [String], default: [] },
    tools: { type: [String], default: [] }
  },
  missingSkills: {
    type: [String],
    default: []
  },
  
  // Strengths & Weaknesses
  strengths: {
    type: [String],
    default: []
  },
  weaknesses: {
    type: [String],
    default: []
  },
  suggestions: {
    type: [String],
    default: []
  },
  keywords: {
    found: { type: [String], default: [] },
    recommended: { type: [String], default: [] }
  },
  
  // Section-by-section analysis
  sectionAnalysis: {
    contactInfo: SectionScoreSchema,
    professionalSummary: SectionScoreSchema,
    workExperience: SectionScoreSchema,
    education: SectionScoreSchema,
    skillsSection: SectionScoreSchema,
    projects: SectionScoreSchema
  },
  
  // Optional Job Description Matching
  jobDescription: {
    type: String,
    default: ''
  },
  jobMatchScore: {
    type: Number,
    default: null
  },
  jobMatchAnalysis: {
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    experienceMatch: { type: String, default: '' },
    recommendations: { type: [String], default: [] },
    keywordMatchPercentage: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('ResumeAnalysis', ResumeAnalysisSchema);
