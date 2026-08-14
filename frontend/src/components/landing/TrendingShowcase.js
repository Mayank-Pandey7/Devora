import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faArrowTrendUp, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

const TRENDS = [
  {
    category: "AI & Machine Learning",
    title: "Autonomous AI Agents in Dev Workflows",
    volume: "142.5K searches",
    score: 98,
    growth: "+142% this week",
    samplePrompt: "3 ways AI agents are changing how solo developers build apps in 2026.",
  },
  {
    category: "Web Development",
    title: "React 19 Server Actions & Edge Performance",
    volume: "89.2K searches",
    score: 94,
    growth: "+88% this week",
    samplePrompt: "Why server actions in React 19 simplify state management for full-stack teams.",
  },
  {
    category: "Startups & SaaS",
    title: "Building in Public vs Stealth Launching",
    volume: "64.1K searches",
    score: 92,
    growth: "+65% this week",
    samplePrompt: "The exact playbook we used to get 1,000 beta users before writing a line of code.",
  },
  {
    category: "Productivity & Remote",
    title: "Async Documentation over Video Calls",
    volume: "52.8K searches",
    score: 89,
    growth: "+45% this week",
    samplePrompt: "Why our 10-person team cancelled 90% of meetings and doubled shipping speed.",
  },
];

export default function TrendingShowcase() {
  return (
    <section className="sai-trending-showcase-section">
      <div className="sai-section-container">
        <div className="sai-section-header">

          <h2 className="sai-section-title">Never run out of things to post.</h2>
          <p className="sai-section-sub">
            NEYRIX AI continuously monitors global tech & industry conversations to suggest viral content angles before they peak.
          </p>
        </div>

        {/* Trends Grid */}
        <div className="trending-grid">
          {TRENDS.map((t) => (
            <div key={t.title} className="trend-card">
              <div className="trend-top">
                <span className="trend-cat">{t.category}</span>
                <span className="trend-score">
                  <FontAwesomeIcon icon={faFire} style={{ color: "#F59E0B", marginRight: "0.3rem" }} />
                  {t.score}/100 Virality
                </span>
              </div>

              <h3 className="trend-title">{t.title}</h3>

              <div className="trend-stats">
                <span>{t.volume}</span>
                <span className="growth">
                  <FontAwesomeIcon icon={faArrowTrendUp} style={{ marginRight: "0.2rem" }} />
                  {t.growth}
                </span>
              </div>

              <div className="trend-prompt-box">
                <span className="box-label">Suggested AI Draft Angle:</span>
                <p className="prompt-text">"{t.samplePrompt}"</p>
              </div>

              <div className="trend-action">
                <Link to="/register" className="draft-btn">
                  <FontAwesomeIcon icon={faWandMagicSparkles} style={{ marginRight: "0.4rem" }} />
                  Draft Post from Trend
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
