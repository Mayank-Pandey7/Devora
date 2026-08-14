import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faRocket, faBuilding, faCode } from "@fortawesome/free-solid-svg-icons";

const STORIES = [
  {
    category: "Content Creator",
    title: "Scale from 1 to 5 platforms without burn out",
    desc: "Turn raw video notes or blog outlines into platform-native posts for X, LinkedIn, Instagram, and Threads in seconds.",
    icon: faUsers,
    stats: "3.5x More Weekly Posts",
    tag: "Solo Creators",
    solidColor: "#1E1B4B",
    borderColor: "#4338CA",
    accentTextColor: "#A5B4FC",
    badgeBg: "#312E81",
  },
  {
    category: "Growing Startup",
    title: "Build in public and drive organic leads",
    desc: "Maintain a daily founder log, share product milestones, and analyze which feature launches drive the most reach.",
    icon: faRocket,
    stats: "+142% Organic Traffic",
    tag: "SaaS & Tech",
    solidColor: "#064E3B",
    borderColor: "#059669",
    accentTextColor: "#6EE7B7",
    badgeBg: "#065F46",
  },
  {
    category: "Marketing Agency",
    title: "Manage multi-brand social calendars seamlessly",
    desc: "Draft content variations for distinct brand voices, organize post queues, and report engagement metrics to clients.",
    icon: faBuilding,
    stats: "15+ Hours Saved / Week",
    tag: "Agencies",
    solidColor: "#78350F",
    borderColor: "#D97706",
    accentTextColor: "#FCD34D",
    badgeBg: "#92400E",
  },
  {
    category: "Developer / Founder",
    title: "Transform code updates into viral dev hot takes",
    desc: "Convert commit logs, technical architectural decisions, and dev humor into engaging tech threads that attract top talent.",
    icon: faCode,
    stats: "98/100 Viral Index",
    tag: "Dev Founders",
    solidColor: "#581C87",
    borderColor: "#9333EA",
    accentTextColor: "#E9D5FF",
    badgeBg: "#6B21A8",
  },
];

export default function Stories() {
  return (
    <section className="sai-stories-section">
      <div className="sai-stories-container">
        <div className="sai-section-header">

          <h2 className="sai-section-title">Built for creators, teams, and businesses like yours.</h2>
          <p className="sai-section-sub">
            Discover how NEYRIX AI simplifies content creation and audience growth across every industry.
          </p>
        </div>

        {/* Story Cards Grid with Solid Eye-Catching Colors */}
        <div className="sai-stories-grid">
          {STORIES.map((story) => (
            <div
              key={story.category}
              className="sai-story-card"
              style={{
                backgroundColor: story.solidColor,
                border: `2px solid ${story.borderColor}`,
                color: "#FFFFFF",
              }}
            >
              <div className="story-card-top">
                <div className="story-icon" style={{ backgroundColor: story.badgeBg, color: story.accentTextColor, border: `1px solid ${story.borderColor}` }}>
                  <FontAwesomeIcon icon={story.icon} />
                </div>
                <span className="story-tag" style={{ backgroundColor: story.badgeBg, color: story.accentTextColor, padding: "0.25rem 0.65rem", borderRadius: "12px", border: `1px solid ${story.borderColor}` }}>{story.tag}</span>
              </div>

              <span className="story-category" style={{ color: story.accentTextColor }}>{story.category}</span>
              <h3 className="story-title" style={{ color: "#FFFFFF" }}>{story.title}</h3>
              <p className="story-desc" style={{ color: "#E4E4E7" }}>{story.desc}</p>

              <div className="story-card-bottom" style={{ borderColor: story.borderColor }}>
                <span className="story-stats" style={{ color: story.accentTextColor }}>⚡ {story.stats}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
