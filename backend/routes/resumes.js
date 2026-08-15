const express = require('express');
const router = express.Router();
const multer = require('multer');
// Universal, bulletproof PDF text extractor
async function extractTextFromPdf(buffer) {
  let extractedText = '';

  // Strategy 1: CommonJS / ESM pdf-parse library
  try {
    const pdfLib = require('pdf-parse');

    // 1a. If pdfLib.PDFParse exists (pdf-parse v2+ class)
    if (pdfLib && typeof pdfLib.PDFParse === 'function') {
      try {
        const parser = new pdfLib.PDFParse({ data: buffer });
        const result = await parser.getText();
        if (parser.destroy) {
          try { await parser.destroy(); } catch (e) {}
        }
        if (result && typeof result.text === 'string' && result.text.trim().length > 0) {
          extractedText = result.text;
        }
      } catch (e) {}
    }

    // 1b. If pdfLib itself is a function (pdf-parse v1.1.x standard)
    if (!extractedText && typeof pdfLib === 'function') {
      try {
        if (pdfLib.prototype && typeof pdfLib.prototype.getText === 'function') {
          const parser = new pdfLib({ data: buffer });
          const result = await parser.getText();
          if (parser.destroy) {
            try { await parser.destroy(); } catch (e) {}
          }
          if (result && typeof result.text === 'string' && result.text.trim().length > 0) {
            extractedText = result.text;
          }
        } else {
          const result = await pdfLib(buffer);
          if (result && typeof result.text === 'string' && result.text.trim().length > 0) {
            extractedText = result.text;
          }
        }
      } catch (invokeErr) {
        // In case invoking as function failed because it is a class:
        try {
          const parser = new pdfLib({ data: buffer });
          const result = await parser.getText();
          if (result && typeof result.text === 'string' && result.text.trim().length > 0) {
            extractedText = result.text;
          }
        } catch (e) {}
      }
    }

    // 1c. If default property export
    if (!extractedText && pdfLib && typeof pdfLib.default === 'function') {
      try {
        const result = await pdfLib.default(buffer);
        if (result && typeof result.text === 'string' && result.text.trim().length > 0) {
          extractedText = result.text;
        }
      } catch (e) {}
    }
  } catch (err) {
    console.warn('PDF library loader warning:', err.message);
  }

  if (extractedText && extractedText.trim().length > 20) {
    return extractedText;
  }

  // Strategy 2: Raw Binary Stream Text Extraction Fallback
  try {
    const raw = buffer.toString('latin1');
    const textPieces = [];

    // Match (text) Tj and TJ string arrays
    const tjRegex = /\(([^)\\]*(?:\\.[^)\\]*)*)\)\s*Tj/g;
    let m;
    while ((m = tjRegex.exec(raw)) !== null) {
      if (m[1]) {
        const cleaned = m[1].replace(/\\([()\\])/g, '$1');
        if (cleaned.trim().length > 0) textPieces.push(cleaned);
      }
    }

    if (textPieces.length > 15) {
      return textPieces.join(' ');
    }
  } catch (e) {}

  return buffer.toString('utf-8');
}

const auth = require('../middleware/auth');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const User = require('../models/User');
const {
  analyzeResumeText,
  matchResumeToJobDescription
} = require('../utils/devoraAi');

// Configure Multer for in-memory file uploads (max 6MB)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf') || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Please upload a valid PDF or text document.'));
    }
  }
});

