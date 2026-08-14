
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Post = require('../models/Post');

// Save a post and optionally schedule it
router.post('/schedule', protect, async (req, res) => {
  try {
    const { content, platform, scheduledAt, tone, interest } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Content is required.' });
    }

    const post = await Post.create({
      user: req.user._id,
      content,
      platform: platform || 'twitter',
      tone: tone || 'professional',
      interest: interest || 'technology',
      hashtags: content.match(/#\w+/g) || [],
      status: scheduledAt ? 'scheduled' : 'draft',
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      analytics: {
        likes: 0,
        reach: 0,
        engagement: 0,
        shares: 0,
        comments: 0,
      },
    });

    res.status(201).json({ success: true, data: post, message: scheduledAt ? 'Post scheduled!' : 'Post saved as draft.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/scheduler/scheduled 
router.get('/scheduled', protect, async (req, res) => {
  try {
    const posts = await Post.find({
      user: req.user._id,
      status: { $in: ['scheduled', 'draft'] },
    }).sort({ scheduledAt: 1, createdAt: -1 });

    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/scheduler/:id/cancel
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: 'draft', scheduledAt: null },
      { new: true }
    );

    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });
    res.json({ success: true, data: post, message: 'Schedule cancelled. Post moved to drafts.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
