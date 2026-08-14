const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionNumber: { type: Number, required: true },
  question: { type: String, required: true },
  category: { type: String, default: 'Technical' },
  difficulty: { type: String, default: 'Medium' },
  idealAnswer: { type: String, default: '' },
  keyPoints: { type: [String], default: [] },
  followUp: { type: String, default: '' }
}, { _id: false });

const AnswerSchema = new mongoose.Schema({
  questionNumber: { type: Number, required: true },
  question: { type: String, required: true },
  userAnswer: { type: String, required: true },
  score: { type: Number, default: 0 },
  feedback: { type: String, default: '' },
  strengths: { type: [String], default: [] },
  missedPoints: { type: [String], default: [] },
  idealAnswer: { type: String, default: '' },
  followUpQuestion: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now }
}, { _id: false });

const ConversationMessageSchema = new mongoose.Schema({
  speaker: { type: String, enum: ['ai', 'user'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const InterviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    default: 'Full Stack Developer'
  },
  interviewType: {
    type: String,
    required: [true, 'Interview type is required'],
    enum: ['Technical', 'DSA', 'JavaScript', 'React', 'Backend', 'System Design', 'HR / Behavioral'],
    default: 'Technical'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  mode: {
    type: String,
    enum: ['question-by-question', 'mock-conversation'],
    default: 'question-by-question'
  },
  totalQuestions: {
    type: Number,
    default: 5
  },
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress'
  },
  questions: [QuestionSchema],
  answers: [AnswerSchema],
  conversationHistory: [ConversationMessageSchema],
  
  // Final Evaluation (when completed)
  overallScore: {
    type: Number,
    default: 0
  },
  metrics: {
    technicalKnowledge: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    problemSolving: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 }
  },
  summary: {
    type: String,
    default: ''
  },
  strengths: {
    type: [String],
    default: []
  },
  areasToImprove: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);
