
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      maxlength: [500, 'Post cannot exceed 500 characters'],
    },
    platform: {
      type: String,
      enum: ['twitter', 'instagram', 'linkedin', 'facebook'],
      default: 'twitter',
    },
    tone: {
      type: String,
      enum: ['professional', 'funny', 'motivational', 'casual', 'inspirational'],
      default: 'professional',
    },
    interest: {
      type: String,
      default: 'technology',
    },
    hashtags: [String], // Array of hashtags
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'posted'],
      default: 'draft',
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    // Simulated engagement metrics
    analytics: {
      likes:       { type: Number, default: 0 },
      reach:       { type: Number, default: 0 },
      engagement:  { type: Number, default: 0 }, // percentage
      shares:      { type: Number, default: 0 },
      comments:    { type: Number, default: 0 },
    },
    isAIGenerated: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