// ── 1. Upload & Analyze Resume ──────────────────────────────
// POST /api/resumes/analyze
router.post('/analyze', auth, upload.single('resumeFile'), async (req, res) => {
  try {
    let rawText = '';
    let fileName = 'Resume.pdf';

    // 1. Check if file was uploaded
    if (req.file) {
      fileName = req.file.originalname;
      if (req.file.mimetype === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
        rawText = await extractTextFromPdf(req.file.buffer);
      } else {
        rawText = req.file.buffer.toString('utf-8');
      }
    } else if (req.body.resumeText) {
      // 2. Direct text paste fallback
      rawText = req.body.resumeText;
      fileName = req.body.fileName || 'Pasted-Resume.txt';
    } else {
      return res.status(400).json({ success: false, message: 'Please upload a PDF resume or paste resume text.' });
    }

    if (!rawText || rawText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract enough readable text from the document. Please ensure the PDF is not an image scan.'
      });
    }

    const user = await User.findById(req.user._id);
    const targetRole = req.body.targetRole || user?.targetRole || 'Software Engineer';

    // Run AI ATS analysis
    const analysisResult = await analyzeResumeText({
      resumeText: rawText,
      targetRole
    });

    const resumeRecord = await ResumeAnalysis.create({
      userId: req.user._id,
      fileName,
      resumeText: rawText,
      atsScore: analysisResult.atsScore,
      structureScore: analysisResult.structureScore || 80,
      readabilityScore: analysisResult.readabilityScore || 85,
      skillsDetected: analysisResult.skillsDetected || { technical: [], soft: [], frameworks: [], tools: [] },
      missingSkills: analysisResult.missingSkills || [],
      strengths: analysisResult.strengths || [],
      weaknesses: analysisResult.weaknesses || [],
      suggestions: analysisResult.suggestions || [],
      keywords: analysisResult.keywords || { found: [], recommended: [] },
      sectionAnalysis: analysisResult.sectionAnalysis || {}
    });

    // Update user profile resume score
    await User.findByIdAndUpdate(req.user._id, {
      resumeScore: analysisResult.atsScore,
      $inc: { resumeAnalysesCount: 1 },
      $set: { careerScore: Math.round((analysisResult.atsScore + (user?.interviewScore || 75)) / 2) }
    });

    res.status(201).json({
      success: true,
      analysis: resumeRecord
    });
  } catch (err) {
    console.error('Resume analysis error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to analyze resume' });
  }
});

// ── 2. Match Resume Against Job Description ─────────────────
// POST /api/resumes/match-job (or /api/resumes/:id/match-job)
router.post('/match-job', auth, async (req, res) => {
  try {
    const { resumeId, resumeText, jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({ success: false, message: 'Please provide a valid job description.' });
    }

    let sourceText = resumeText;
    let resumeRecord = null;

    if (resumeId) {
      resumeRecord = await ResumeAnalysis.findOne({ _id: resumeId, userId: req.user._id });
      if (resumeRecord) {
        sourceText = resumeRecord.resumeText;
      }
    }

    if (!sourceText) {
      // Find user's latest resume
      resumeRecord = await ResumeAnalysis.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
      if (resumeRecord) {
        sourceText = resumeRecord.resumeText;
      }
    }

    if (!sourceText) {
      return res.status(400).json({ success: false, message: 'No resume found. Please upload or paste a resume first.' });
    }

    // Run AI matching
    const matchResult = await matchResumeToJobDescription({
      resumeText: sourceText,
      jobDescription
    });

    if (resumeRecord) {
      resumeRecord.jobDescription = jobDescription;
      resumeRecord.jobMatchScore = matchResult.jobMatchScore;
      resumeRecord.jobMatchAnalysis = {
        matchedSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills,
        experienceMatch: matchResult.experienceMatch,
        recommendations: matchResult.recommendations,
        keywordMatchPercentage: matchResult.keywordMatchPercentage
      };
      await resumeRecord.save();
    }

    res.json({
      success: true,
      jobMatch: matchResult,
      resumeId: resumeRecord?._id
    });
  } catch (err) {
    console.error('Job match error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to match resume with job description' });
  }
});

// ── 3. Get User's Resume Analysis History ───────────────────
// GET /api/resumes
router.get('/', auth, async (req, res) => {
  try {
    const history = await ResumeAnalysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-resumeText');

    res.json({
      success: true,
      history
    });
  } catch (err) {
    console.error('Fetch resume history error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve resume history' });
  }
});

// ── 4. Get Single Resume Analysis ───────────────────────────
// GET /api/resumes/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({ _id: req.params.id, userId: req.user._id });
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Resume analysis not found' });
    }

    res.json({
      success: true,
      analysis
    });
  } catch (err) {
    console.error('Fetch single resume error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve analysis' });
  }
});

// ── 5. Delete Resume Analysis ───────────────────────────────
// DELETE /api/resumes/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await ResumeAnalysis.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Resume analysis not found' });
    }

    res.json({ success: true, message: 'Resume analysis removed' });
  } catch (err) {
    console.error('Delete resume analysis error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete resume analysis' });
  }
});

module.exports = router;
