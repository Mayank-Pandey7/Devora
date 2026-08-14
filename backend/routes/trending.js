

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Rich mock trending data — rotates based on time of day for realism
const trendingData = {
  technology: [
    { topic: '#ChatGPT', posts: '2.4M', change: '+18%', hot: true },
    { topic: '#React19', posts: '890K', change: '+42%', hot: true },
    { topic: '#WebDev', posts: '1.1M', change: '+5%', hot: false },
    { topic: '#AITools', posts: '3.2M', change: '+67%', hot: true },
    { topic: '#OpenSource', posts: '560K', change: '+12%', hot: false },
    { topic: '#TypeScript', posts: '720K', change: '+23%', hot: false },
    { topic: '#CloudComputing', posts: '430K', change: '+8%', hot: false },
  ],
  sports: [
    { topic: '#IPL2026', posts: '4.5M', change: '+120%', hot: true },
    { topic: '#FootballWorldcup', posts: '3.1M', change: '+85%', hot: true },
    { topic: '#WorldCup', posts: '5.2M', change: '+200%', hot: true },
    { topic: '#NBA', posts: '2.8M', change: '+34%', hot: false },
    { topic: '#Olympics', posts: '6.1M', change: '+150%', hot: true },
    { topic: '#Cricket', posts: '1.9M', change: '+45%', hot: false },
  ],
  business: [
    { topic: '#StartupLife', posts: '1.2M', change: '+22%', hot: false },
    { topic: '#Entrepreneurship', posts: '2.1M', change: '+15%', hot: false },
    { topic: '#FinTech', posts: '870K', change: '+38%', hot: true },
    { topic: '#StockMarket', posts: '1.8M', change: '+55%', hot: true },
    { topic: '#Crypto', posts: '2.4M', change: '+89%', hot: true },
    { topic: '#Leadership', posts: '990K', change: '+11%', hot: false },
  ],
  health: [
    { topic: '#MentalHealth', posts: '3.4M', change: '+28%', hot: true },
    { topic: '#Fitness', posts: '2.7M', change: '+19%', hot: false },
    { topic: '#Mindfulness', posts: '1.1M', change: '+33%', hot: false },
    { topic: '#NutritionTips', posts: '780K', change: '+14%', hot: false },
    { topic: '#WellnessJourney', posts: '920K', change: '+41%', hot: true },
  ],
  entertainment: [
    { topic: '#Netflix', posts: '3.8M', change: '+72%', hot: true },
    { topic: '#Gaming', posts: '4.2M', change: '+91%', hot: true },
    { topic: '#Music', posts: '5.1M', change: '+38%', hot: false },
    { topic: '#Movies', posts: '2.9M', change: '+24%', hot: false },
    { topic: '#K-Drama', posts: '1.7M', change: '+110%', hot: true },
  ],
  general: [
    { topic: '#AI', posts: '8.2M', change: '+145%', hot: true },
    { topic: '#Innovation', posts: '1.4M', change: '+22%', hot: false },
    { topic: '#Sustainability', posts: '2.1M', change: '+67%', hot: true },
    { topic: '#ClimateChange', posts: '3.3M', change: '+44%', hot: false },
    { topic: '#Education', posts: '1.9M', change: '+18%', hot: false },
    { topic: '#Future', posts: '2.5M', change: '+31%', hot: false },
  ],
};

router.get('/', protect, (req, res) => {
  try {
    const { interest } = req.query;

    let topics = [];

    if (interest && trendingData[interest]) {
      // Return interest-specific + some general
      topics = [
        ...trendingData[interest],
        ...trendingData.general.slice(0, 3),
      ];
    } else {
      // Return mix of all categories
      topics = [
        ...trendingData.technology.slice(0, 2),
        ...trendingData.sports.slice(0, 2),
        ...trendingData.business.slice(0, 2),
        ...trendingData.general,
      ];
    }

    // Shuffle slightly for freshness
    topics = topics.sort(() => Math.random() - 0.48);

    res.json({
      success: true,
      data: topics,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
