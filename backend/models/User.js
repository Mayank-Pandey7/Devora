const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId && !this.clerkUserId;
      },
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password in queries by default
    },
    googleId: { type: String },
    clerkUserId: { type: String, sparse: true, index: true },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'clerk', 'otp'],
      default: 'local',
    },
    avatar: { type: String },
    
    // Devora Developer Career Profile Fields
    targetRole: {
      type: String,
      default: 'Full Stack Developer',
      trim: true,
    },
    experienceLevel: {
      type: String,
      default: 'Mid-Level',
      enum: ['Student', 'Graduate', 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Student / Graduate'],
    },
    skills: {
      type: [String],
      default: ['JavaScript', 'React', 'Node.js'],
    },
    bio: {
      type: String,
      default: '',
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    github: { type: String, default: '', trim: true },
    linkedin: { type: String, default: '', trim: true },
    portfolio: { type: String, default: '', trim: true },

    // Career Readiness Aggregated Metrics
    careerScore: { type: Number, default: 75 },
    interviewScore: { type: Number, default: 0 },
    resumeScore: { type: Number, default: 0 },
    
    // Stats tracking
    interviewSessionsCount: { type: Number, default: 0 },
    resumeAnalysesCount: { type: Number, default: 0 },

    // Preferences
    darkMode: { type: Boolean, default: true },

    // OTP Verification Fields
    otp: { type: String, select: false },
    otpExpiry: { type: Date, select: false },
  },
  { timestamps: true }
);

// ── Hash password before saving ──────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Method to compare passwords ──────────────
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);