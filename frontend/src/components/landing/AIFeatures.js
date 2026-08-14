import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles, faCompass, faChartPie, faLightbulb, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const AI_FEATURES_DATA = [
  {
    id: "generator",
    tag: "Multi-Platform Generator",
    title: "AI Content Generator",
    desc: "Generate platform-specific content in seconds. NEYRIX AI adapts length, line spacing, hashtag density, and hooks tailored to each network.",
    bullets: [
      "5+ Tone Personas (Corporate, Casual, Viral, Inspiring)",
      "Instant multi-variation drafting",
      "Automatic hashtag synthesis",
    ],
    icon: faWandMagicSparkles,
    preview: {
      title: "Generated LinkedIn Draft",
      body: "🚀 Excited to launch NEYRIX AI 2.0!\n\nBuild once, publish everywhere with AI precision.",
      badge: "🔥 Virality Score: 98/100",
    },
  },
  {
    id: "discovery",
    tag: "Real-Time Intelligence",
    title: "AI Trend Discovery",
    desc: "Find topics worth talking about before they saturate. Our AI continuously scans industry trends, developer topics, and viral hooks.",
    bullets: [
      "Global topic volume tracking",
      "Virality score index for every prompt",
      "1-Click draft generation from hot trends",
    ],
    icon: faCompass,
    preview: {
      title: "Current Trending Topic",
      body: "🔥 Autonomous AI Agents in Dev Workflows\n+142% search volume increase this week",
      badge: "⚡ High Opportunity Topic",
    },
  },
  {
    id: "analyzer",
    tag: "Performance Optimization",
    title: "AI Content Analyzer",
    desc: "Understand post performance before and after publishing. Identify top-performing hooks and optimize posting schedules.",
    bullets: [
      "Pre-publish hook readability checks",
      "Post-publish reach and engagement charts",
      "Audience response heatmaps",
    ],
    icon: faChartPie,
    preview: {
      title: "Engagement Health Index",
      body: "📊 Organic Reach: +24.8K (+18.2%)\nEngagement Rate: 8.4% (Optimal)",
      badge: "✓ Exceeds Industry Benchmark",
    },
  },
  {
    id: "recommendations",
    tag: "Smart Copilot",
    title: "AI Recommendations Engine",
    desc: "Get automated suggestions for better content strategies, ideal posting windows, and persona refinements based on real data.",
    bullets: [
      "Automated best-time-to-post recommendations",
      "Persona voice consistency scoring",
      "Content gap alerts to keep your queue active",
    ],
    icon: faLightbulb,
    preview: {
      title: "AI Smart Recommendation",
      body: "💡 Tip: LinkedIn posts published on Tuesday at 9 AM get 3.2x higher organic impressions for your brand persona.",
      badge: "🎯 Applied Automatically",
    },
  },
];

export default function AIFeatures() {
  return (
    <section id="ai-features" className="sai-ai-features-section">
      <div className="sai-section-container">
        <div className="sai-section-header">

          <h2 className="sai-section-title">AI that works with you.</h2>
          <p className="sai-section-sub">
            Powerful AI tools engineered to eliminate friction at every stage of your content workflow.
          </p>
        </div>

        {/* Alternating Feature Blocks */}
        <div className="ai-feature-blocks-list">
          {AI_FEATURES_DATA.map((feat, idx) => (
            <div
              key={feat.id}
              className={`ai-feature-block ${idx % 2 === 1 ? "reverse" : ""}`}
            >
              {/* Info Column */}
              <div className="block-info-col">
                <span className="block-tag">{feat.tag}</span>
                <h3 className="block-title">{feat.title}</h3>
                <p className="block-desc">{feat.desc}</p>

                <ul className="block-bullets">
                  {feat.bullets.map((b) => (
                    <li key={b}>
                      <span className="bullet-dot">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="block-cta">
                  <Link to="/register" className="sai-btn-outline-small">
                    Explore Feature <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: "0.3rem" }} />
                  </Link>
                </div>
              </div>

              {/* Graphic / Window Column */}
              <div className="block-graphic-col">
                <div className="block-mock-window">
                  <div className="mock-window-header">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                    <span className="title">{feat.title} Workspace</span>
                  </div>

                  <div className="mock-window-body">
                    <div className="mock-badge">{feat.preview.badge}</div>
                    <h4 className="mock-title">{feat.preview.title}</h4>
                    <pre className="mock-pre">{feat.preview.body}</pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
