
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');
const { generateContent, extractHashtags } = require('../utils/aiGenerator');

// Generate AI content based on interest + tone
router.post('/generate', protect, async (req, res) => {
  try {
    const { interest, tone, platform, customPrompt, save } = req.body;

    // Validate inputs
    const validInterests = ['technology', 'sports', 'business', 'entertainment', 'health', 'science', 'politics', 'travel', 'food', 'fashion'];
    const validTones = ['professional', 'funny', 'motivational', 'casual', 'inspirational'];

    const selectedInterest = validInterests.includes(interest) ? interest : 'technology';
    const selectedTone = validTones.includes(tone) ? tone : 'professional';

    // Generate content
    const { content, source } = await generateContent( selectedInterest,  selectedTone,  platform,  customPrompt);
    const hashtags = extractHashtags(content);

    // Generate simulated engagement prediction
    const engagementScore = Math.floor(Math.random() * 30) + 60; // 60–90
    const predictedReach = Math.floor(Math.random() * 5000) + 500;

    // Optionally save to DB
    let savedPost = null;
    if (save) {
      savedPost = await Post.create({
        user: req.user._id,
        content,
        platform: platform || 'twitter',
        tone: selectedTone,
        interest: selectedInterest,
        hashtags,
        status: 'draft',
        analytics: {
          likes: Math.floor(Math.random() * 200),
          reach: predictedReach,
          engagement: engagementScore,
          shares: Math.floor(Math.random() * 50),
          comments: Math.floor(Math.random() * 30),
        },
      });

      // Increment user's post count
      await User.findByIdAndUpdate(req.user._id, { $inc: { postsGenerated: 1 } });
    }

    res.json({
      success: true,
      data: {
        content,
        hashtags,
        source,
        platform: platform || 'twitter',
        engagementPrediction: { score: engagementScore, reach: predictedReach },
        savedPost,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.get('/my-posts', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Post.countDocuments(filter);

    res.json({ success: true, data: posts, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/content/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, user: req.user._id });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
