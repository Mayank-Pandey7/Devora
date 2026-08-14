import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faStar, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect for solo creators and builders testing AI social content generation.",
    popular: false,
    ctaText: "Start Free",
    ctaLink: "/register",
    features: [
      "20 AI Generations per month",
      "Support for 4 Platforms (LinkedIn, X, IG, Threads)",
      "Basic Virality Scores",
      "Standard Analytics Dashboard",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    desc: "For active creators and founders scaling content reach across multiple channels.",
    popular: true,
    ctaText: "Get Pro Access",
    ctaLink: "/register",
    features: [
      "Unlimited AI Content Generations",
      "Gemini Pro 1.5 Synthesis Engine",
      "Full Queue Calendar & Scheduler",
      "Advanced Virality Scores & Virality Index",
      "Real-Time Trending Topics Discovery",
      "Export & Multi-Format Copying",
    ],
  },
  {
    name: "Business",
    price: "$49",
    period: "per month",
    desc: "For marketing teams and agencies managing multiple brand personas.",
    popular: false,
    ctaText: "Start Business Plan",
    ctaLink: "/register",
    features: [
      "Everything in Pro",
      "Multi-Brand Persona Support",
      "Team Collaboration & Approval Queues",
      "Custom Brand Voice Tuning",
      "Priority API Access & Support",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="sai-pricing-section">
      <div className="sai-section-container">
        <div className="sai-section-header">

          <h2 className="sai-section-title">Choose the way you want to grow.</h2>
          <p className="sai-section-sub">
            Start for free and upgrade as your audience and content workflow expand.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="pricing-grid">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`pricing-card ${plan.popular ? "popular" : ""}`}>
              {plan.popular && (
                <div className="popular-badge">
                  <FontAwesomeIcon icon={faStar} style={{ fontSize: "0.75rem", marginRight: "0.3rem" }} />
                  Most Popular
                </div>
              )}

              <div className="card-top">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-desc">{plan.desc}</p>
                <div className="price-row">
                  <span className="price-val">{plan.price}</span>
                  <span className="price-period">/ {plan.period}</span>
                </div>
              </div>

              <div className="card-cta">
                <Link
                  to={plan.ctaLink}
                  className={`plan-btn ${plan.popular ? "primary" : "outline"}`}
                >
                  {plan.ctaText} <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: "0.3rem" }} />
                </Link>
              </div>

              <div className="card-features-list">
                <span className="list-title">What's included:</span>
                <ul>
                  {plan.features.map((f) => (
                    <li key={f}>
                      <FontAwesomeIcon icon={faCheck} className="feature-check" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
