import React, { useState } from "react";

const DEMO_TRANSFORMATIONS = {
  LinkedIn: {
    platform: "LinkedIn",
    icon: "💼",
    accentColor: "#0A66C2",
    badge: "Long-form & Professional",
    content: `🚀 Excited to announce we just launched NEYRIX AI v2.0!\n\nAfter 6 months of intense engineering, our team built an AI workspace that eliminates manual post writing across 4 channels.\n\nKey capabilities:\n• 1-Click Multi-Platform Adaptation\n• Real-Time Virality Score & Analytics\n• Automated Calendar Scheduling\n\nA massive thank you to our 10,000+ early creators.\n\n#BuildInPublic #AI #Leadership #SaaS`,
  },
  Twitter: {
    platform: "Twitter / X",
    icon: "𝕏",
    accentColor: "#000000",
    badge: "Punchy & Viral Hook",
    content: `Big news: NEYRIX AI v2.0 is officially live today! 🚀\n\n6 months of building condensed into a 1-click dashboard that turns any prompt into platform-ready posts + virality scores in 5 seconds.\n\nTry it 100% free (link in bio) 👇 #BuildInPublic #DevCommunity`,
  },
  Instagram: {
    platform: "Instagram",
    icon: "📸",
    accentColor: "#E4405F",
    badge: "Visual & Engagement Caption",
    content: `WE ARE LIVE! 🚀✨\n\n6 months ago, we set out to solve social media writer's block for solopreneurs and creators. Today, NEYRIX AI v2.0 is open to everyone!\n\nSwipe to see how it predicts post reach before you hit publish 📲\n\nDrop a 🚀 in the comments to get your free access link! 💡\n\n#CreatorEconomy #GrowthMindset #Productivity #AI`,
  },
  Facebook: {
    platform: "Facebook",
    icon: "🌐",
    accentColor: "#1877F2",
    badge: "Community & Conversational",
    content: `Hey everyone! Huge milestone day for our team — NEYRIX AI v2.0 is officially live! 🎉\n\nIf you've been struggling to keep up with daily posts across X, LinkedIn, and Instagram, this is built for you.\n\nWhat feature are you most excited to try out? Let us know in the comments below! 👇`,
  },
};

export default function MultiPlatformShowcase() {
  const [activeTab, setActiveTab] = useState("LinkedIn");
  const current = DEMO_TRANSFORMATIONS[activeTab];

  return (
    <section className="sai-multi-platform-section">
      <div className="sai-section-container">
        <div className="sai-section-header">

          <h2 className="sai-section-title">One idea. Every platform.</h2>
          <p className="sai-section-sub">
            NEYRIX AI automatically re-formats line spacing, hashtag density, tone, and character count specifically for each platform's algorithm.
          </p>
        </div>

        {/* Platform Selection Tabs */}
        <div className="multi-platform-tabs">
          {Object.keys(DEMO_TRANSFORMATIONS).map((key) => {
            const item = DEMO_TRANSFORMATIONS[key];
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`platform-tab-btn ${activeTab === key ? "active" : ""}`}
              >
                <span>{item.icon}</span> {item.platform}
              </button>
            );
          })}
        </div>

        {/* Transformation Showcase Display */}
        <div className="multi-platform-card">
          <div className="card-top-bar">
            <div className="platform-identity">
              <span className="plat-icon">{current.icon}</span>
              <div>
                <h4 className="plat-name">{current.platform} Optimized Output</h4>
                <span className="plat-badge">{current.badge}</span>
              </div>
            </div>
            <div className="score-pill">
              🔥 98/100 Viral Index
            </div>
          </div>

          <div className="card-body">
            <pre className="content-preview">{current.content}</pre>
          </div>

          <div className="card-bottom">
            <span>✓ Automatically tuned for algorithm reach</span>
            <button className="copy-btn" onClick={() => navigator.clipboard && navigator.clipboard.writeText(current.content)}>
              📋 Copy Post
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
