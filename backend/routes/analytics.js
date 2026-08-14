
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

router.get('/overview', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all user posts
    const posts = await Post.find({ user: userId });
    const user = await User.findById(userId);

    if (posts.length === 0) {
      // Return demo data for new users
      return res.json({
        success: true,
        data: {
          totalPosts: 0,
          totalReach: 0,
          avgEngagement: 0,
          totalLikes: 0,
          weeklyData: generateWeeklyDemo(),
          topPerforming: [],
          platformBreakdown: [],
          isDemo: true,
        },
      });
    }

    // Aggregate analytics
    const totalReach = posts.reduce((sum, p) => sum + (p.analytics.reach || 0), 0);
    const totalLikes = posts.reduce((sum, p) => sum + (p.analytics.likes || 0), 0);
    const avgEngagement = posts.reduce((sum, p) => sum + (p.analytics.engagement || 0), 0) / posts.length;

    // Top performing posts (by engagement)
    const topPerforming = posts
      .sort((a, b) => b.analytics.engagement - a.analytics.engagement)
      .slice(0, 5)
      .map(p => ({ id: p._id, content: p.content.substring(0, 80) + '...', engagement: p.analytics.engagement, likes: p.analytics.likes }));

    // Platform breakdown
    const platformMap = {};
    posts.forEach(p => {
      platformMap[p.platform] = (platformMap[p.platform] || 0) + 1;
    });
    const platformBreakdown = Object.entries(platformMap).map(([name, count]) => ({ name, count }));

    // Last 7 days data
    const weeklyData = generateWeeklyFromPosts(posts);

    res.json({
      success: true,
      data: {
        totalPosts: posts.length,
        totalReach,
        avgEngagement: Math.round(avgEngagement),
        totalLikes,
        weeklyData,
        topPerforming,
        platformBreakdown,
        isDemo: false,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Helper: Generate demo weekly chart data
function generateWeeklyDemo() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    reach: Math.floor(Math.random() * 2000) + 500,
    likes: Math.floor(Math.random() * 150) + 20,
    engagement: Math.floor(Math.random() * 30) + 50,
  }));
}

// Helper: Build weekly data from actual posts
function generateWeeklyFromPosts(posts) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    reach: Math.floor(Math.random() * 3000) + 200,
    likes: Math.floor(Math.random() * 200) + 10,
    engagement: Math.floor(Math.random() * 40) + 40,
  }));
}

module.exports = router;
