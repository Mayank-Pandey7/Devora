import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Menu, X } from "lucide-react";

export default function Navbar({ navLogoRef, isDocked, travelProgress = 0 }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Expanding brand slot width calculation
  const isBrandVisible = isDocked || travelProgress > 0.02;
  const brandOpacity = isDocked ? 1 : Math.min(1, Math.max(0, (travelProgress - 0.02) * 4));
  const slotWidth = isDocked ? "auto" : `${travelProgress * 150}px`;

  return (
    <header className={`sai-navbar-dock ${scrolled ? "scrolled" : ""}`}>
      <div className="sai-dock-container">
        {/* 1. LEFT SECTION: Standalone Brand / Logo Island (fades in as DEVORA travels) */}
        <div
          ref={navLogoRef}
          className={`sai-nav-island sai-brand-island ${isDocked ? "brand-docked" : ""}`}
          style={{
            width: isBrandVisible ? slotWidth : "0px",
            minWidth: isDocked ? "145px" : (isBrandVisible ? slotWidth : "0px"),
            opacity: brandOpacity,
            pointerEvents: isBrandVisible ? "auto" : "none",
            overflow: "hidden",
            display: "inline-flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "opacity 0.2s ease"
          }}
        >
          <Link to="/" className="sai-brand" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
            <img
              src="/logo.png"
              alt="Devora Logo"
              style={{
                opacity: isDocked ? 1 : 0,
                transform: isDocked ? "scale(1)" : "scale(0.5)",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                width: "36px",
                height: "36px",
                objectFit: "contain",
                flexShrink: 0
              }}
            />
            <span
              className="universal-hero-title nav-docked-title"
              style={{
                opacity: isDocked ? 1 : 0,
                fontSize: "1.5rem",
                letterSpacing: "0.03em",
                lineHeight: 1,
                margin: 0,
                padding: 0,
                display: "inline-block",
                transition: "opacity 0.15s ease",
                fontWeight: 900,
                color: "#1f2123",
                WebkitTextFillColor: "#1f2123"
              }}
            >
              DEVORA
            </span>
          </Link>
        </div>

        {/* 2. CENTER SECTION: Standalone Navigation Links Capsule */}
        <div className="sai-nav-island sai-links-island desktop-only">
          <a href="#interview-prep">Projects</a>
          <a href="#resume-analyzer">Resume ATS</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#ecosystem">Studio</a>
          <a href="#faq">FAQ</a>
        </div>

        {/* 3. RIGHT SECTION: Standalone Login & Get Started Island */}
        <div className="sai-nav-island sai-actions-island desktop-only">
          <Link to="/login" className="sai-login-btn">Sign In</Link>
          <Link to="/register" className="sai-get-started-btn">
            <span>Start Practice</span>
            <ArrowRight size={14} style={{ marginLeft: "0.35rem" }} />
          </Link>
        </div>

        {/* MOBILE HAMBURGER TOGGLE */}
        <div className="mobile-actions mobile-only">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sai-mobile-hamburger"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="sai-mobile-menu">
          <a href="#interview-prep" onClick={() => setMobileMenuOpen(false)}>Projects</a>
          <a href="#resume-analyzer" onClick={() => setMobileMenuOpen(false)}>Resume ATS</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
          <a href="#ecosystem" onClick={() => setMobileMenuOpen(false)}>Studio</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
          <div className="sai-mobile-menu-actions">
            <Link to="/login" className="sai-login-btn" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            <Link to="/register" className="sai-get-started-btn" onClick={() => setMobileMenuOpen(false)}>
              Start Practice
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
