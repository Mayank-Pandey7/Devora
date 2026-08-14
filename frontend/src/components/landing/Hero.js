import React from "react";
import { Play } from "lucide-react";

export default function Hero({ heroLogoRef, isTraveling }) {
  return (
    <section className="sap-hero-section">
      <div className="sap-hero-container">
        {/* Nixtio-Style Full Background Video Layer with Multi-Layer Cinematic Fade */}
        <div className="sap-hero-video-bg">
          <video
            src="/1393-147055573_medium.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="sap-bg-video"
          />
          {/* Nixtio Multi-Gradient Fade Layers */}
          <div className="sap-bg-video-overlay" />
          <div className="sap-video-bottom-fade" />
          <div className="sap-video-top-fade" />
        </div>

        {/* Hero Title Stage (Measurement Origin Anchor) */}
        <div className="universal-title-stage">
          <h1
            className="universal-hero-title"
            ref={heroLogoRef}
            style={{
              visibility: isTraveling ? "hidden" : "visible",
              color: "#ffffff"
            }}
          >
            DEVORA
          </h1>
        </div>

        <div className="sap-hero-wrapper">
          {/* Top spacer for navbar */}
          <div style={{ height: "60px" }} />

          {/* Bottom Floating Info Row */}
          <div className="sap-hero-bottom-grid">
            {/* Left Bottom Section: Developer Tagline & Subtext */}
            <div className="sap-hero-bottom-left">
              <div className="sap-avatar-stack">
                <div className="sap-avatars">
                  <div className="avatar-placeholder p1">AI</div>
                  <div className="avatar-placeholder p2">⚡</div>
                  <div className="avatar-placeholder p3" style={{ background: '#f5c842', color: '#1f2123', fontSize: '11px', fontWeight: 900 }}>DEV</div>
                </div>
                <div className="sap-avatar-info">
                  <span className="sap-stat-number">Build Better</span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600 }}>Interview smarter • Get hired</span>
                </div>
              </div>

              <p className="sap-hero-blurb">
                Your AI-powered developer career copilot for technical interview preparation, real-time mock rounds, and ATS resume optimization.
              </p>
            </div>

            {/* Right Bottom Section: Core Pillars & Quick Action Badge */}
            <div className="sap-hero-bottom-right">
              <div className="sap-feature-index-list">
                <div className="sap-index-item">
                  <span className="label">Mock Interviews</span>
                  <span className="num">/01</span>
                </div>
                <div className="sap-index-item">
                  <span className="label">ATS Resume Scanner</span>
                  <span className="num">/02</span>
                </div>
                <div className="sap-index-item">
                  <span className="label">Job Matcher</span>
                  <span className="num">/03</span>
                </div>
              </div>

              {/* Action Badge */}
              <a href="#interview-prep" className="sap-neon-play-btn">
                <div className="play-icon-row">
                  <Play size={15} fill="currentColor" />
                  <span>Explore Features</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
