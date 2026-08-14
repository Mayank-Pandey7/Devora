const { GoogleGenerativeAI } = require("@google/generative-ai");

let model = null;

try {
  if (process.env.GEMINI_API_KEY) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // safe working model
    });

    console.log("✅ Gemini initialized");
  } else {
    console.warn("⚠️ No GEMINI_API_KEY found");
  }
} catch (err) {
  console.error("❌ Gemini init failed:", err.message);
}
const templates = {
  technology: {
    professional: ["🚀 The future of {topic} is here. Businesses that adapt will lead the next decade. #Tech #Innovation"],
    funny: ["Me: I'll just google one thing. {topic}: *opens 47 tabs* 😅 #TechLife #DevHumor"],
    motivational: ["Every expert in {topic} was once a beginner. Keep building. 💪 #NeverStopLearning"],
    casual: ["honestly {topic} is lowkey changing everything 👀 #JustSaying #Tech"],
    inspirational: ["Machines compute. Humans innovate. {topic} is just the tool. ✨ #Innovation"],
  },
  sports: {
    professional: ["🏆 Champions aren't made in gyms — they're made from desire, dream, and vision. #Sports #Mindset"],
    funny: ["My fitness plan: watch sports and feel tired on their behalf 😂 #Relatable"],
    motivational: ["Every champion refused to give up. Keep pushing. 💪 #NeverGiveUp"],
    casual: ["watching the game tonight and already nervous 😬 #GameDay"],
    inspirational: ["Every loss is just a lesson in disguise. Get up. Try again. 🌟 #Resilience"],
  },
  business: {
    professional: ["💼 The best businesses solve problems. What problem are you solving today? #Entrepreneurship"],
    funny: ["Business plan: Step 1: Great idea. Step 2: ??? Step 3: Profit 😂 #StartupLife"],
    motivational: ["Your idea is valid. Your timing is right. The only thing missing is action. 🚀 #Entrepreneur"],
    casual: ["starting a business is just saying yes before you're ready 😅 #RealTalk"],
    inspirational: ["Every great company started as someone's crazy idea. What's yours? 🌍 #Innovation"],
  },
  health: {
    professional: ["🏥 Invest in wellness before illness. Prevention is the best medicine. #Health #Wellness"],
    funny: ["Me at 11pm: should sleep. Me at 2am: researching entire family history 😂 #Oops"],
    motivational: ["Your body is your most important asset. Invest in it daily. 💪 #Wellness"],
    casual: ["went for a walk and my brain feels less scrambled 🚶 #SmallWins"],
    inspirational: ["Health isn't about the weight you lose. It's about the life you gain. 🌟"],
  },
  entertainment: {
    professional: ["🎬 Great storytelling builds culture and drives change. #Entertainment #Storytelling"],
    funny: ["Me: one episode. *7 episodes later* 😂 #Netflix #Binge"],
    motivational: ["Support creators. Support storytellers. Support art. 🎨 #Art"],
    casual: ["this show destroyed my sleep schedule and i regret nothing 😅 #WorthIt"],
    inspirational: ["Stories change minds and heal wounds. That's not entertainment — that's magic. ✨"],
  },
};

const topicKeywords = {
  technology:    ['AI', 'blockchain', 'cloud computing', 'machine learning', 'cybersecurity', 'Web3', 'automation'],
  sports:        ['cricket', 'football', 'basketball', 'fitness', 'athletics', 'IPL', 'champions league'],
  business:      ['startup', 'entrepreneurship', 'leadership', 'strategy', 'growth hacking', 'venture capital'],
  health:        ['mental health', 'mindfulness', 'nutrition', 'fitness', 'wellness', 'meditation'],
  entertainment: ['streaming', 'gaming', 'movies', 'music', 'content creation', 'social media'],
  science:       ['space exploration', 'quantum computing', 'biotechnology', 'climate science', 'neuroscience'],
  travel:        ['adventure travel', 'solo travel', 'cultural immersion', 'backpacking', 'luxury travel'],
  food:          ['street food', 'plant-based cooking', 'food photography', 'fusion cuisine', 'healthy eating'],
};

const toneDescriptions = {
  professional:  'professional, authoritative, and insightful with industry expertise',
  funny:         'witty, humorous, and laugh-out-loud funny with clever observations',
  motivational:  'high-energy, deeply inspiring, and action-driving',
  casual:        'conversational, chill, and authentic like texting a friend',
  inspirational: 'deeply thoughtful, poetic, and emotionally moving',
};

const platformConstraints = {
  twitter:   'Under 260 characters. Use 2-3 relevant hashtags.',
  instagram: '150-300 characters. Use 5-8 hashtags. Add line breaks.',
  linkedin:  '200-400 characters. Professional tone. Use 3-4 hashtags.',
  facebook:  '150-300 characters. Conversational. Use 2-3 hashtags.',
};

const generateFromTemplate = (interest, tone) => {
  const i = templates[interest] || templates.technology;
  const t = i[tone] || i.professional;
  const template = t[Math.floor(Math.random() * t.length)];
  const kw = topicKeywords[interest] || topicKeywords.technology;
  return template.replace(/{topic}/g, kw[Math.floor(Math.random() * kw.length)]);
};

const generateContent = async (interest, tone, platform = 'twitter', customPrompt = '') => {
  try {
    console.log("🚀 Trying Gemini...");

    const content = await generateWithGemini(interest, tone, platform, customPrompt);

    console.log("✅ Gemini SUCCESS");
    return { content, source: 'ai' };

  } catch (err) {
    console.error("❌ GEMINI FAILED:", err.message);

    return { content: generateFromTemplate(interest, tone), source: 'template' };
  }
};

const generateWithGemini = async (interest, tone, platform, customPrompt) => {
  if (!model) throw new Error("Gemini not initialized");

  const prompt = `Write a short ${platform} post about "${customPrompt || interest}" in ${tone} tone with hashtags.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
};

const extractHashtags = (content) => {
  const matches = content.match(/#\w+/g);
  return matches ? matches.map(h => h.toLowerCase()) : [];
};

module.exports = { generateContent, extractHashtags, generateFromTemplate };