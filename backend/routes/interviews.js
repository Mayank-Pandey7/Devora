const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const InterviewSession = require('../models/InterviewSession');
const User = require('../models/User');
const {
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  generateMockFollowUp,
  generateFinalInterviewSummary
} = require('../utils/devoraAi');

// ── 1. Create a New Interview Session ───────────────────────
// POST /api/interviews
router.post('/', auth, async (req, res) => {
  try {
    const { role = 'Full Stack Developer', interviewType = 'Technical', difficulty = 'Medium', totalQuestions = 5, mode = 'question-by-question' } = req.body;

    // Generate questions using AI
    const questions = await generateInterviewQuestions({
      role,
      interviewType,
      difficulty,
      count: parseInt(totalQuestions) || 5
    });

    const initialConversation = [];
    if (mode === 'mock-conversation') {
      initialConversation.push({
        speaker: 'ai',
        message: `Hello! Welcome to your ${difficulty}-level ${interviewType} interview for the ${role} position. Let's begin! To start, could you tell me about your background and a technically challenging project you recently built?`,
        timestamp: new Date()
      });
    }

    const session = await InterviewSession.create({
      userId: req.user._id,
      role,
      interviewType,
      difficulty,
      mode,
      totalQuestions: questions.length,
      questions,
      answers: [],
      conversationHistory: initialConversation,
      currentQuestionIndex: 0,
      status: 'in-progress'
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, { $inc: { interviewSessionsCount: 1 } });

    res.status(201).json({
      success: true,
      session
    });
  } catch (err) {
    console.error('Create interview session error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to initialize interview' });
  }
});

// ── 2. Get User's Interview History ─────────────────────────
// GET /api/interviews
router.get('/', auth, async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30)
      .select('-questions.idealAnswer');

    res.json({
      success: true,
      sessions
    });
  } catch (err) {
    console.error('Fetch interview history error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve interview history' });
  }
});

// ── 3. Get Single Interview Session Details ─────────────────
// GET /api/interviews/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    res.json({
      success: true,
      session
    });
  } catch (err) {
    console.error('Fetch single interview error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve interview session' });
  }
});

// ── 4. Submit Answer for a Question ─────────────────────────
// POST /api/interviews/:id/answer
router.post('/:id/answer', auth, async (req, res) => {
  try {
    const { questionNumber, userAnswer } = req.body;
    if (!userAnswer || !userAnswer.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide an answer.' });
    }

    const session = await InterviewSession.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ success: false, message: 'This interview session is already completed.' });
    }

    const targetQuestion = session.questions.find(q => q.questionNumber === questionNumber) 
      || session.questions[session.currentQuestionIndex];

    if (!targetQuestion) {
      return res.status(400).json({ success: false, message: 'Invalid question number' });
    }

    // Evaluate answer with Gemini AI
    const evaluation = await evaluateInterviewAnswer({
      question: targetQuestion.question,
      answer: userAnswer,
      role: session.role,
      difficulty: session.difficulty,
      idealAnswer: targetQuestion.idealAnswer
    });

    const answerRecord = {
      questionNumber: targetQuestion.questionNumber,
      question: targetQuestion.question,
      userAnswer,
      score: evaluation.score,
      feedback: evaluation.feedback,
      strengths: evaluation.strengths,
      missedPoints: evaluation.missedPoints,
      idealAnswer: evaluation.idealAnswer,
      followUpQuestion: evaluation.followUpQuestion,
      submittedAt: new Date()
    };

    session.answers.push(answerRecord);

    const nextIndex = session.currentQuestionIndex + 1;
    const isFinished = nextIndex >= session.questions.length;

    if (isFinished) {
      session.status = 'completed';
      session.currentQuestionIndex = session.questions.length;

      // Compile final scorecard
      const summaryReport = await generateFinalInterviewSummary({
        role: session.role,
        interviewType: session.interviewType,
        questions: session.questions,
        answers: session.answers
      });

      session.overallScore = summaryReport.overallScore;
      session.metrics = summaryReport.metrics;
      session.summary = summaryReport.summary;
      session.strengths = summaryReport.strengths;
      session.areasToImprove = summaryReport.areasToImprove;

      // Update User profile readiness score
      await User.findByIdAndUpdate(req.user._id, {
        interviewScore: summaryReport.overallScore,
        $set: { careerScore: Math.round((summaryReport.overallScore + 80) / 2) }
      });
    } else {
      session.currentQuestionIndex = nextIndex;
    }

    await session.save();

    res.json({
      success: true,
      evaluation,
      isFinished,
      session
    });
  } catch (err) {
    console.error('Submit answer error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to process answer' });
  }
});

// ── 5. Mock Interview Interactive Message ───────────────────
// POST /api/interviews/:id/mock-message
router.post('/:id/mock-message', auth, async (req, res) => {
  try {
    const { userMessage } = req.body;
    if (!userMessage || !userMessage.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const session = await InterviewSession.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Append user message
    session.conversationHistory.push({
      speaker: 'user',
      message: userMessage,
      timestamp: new Date()
    });

    // Generate AI follow-up
    const aiResponse = await generateMockFollowUp({
      role: session.role,
      interviewType: session.interviewType,
      conversationHistory: session.conversationHistory,
      latestAnswer: userMessage
    });

    session.conversationHistory.push({
      speaker: 'ai',
      message: aiResponse.interviewerMessage,
      timestamp: new Date()
    });

    // Check if conversation reached natural round conclusion (e.g. >= 8 turns)
    const userTurns = session.conversationHistory.filter(m => m.speaker === 'user').length;
    let isFinished = userTurns >= 6;

    if (isFinished && session.status !== 'completed') {
      session.status = 'completed';
      const mockAnswers = session.conversationHistory
        .filter(m => m.speaker === 'user')
        .map((m, i) => ({
          question: `Mock Discussion Round ${i + 1}`,
          userAnswer: m.message,
          score: 82
        }));

      const summaryReport = await generateFinalInterviewSummary({
        role: session.role,
        interviewType: session.interviewType,
        questions: [],
        answers: mockAnswers
      });

      session.overallScore = summaryReport.overallScore;
      session.metrics = summaryReport.metrics;
      session.summary = summaryReport.summary;
      session.strengths = summaryReport.strengths;
      session.areasToImprove = summaryReport.areasToImprove;

      await User.findByIdAndUpdate(req.user._id, {
        interviewScore: summaryReport.overallScore
      });
    }

    await session.save();

    res.json({
      success: true,
      aiMessage: aiResponse.interviewerMessage,
      feedbackTip: aiResponse.feedbackTip,
      isFinished,
      session
    });
  } catch (err) {
    console.error('Mock interview message error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to exchange mock message' });
  }
});

// ── 6. Delete Interview Session ─────────────────────────────
// DELETE /api/interviews/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const session = await InterviewSession.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.json({ success: true, message: 'Interview session removed' });
  } catch (err) {
    console.error('Delete interview error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete interview' });
  }
});

module.exports = router;
