import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCalendarCheck, faWandMagicSparkles, faChartLine } from "@fortawesome/free-solid-svg-icons";

const BENEFITS = [
  {
    title: "Save time",
    subtitle: "Go from idea to finished post faster",
    desc: "Draft platform-native content in 5 seconds instead of spending 3 hours wrestling with writer's block across multiple tabs.",
    icon: faClock,
    badge: "98% Time Saved",
  },
  {
    title: "Stay consistent",
    subtitle: "Keep your content workflow organized",
    desc: "Plan weeks of content in advance using our smart calendar queue. Keep your brand active without last-minute scrambling.",
    icon: faCalendarCheck,
    badge: "100% Calendar Coverage",
  },
  {
    title: "Create better",
    subtitle: "Use AI to improve every post",
    desc: "Synthesize high-converting hooks, optimize line breaks, and check virality scores before you hit publish.",
    icon: faWandMagicSparkles,
    badge: "98/100 Virality Index",
  },
  {
    title: "Understand your audience",
    subtitle: "Use analytics to make better decisions",
    desc: "Track real engagement rates, organic reach trends, and audience response so you can double down on what works.",
    icon: faChartLine,
    badge: "Clear Metrics",
  },
];

export default function Benefits() {
  return (
    <section className="sai-benefits-section">
      <div className="sai-section-container">
        <div className="sai-section-header">

          <h2 className="sai-section-title">Why NEYRIX AI?</h2>
          <p className="sai-section-sub">
            Designed from the ground up to give creators, marketers, and founders unfair leverage.
          </p>
        </div>

        {/* 4 Large Editorial Benefit Cards */}
        <div className="benefits-editorial-grid">
          {BENEFITS.map((b) => (
            <div key={b.title} className="benefit-editorial-card">
              <div className="benefit-card-top">
                <div className="benefit-icon-box">
                  <FontAwesomeIcon icon={b.icon} />
                </div>
                <span className="benefit-badge">{b.badge}</span>
              </div>

              <h3 className="benefit-title">{b.title}</h3>
              <h4 className="benefit-subtitle">{b.subtitle}</h4>
              <p className="benefit-desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
