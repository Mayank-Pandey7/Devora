import React, { useState, useEffect, useRef, useCallback } from "react";
// Devora Landing Page with smooth 60fps logo travel animation
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import InterviewShowcase from "../components/landing/InterviewShowcase";
import ResumeShowcase from "../components/landing/ResumeShowcase";
import TechEcosystem from "../components/landing/TechEcosystem";
import HowItWorks from "../components/landing/HowItWorks";
import FAQ from "../components/landing/FAQ";
import FinalCTA from "../components/landing/FinalCTA";
import Footer from "../components/landing/Footer";

export default function HomePage() {
  const [isTraveling, setIsTraveling] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [travelProgress, setTravelProgress] = useState(0);

  const heroLogoRef = useRef(null);
  const navLogoRef = useRef(null);
  const travelLogoRef = useRef(null);

  const isTravelingRef = useRef(false);
  const isDockedRef = useRef(false);
  const isUpdatingRef = useRef(false);

  const updateLogoAnimation = useCallback(() => {
    if (!heroLogoRef.current || !navLogoRef.current) return;

    const heroRect = heroLogoRef.current.getBoundingClientRect();
    const navRect = navLogoRef.current.getBoundingClientRect();

    const scrollY = window.scrollY;
    // Fluid responsive scroll threshold
    const threshold = Math.max(380, Math.min(520, window.innerHeight * 0.55));

    const rawProgress = Math.min(1, Math.max(0, scrollY / threshold));
    // Butter-smooth cubic ease out
    const p = 1 - Math.pow(1 - rawProgress, 2.5);

    const currentlyTraveling = rawProgress > 0.005 && rawProgress < 0.98;
    const currentlyDocked = rawProgress >= 0.98;

    // Throttle React state updates to prevent re-render layout jitter during scroll
    if (isTravelingRef.current !== (rawProgress > 0.005)) {
      isTravelingRef.current = rawProgress > 0.005;
      setIsTraveling(rawProgress > 0.005);
    }

    if (isDockedRef.current !== currentlyDocked) {
      isDockedRef.current = currentlyDocked;
      setIsDocked(currentlyDocked);
      setTravelProgress(currentlyDocked ? 1 : p);
    } else if (!currentlyDocked) {
      setTravelProgress(p);
    }

    if (travelLogoRef.current) {
      // Gentle parabolic arc lift
      const arcLift = Math.sin(p * Math.PI) * -18;

      // Start coordinates (Hero title viewport center)
      const startX = heroRect.left + heroRect.width / 2;
      const startY = heroRect.top + heroRect.height / 2;

      // Target coordinates (Navbar logo text center)
      // Logo image is 36px wide + 10px gap + half of text width (~50px) = +96px from navRect.left
      const targetX = navRect.left + 96;
      const targetY = navRect.top + navRect.height / 2;

      // Smooth curved arc coordinates (X, Y)
      const currentX = startX + (targetX - startX) * p;
      const currentY = startY + (targetY - startY) * p + arcLift;

      // Font size scaling: from Hero size down to Navbar docked font size (23.2px / 1.45rem)
      const heroFontSize = parseFloat(window.getComputedStyle(heroLogoRef.current).fontSize) || 120;
      const targetFontSize = 23.2;
      const currentFontSize = heroFontSize + (targetFontSize - heroFontSize) * p;

      // Smoothly blend color from pure white #ffffff to dark obsidian #1f2123
      const r = Math.round(255 - (255 - 31) * Math.pow(p, 0.6));
      const g = Math.round(255 - (255 - 33) * Math.pow(p, 0.6));
      const b = Math.round(255 - (255 - 35) * Math.pow(p, 0.6));
      const colorRgb = `rgb(${r}, ${g}, ${b})`;

      // Direct zero-jitter GPU compositor style updates
      const style = travelLogoRef.current.style;
      style.position = "fixed";
      style.left = `${currentX}px`;
      style.top = `${currentY}px`;
      style.transform = "translate3d(-50%, -50%, 0)";
      style.fontSize = `${currentFontSize}px`;
      style.fontWeight = "900";
      style.fontFamily = "'Space Grotesk', -apple-system, sans-serif";
      style.letterSpacing = "0.03em";
      style.lineHeight = "1";
      style.color = colorRgb;
      style.textTransform = "uppercase";
      style.whiteSpace = "nowrap";
      style.zIndex = "120";
      style.pointerEvents = "none";
      style.opacity = currentlyTraveling ? "1" : "0";
      style.background = "none";
      style.webkitTextFillColor = colorRgb;
      style.filter = `drop-shadow(0 ${12 - 10 * p}px ${25 - 20 * p}px rgba(0, 0, 0, ${0.85 - 0.65 * p}))`;
    }
  }, []);

  useEffect(() => {
    let animationFrameId;

    const onScrollOrResize = () => {
      if (!isUpdatingRef.current) {
        isUpdatingRef.current = true;
        animationFrameId = requestAnimationFrame(() => {
          updateLogoAnimation();
          isUpdatingRef.current = false;
        });
      }
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    updateLogoAnimation();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [updateLogoAnimation]);

  return (
    <div className="devora-landing-page">
      <Navbar navLogoRef={navLogoRef} isDocked={isDocked} travelProgress={travelProgress} />

      {/* Dynamic Zero-Jitter Scroll-Linked Traveling Logo Element */}
      <h1 className="universal-hero-title devora-traveling-logo" ref={travelLogoRef}>
        DEVORA
      </h1>

      <main className="devora-landing-content">
        <Hero heroLogoRef={heroLogoRef} isTraveling={isTraveling} />
        <InterviewShowcase />
        <ResumeShowcase />
        <TechEcosystem />
        <HowItWorks />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />

      {/* ─── DEVORA DASHBOARD WARM CHAMPAGNE & PORCELAIN DESIGN SYSTEM ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,200..900;1,200..900&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Playpen+Sans:wght@100..800&family=Space+Grotesk:wght@500;600;700;900&display=swap');

        :root, body, body.light, body.light-mode, body.dark, body.dark-mode {
          --sai-bg: linear-gradient(145deg, #eef0f3 0%, #f6f5f1 35%, #faf6e9 70%, #fef3cf 100%) !important;
          --sai-bg-solid: #f6f5f1 !important;
          --sai-dark-bg: #f6f5f1 !important;
          --sai-dark-card: #ffffff !important;
          --sai-text-primary: #1f2123 !important;
          --sai-text-secondary: #374151 !important;
          --sai-text-muted: #4b5563 !important;
          --sai-accent: #1f2123;
          --sai-accent-hover: #000000;
          --sai-accent-gold: #f5c842;
          --sai-accent-soft: rgba(245, 200, 66, 0.15);
          --sai-border: rgba(0, 0, 0, 0.06);
          --sai-dark-border: rgba(0, 0, 0, 0.06);
          --sai-font-sans: 'Playpen Sans', cursive, sans-serif;
          --sai-font-display: 'Libre Caslon Text', 'Crimson Pro', Georgia, serif;
          color: #1f2123 !important;
        }

        .devora-landing-page {
          background: linear-gradient(145deg, #eef0f3 0%, #f6f5f1 35%, #faf6e9 70%, #fef3cf 100%) !important;
          color: #1f2123 !important;
          min-height: 100vh;
          font-family: var(--sai-font-sans);
        }

        .devora-landing-content {
          background: transparent !important;
        }

        body.light, body.light-mode {
          --sai-bg: #ffffff;
          --sai-bg-alt: #f8fafc;
          --sai-text-primary: #111827;
          --sai-text-secondary: #4b5563;
          --sai-text-muted: #6b7280;
          --sai-border: #e5e7eb;
          --sai-hero-tint: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.6) 40%, transparent 75%);
        }

        .neyrix-landing-page {
          background-color: var(--sai-bg);
          color: var(--sai-text-primary);
          font-family: var(--sai-font-sans);
          min-height: 100vh;
          overflow-x: hidden;
          line-height: 1.5;
        }

        /* Common Container & Section Spacing */
        .sai-section-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .sai-section-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 4rem;
        }

        .sai-eyebrow {
          display: inline-block;
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--sai-accent);
          background: rgba(109, 93, 251, 0.1);
          padding: 0.35rem 0.9rem;
          border-radius: 20px;
          margin-bottom: 1rem;
          border: 1px solid rgba(109, 93, 251, 0.2);
        }

        .sai-section-title {
          font-family: var(--sai-font-display);
          font-size: clamp(2.2rem, 4vw, 3.4rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.025em;
          color: var(--sai-text-primary);
          margin-bottom: 1rem;
        }

        .sai-section-title.text-left { text-align: left; }

        .sai-section-sub {
          font-size: 1.1rem;
          color: var(--sai-text-secondary);
          line-height: 1.65;
          margin: 0 auto;
        }

        .sai-section-sub.text-left { text-align: left; margin: 0; }

        /* Buttons */
        .sai-btn-primary {
          display: inline-flex;
          align-items: center;
          background: var(--sai-accent);
          color: #ffffff;
          padding: 0.85rem 1.75rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 8px 20px rgba(109, 93, 251, 0.25);
        }

        .sai-btn-primary:hover {
          background: var(--sai-accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(109, 93, 251, 0.35);
        }

        .sai-btn-primary-large {
          display: inline-flex;
          align-items: center;
          background: var(--sai-accent);
          color: #ffffff;
          padding: 1.1rem 2.5rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.05rem;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 12px 30px rgba(109, 93, 251, 0.3);
        }

        .sai-btn-primary-large:hover {
          background: var(--sai-accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 16px 35px rgba(109, 93, 251, 0.45);
        }

        .sai-btn-outline-large {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 1.1rem 2.2rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1.05rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .sai-btn-outline-large:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .sai-btn-outline-small {
          display: inline-flex;
          align-items: center;
          background: transparent;
          border: 1px solid var(--sai-border);
          color: var(--sai-text-primary);
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.88rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .sai-btn-outline-small:hover {
          border-color: var(--sai-accent);
          color: var(--sai-accent);
        }

        /* ── 1. NIXTIO-STYLE 3-ISLAND FLOATING NAVBAR DOCK (NO WHITE BORDER) ── */
        .sai-navbar-dock {
          position: fixed;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 2.5rem);
          max-width: 1280px;
          z-index: 100;
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sai-dock-container {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .sai-nav-island {
          pointer-events: auto;
          background: rgba(10, 11, 14, 0.92) !important;
          backdrop-filter: blur(20px) saturate(190%) !important;
          -webkit-backdrop-filter: blur(20px) saturate(190%) !important;
          border: none !important;
          border-radius: 40px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45) !important;
          display: flex;
          align-items: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sai-brand-island {
          height: 52px;
          padding: 0 1.25rem 0 0.85rem;
        }

        .sai-brand-island.brand-docked {
          background: rgba(255, 255, 255, 0.94) !important;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08) !important;
        }

        .sai-brand-island.brand-docked .nav-docked-title {
          color: #1f2123 !important;
          -webkit-text-fill-color: #1f2123 !important;
        }

        /* Dead-Center Absolute Positioning for Links Capsule */
        .sai-links-island {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          height: 52px;
          padding: 0 2.2rem;
          gap: 2.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sai-actions-island {
          height: 52px;
          padding: 4px 6px 4px 1.25rem;
          gap: 0.85rem;
          margin-left: auto;
        }

        .sai-brand-name {
          font-family: 'Space Grotesk', var(--sai-font-sans);
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: -0.02em;
          color: #ffffff !important;
        }

        .sai-links-island a {
          color: rgba(255, 255, 255, 0.85) !important;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.025em;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .sai-links-island a:hover {
          color: #ffffff !important;
          letter-spacing: 0.035em;
        }

        .sai-login-btn {
          color: #ffffff !important;
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 700;
          padding: 0.4rem 0.6rem;
          transition: color 0.2s ease;
        }

        .sai-login-btn:hover {
          color: #f5c842 !important;
        }

        .sai-get-started-btn {
          background: #f5c842 !important;
          color: #1f2123 !important;
          border-radius: 30px !important;
          font-weight: 800 !important;
          font-size: 0.88rem;
          padding: 0.55rem 1.4rem !important;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
          box-shadow: 0 8px 25px rgba(245, 200, 66, 0.4) !important;
          cursor: pointer;
        }

        .sai-get-started-btn:hover {
          background: #fcd34d !important;
          color: #0f172a !important;
          transform: scale(1.08) rotate(2deg) translateY(-1px) !important;
          box-shadow: 0 14px 40px rgba(245, 200, 66, 0.6) !important;
        }

        .sai-get-started-btn svg {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .sai-get-started-btn:hover svg {
          transform: translateX(4px);
        }

        /* Scrolled State Across the 3 Islands */
        .sai-navbar-dock.scrolled {
          top: 12px;
        }

        .sai-navbar-dock.scrolled .sai-nav-island {
          background: rgba(255, 255, 255, 0.94) !important;
          border: none !important;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06) !important;
        }

        .sai-navbar-dock.scrolled .sai-brand-name {
          color: #1f2123 !important;
        }

        .sai-navbar-dock.scrolled .sai-links-island a {
          color: #5b5e64 !important;
        }

        .sai-navbar-dock.scrolled .sai-links-island a:hover {
          color: #1f2123 !important;
        }

        .sai-navbar-dock.scrolled .sai-login-btn {
          color: #1f2123 !important;
        }

        .sai-navbar-dock.scrolled .sai-get-started-btn {
          background: #f5c842 !important;
          color: #1f2123 !important;
          box-shadow: 0 8px 25px rgba(245, 200, 66, 0.35) !important;
        }

        .sai-navbar-dock.scrolled .sai-get-started-btn:hover {
          background: #fcd34d !important;
          transform: scale(1.08) rotate(2deg) translateY(-1px) !important;
          box-shadow: 0 14px 40px rgba(245, 200, 66, 0.6) !important;
        }

        .sai-mobile-hamburger {
          pointer-events: auto;
          background: rgba(10, 11, 14, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: none;
          color: #ffffff;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(0,0,0,0.4);
        }

        .sai-navbar-dock.scrolled .sai-mobile-hamburger {
          background: rgba(255, 255, 255, 0.94);
          color: #1f2123;
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
        }

        .sai-mobile-menu {
          pointer-events: auto;
          position: absolute;
          top: 65px; left: 0; right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: none;
          border-radius: 24px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          box-shadow: 0 20px 45px rgba(0,0,0,0.12);
        }

        body.dark .sai-mobile-menu, body.dark-mode .sai-mobile-menu {
          background: rgba(15, 23, 42, 0.85);
          border-color: rgba(255, 255, 255, 0.16);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.15);
        }

        .sai-mobile-menu a {
          color: var(--sai-text-primary);
          text-decoration: none;
          font-size: 1rem;
          font-weight: 600;
        }

        .mobile-btn-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .sai-mobile-login, .sai-mobile-start {
          text-align: center;
          padding: 0.8rem;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
        }

        .sai-mobile-login { border: 1px solid var(--sai-border); color: var(--sai-text-primary); }
        .sai-mobile-start { background: var(--sai-accent); color: #fff; }

        .desktop-only { display: flex; }
        .mobile-only { display: none; }

        @media (max-width: 992px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; align-items: center; gap: 0.75rem; }
        }

        /* ── NAVBAR MOBILE RESPONSIVENESS ── */
        @media (max-width: 768px) {
          .sai-navbar {
            width: calc(100% - 1.25rem) !important;
            height: 56px !important;
            top: 10px !important;
            padding: 0 0.85rem !important;
          }

          .nav-docked-title {
            font-size: clamp(1.2rem, 5.2vw, 1.6rem) !important;
          }

          .sai-mobile-menu {
            position: fixed !important;
            top: 72px !important;
            width: calc(100% - 1.25rem) !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            background: rgba(10, 10, 15, 0.92) !important;
            backdrop-filter: blur(20px) saturate(180%) !important;
            -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            border-radius: 20px !important;
            padding: 1.25rem !important;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7) !important;
            z-index: 110 !important;
          }

          .sai-mobile-menu a {
            color: #ffffff !important;
            font-size: 1.05rem !important;
            font-weight: 600 !important;
            padding: 0.4rem 0 !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
          }

          .sai-mobile-menu-actions {
            display: flex !important;
            gap: 0.75rem !important;
            margin-top: 0.5rem !important;
          }

          .sai-mobile-menu-actions .sai-login-btn {
            flex: 1 !important;
            text-align: center !important;
            border: 1px solid rgba(255, 255, 255, 0.25) !important;
            border-radius: 25px !important;
            color: #ffffff !important;
            padding: 0.6rem !important;
          }

          .sai-mobile-menu-actions .sai-get-started-btn {
            flex: 1 !important;
            text-align: center !important;
            justify-content: center !important;
            padding: 0.6rem !important;
          }
        }

        @media (max-width: 480px) {
          .sai-navbar {
            width: calc(100% - 0.85rem) !important;
            height: 52px !important;
            padding: 0 0.65rem !important;
          }

          .nav-docked-title {
            font-size: clamp(1.1rem, 5vw, 1.4rem) !important;
          }

          .sai-mobile-hamburger {
            width: 34px !important;
            height: 34px !important;
            font-size: 0.95rem !important;
          }

          .sai-theme-toggle-btn {
            width: 34px !important;
            height: 34px !important;
          }
        }

        /* ── 2. FULL-BLEED HERO WITH CURVED BOTTOM BORDER ── */
        .sap-hero-section {
          padding: 0 !important;
          margin: 0 !important;
          min-height: 100vh;
          height: 100vh;
          width: 100%;
          position: relative;
          background: #000000 !important;
          background-color: #000000 !important;
          color: #ffffff !important;
          overflow: hidden;
          box-sizing: border-box;
          display: flex;
          border-radius: 0 0 44px 44px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.28);
          z-index: 5;
        }

        .sap-hero-container {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 0 0 44px 44px !important;
          overflow: hidden;
          background: #000000;
          border: none !important;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .sap-hero-video-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          background: #000000 !important;
        }

        .sap-bg-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center 52%;
          filter: brightness(1.05) saturate(1.15) contrast(1.05);
          transform: scale(0.82) translateY(1%);
          transform-origin: center center;
        }

        /* Ambient Radial Vignette (keeps zoomed out Earth 100% bright and clear) */
        .sap-bg-video-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: radial-gradient(ellipse at 50% 52%, transparent 42%, rgba(6, 7, 9, 0.4) 70%, rgba(6, 7, 9, 0.95) 100%) !important;
        }

        /* Smooth Bottom Edge Video Fade */
        .sap-video-bottom-fade {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 35%;
          z-index: 2;
          pointer-events: none;
          background: linear-gradient(to top, rgba(6, 7, 9, 0.95) 0%, rgba(6, 7, 9, 0.5) 45%, transparent 100%) !important;
        }

        /* Top Navbar Vignette */
        .sap-video-top-fade {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 20%;
          z-index: 2;
          pointer-events: none;
          background: linear-gradient(to bottom, rgba(6, 7, 9, 0.55) 0%, transparent 100%) !important;
        }

        /* Earth Horizon Atmosphere Lighting Beam */
        .sap-earth-horizon-glow {
          display: none;
        }

        /* ── CLEAN METALLIC WHITE TITLE (NO 3D BEVELS OR TILTS) ── */
        .universal-title-stage {
          position: absolute;
          top: 56%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          width: 100%;
          text-align: center;
          pointer-events: none;
        }

        .universal-hero-title {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          font-weight: 900;
          font-size: clamp(3.4rem, 11.5vw, 10.5rem);
          letter-spacing: 0.03em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 0;
          user-select: none;
          color: #ffffff;
          background: none !important;
          background-color: transparent !important;
          -webkit-text-fill-color: #ffffff;
          filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.95));
        }

        .universal-hero-title.devora-traveling-logo {
          color: unset !important;
          -webkit-text-fill-color: unset !important;
          will-change: transform, left, top, font-size, color, filter;
        }

        .universal-hero-title.nav-docked-title {
          color: #1f2123 !important;
          -webkit-text-fill-color: #1f2123 !important;
          filter: none !important;
        }

        .universal-hero-title .char {
          display: inline-block;
          transform: none !important;
        }

        .sap-hero-wrapper {
          position: relative;
          z-index: 3;
          width: 100%;
          height: 100%;
          max-width: 1320px;
          margin: 0 auto;
          padding: 1.5rem 2rem 2.25rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
        }

        .sap-hero-bottom-grid {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          width: 100%;
          gap: 2rem;
        }

        .sap-hero-big-title {
          font-family: 'Space Grotesk', -apple-system, sans-serif;
          font-weight: 900;
          font-size: clamp(4.8rem, 16.5vw, 15rem);
          letter-spacing: -0.04em;
          text-transform: uppercase;
          line-height: 0.82;
          margin-top: 1rem;
          margin-bottom: 0;
          z-index: 3;
          text-align: center;
          width: 100%;
          user-select: none;
          background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.95) 60%, rgba(140, 133, 255, 0.85) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.95));
        }

        body.light .sap-hero-big-title,
        body.dark .sap-hero-big-title,
        body.dark-mode .sap-hero-big-title {
          background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.95) 60%, rgba(140, 133, 255, 0.85) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sap-center-3d-stage {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 640px;
          height: 220px;
          margin: 2rem auto 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateY(50px);
        }

        /* Floating Transparent Video Wrapper (No Box Border, Increased Size) */
        .sap-free-video-wrapper {
          position: relative;
          width: 560px;
          height: 400px;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: sapFloat 6s ease-in-out infinite alternate;
        }

        @keyframes sapFloat {
          0% { transform: translateY(0px) rotate(-1deg); }
          100% { transform: translateY(-16px) rotate(1deg); }
        }

        .sap-free-video-element {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.45));
        }

        /* 360° Orbital Metallic & Neon Wire Rings */
        .sap-orbital-ring {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 3;
        }

        .sap-orbital-ring.ring-silver-1 {
          width: 640px;
          height: 230px;
          border: 2px solid rgba(71, 85, 105, 0.4);
          transform: rotate(-18deg);
        }

        body.dark .sap-orbital-ring.ring-silver-1, body.dark-mode .sap-orbital-ring.ring-silver-1 {
          border-color: rgba(255, 255, 255, 0.6);
        }

        .sap-orbital-ring.ring-neon-2 {
          width: 680px;
          height: 250px;
          border: 2.5px solid #a3e635;
          transform: rotate(24deg);
          box-shadow: 0 0 25px rgba(163, 230, 53, 0.5);
        }

        .sap-orbital-ring.ring-silver-3 {
          width: 600px;
          height: 210px;
          border: 1.5px dashed rgba(100, 116, 139, 0.4);
          transform: rotate(-5deg);
        }

        body.dark .sap-orbital-ring.ring-silver-3, body.dark-mode .sap-orbital-ring.ring-silver-3 {
          border-color: rgba(255, 255, 255, 0.35);
        }

        .sap-hero-bottom-left {
          max-width: 440px;
          z-index: 6;
          text-align: left;
        }

        .sap-avatar-stack {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .sap-avatars {
          display: flex;
          align-items: center;
        }

        .avatar-img, .avatar-placeholder {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid #000000;
          object-fit: cover;
          margin-left: -8px;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-img:first-child {
          margin-left: 0;
        }

        .avatar-placeholder.p1 {
          background: #1f2123;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .avatar-placeholder.p2 {
          background: #f5c842;
          color: #1f2123;
        }

        .sap-avatar-info {
          display: flex;
          flex-direction: column;
        }

        .sap-stat-number {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 1.15rem;
          color: #ffffff !important;
          line-height: 1.1;
        }

        .sap-stat-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7) !important;
        }

        .sap-hero-blurb {
          font-size: 0.88rem;
          color: rgba(255, 255, 255, 0.8) !important;
          line-height: 1.5;
          margin: 0;
        }

        .sap-hero-bottom-right {
          display: flex;
          align-items: flex-end;
          gap: 2rem;
          z-index: 6;
        }

        .sap-feature-index-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          text-align: right;
        }

        .sap-index-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85) !important;
        }

        .sap-index-item .num {
          font-size: 0.75rem;
          color: #f5c842;
          font-weight: 800;
          font-family: 'Space Grotesk', monospace;
        }

        .sap-neon-play-btn {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: #f5c842;
          color: #1f2123;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.85rem;
          text-decoration: none;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 10px 30px rgba(245, 200, 66, 0.35);
          cursor: pointer;
          flex-shrink: 0;
        }

        .sap-neon-play-btn .play-icon-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .sap-neon-play-btn:hover {
          transform: scale(1.08) rotate(5deg);
          box-shadow: 0 15px 45px rgba(245, 200, 66, 0.55);
        }

        /* ── MOBILE & TABLET RESPONSIVENESS OVERRIDES ── */
        @media (max-width: 1024px) {
          .universal-hero-title {
            font-size: clamp(3rem, 13vw, 8rem) !important;
            letter-spacing: 0.04em !important;
          }
          
          .sap-hero-wrapper {
            padding-bottom: 1.5rem;
            justify-content: flex-end;
          }

          .sap-hero-bottom-left {
            position: relative !important;
            bottom: auto !important;
            left: auto !important;
            max-width: 100% !important;
            align-items: center !important;
            text-align: center !important;
            margin-top: 1.25rem !important;
            display: flex !important;
            flex-direction: column !important;
          }

          .sap-hero-bottom-right {
            position: relative !important;
            bottom: auto !important;
            right: auto !important;
            align-items: center !important;
            text-align: center !important;
            margin-top: 1rem !important;
          }

          .sap-feature-index-list {
            flex-direction: row !important;
            justify-content: center !important;
            gap: 1.25rem !important;
            text-align: center !important;
          }

          .sap-neon-play-btn {
            width: 110px !important;
            height: 110px !important;
            font-size: 0.78rem !important;
          }
        }

        @media (max-width: 640px) {
          .sai-navbar {
            width: calc(100% - 1.2rem) !important;
            height: 56px !important;
            padding: 0 0.85rem !important;
            top: 10px !important;
          }

          .sai-brand-name {
            font-size: 1.1rem !important;
          }

          .universal-hero-title {
            font-size: clamp(2.2rem, 13.5vw, 4.8rem) !important;
          }

          .sap-hero-section {
            padding: 5.5rem 1rem 1.5rem !important;
            min-height: 100vh !important;
          }

          .sap-hero-blurb {
            font-size: 0.82rem !important;
            max-width: 280px !important;
            margin: 0 auto !important;
          }

          .sap-neon-play-btn {
            width: 95px !important;
            height: 95px !important;
            font-size: 0.72rem !important;
          }
        }

        .sap-hero-bottom-left {
          position: absolute;
          bottom: 1rem;
          left: 0;
          max-width: 320px;
          z-index: 6;
          text-align: left;
        }

        .sap-avatar-stack {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .sap-avatars {
          display: flex;
          align-items: center;
        }

        .avatar-img, .avatar-placeholder {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 2px solid var(--bg-primary, #000000);
          object-fit: cover;
          margin-left: -10px;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-img:first-child {
          margin-left: 0;
        }

        .avatar-placeholder.p1 {
          background: #6d5dfb;
          color: #ffffff;
        }

        .avatar-placeholder.p2 {
          background: #0d9488;
          color: #ffffff;
        }

        .sap-avatar-info {
          display: flex;
          flex-direction: column;
        }

        .sap-stat-number {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 1.25rem;
          color: var(--text-primary, #ffffff);
          line-height: 1;
        }

        .sap-stat-label {
          font-size: 0.75rem;
          color: var(--text-muted, #71717a);
        }

        .sap-hero-blurb {
          font-size: 0.88rem;
          color: var(--text-secondary, #a1a1aa);
          line-height: 1.5;
          margin: 0;
        }

        .sap-blurb-underline {
          width: 100%;
          height: 1px;
          background: repeating-linear-gradient(90deg, var(--text-muted, #71717a) 0 4px, transparent 4px 8px);
          margin-top: 0.8rem;
        }

        .sap-hero-bottom-right {
          position: absolute;
          bottom: 1rem;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1.5rem;
          z-index: 6;
        }

        .sap-feature-index-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          text-align: right;
        }

        .sap-index-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary, #a1a1aa);
        }

        .sap-index-item .num {
          font-size: 0.75rem;
          color: var(--text-muted, #71717a);
          font-family: monospace;
        }

        .sap-neon-play-btn {
          width: 145px;
          height: 145px;
          border-radius: 50%;
          background: #d9f99d;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
          text-decoration: none;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 12px 35px rgba(217, 249, 157, 0.45);
          cursor: pointer;
        }

        .sap-neon-play-btn .play-icon-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .sap-neon-play-btn:hover {
          transform: scale(1.1) rotate(6deg);
          box-shadow: 0 18px 50px rgba(217, 249, 157, 0.65);
        }

        @media (max-width: 1024px) {
          .sap-hero-bottom-left, .sap-hero-bottom-right {
            position: relative;
            bottom: auto;
            left: auto;
            right: auto;
            max-width: 100%;
            align-items: center;
            text-align: center;
            margin-top: 1.5rem;
          }
          .sap-feature-index-list { text-align: center; }
          .sap-hero-big-title { margin-bottom: -2.5rem; }
          .sap-3d-orb-wrapper { width: 260px; height: 260px; }
          .sap-orbital-ring.ring-silver-1 { width: 380px; height: 160px; }
          .sap-orbital-ring.ring-neon-2 { width: 400px; height: 170px; }
        }

        .sap-hero-bottom-left {
          position: absolute;
          bottom: 1rem;
          left: 0;
          max-width: 320px;
          z-index: 3;
          text-align: left;
        }

        .sap-avatar-stack {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .sap-avatars {
          display: flex;
          align-items: center;
        }

        .avatar-img, .avatar-placeholder {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 2px solid var(--bg-primary, #000000);
          object-fit: cover;
          margin-left: -10px;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-img:first-child {
          margin-left: 0;
        }

        .avatar-placeholder.p1 {
          background: #6d5dfb;
          color: #ffffff;
        }

        .avatar-placeholder.p2 {
          background: #0d9488;
          color: #ffffff;
        }

        .sap-avatar-info {
          display: flex;
          flex-direction: column;
        }

        .sap-stat-number {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 800;
          font-size: 1.2rem;
          color: var(--text-primary, #ffffff);
          line-height: 1;
        }

        .sap-stat-label {
          font-size: 0.75rem;
          color: var(--text-muted, #71717a);
        }

        .sap-hero-blurb {
          font-size: 0.9rem;
          color: var(--text-secondary, #a1a1aa);
          line-height: 1.5;
          margin: 0;
        }

        .sap-hero-bottom-right {
          position: absolute;
          bottom: 1rem;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1.5rem;
          z-index: 3;
        }

        .sap-feature-index-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          text-align: right;
        }

        .sap-index-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary, #a1a1aa);
        }

        .sap-index-item .num {
          font-size: 0.75rem;
          color: var(--text-muted, #71717a);
          font-family: monospace;
        }

        .sap-play-badge {
          width: 125px;
          height: 125px;
          border-radius: 50%;
          background: #d9f99d;
          color: #0f172a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          font-weight: 700;
          font-size: 0.8rem;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 10px 30px rgba(217, 249, 157, 0.35);
          cursor: pointer;
        }

        .sap-play-badge:hover {
          transform: scale(1.08) rotate(5deg);
          box-shadow: 0 15px 40px rgba(217, 249, 157, 0.5);
        }

        @media (max-width: 1024px) {
          .sap-hero-bottom-left, .sap-hero-bottom-right {
            position: relative;
            bottom: auto;
            left: auto;
            right: auto;
            max-width: 100%;
            align-items: center;
            text-align: center;
            margin-top: 1.5rem;
          }
          .sap-feature-index-list { text-align: center; }
          .sap-hero-big-title { margin-bottom: -2rem; }
          .sap-video-card { height: 280px; }
        }

        .sai-hero-trust-subtext {
          font-size: 0.88rem;
          color: var(--sai-text-muted);
          font-weight: 500;
        }

        .sai-hero-trust-subtext .check-icon {
          color: #10b981;
          font-weight: 700;
          margin-right: 0.3rem;
        }

        /* ── 3. HERO PRODUCT VISUAL MOCKUP ── */
        .sai-product-preview-section {
          padding: 2rem 1.5rem 7rem;
        }

        .sai-preview-wrapper {
          max-width: 1140px;
          margin: 0 auto;
          position: relative;
        }

        .sai-mock-window {
          background: var(--sai-dark-bg);
          border: 1px solid var(--sai-dark-border);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
          animation: floatY 6s ease-in-out infinite alternate;
        }

        @keyframes floatY {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-8px); }
        }

        .sai-window-header {
          background: #111522;
          padding: 0.85rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #1e293b;
        }

        .sai-window-dots { display: flex; gap: 0.45rem; }
        .sai-window-dots .dot { width: 11px; height: 11px; border-radius: 50%; }
        .dot.red { background: #ef4444; } .dot.yellow { background: #f59e0b; } .dot.green { background: #22c55e; }

        .sai-window-title { font-size: 0.85rem; font-weight: 600; color: #94a3b8; }
        .sai-window-status { font-size: 0.75rem; color: #22c55e; display: flex; align-items: center; gap: 0.4rem; font-weight: 600; }
        .live-dot { width: 7px; height: 7px; background: #22c55e; border-radius: 50%; }

        .sai-mock-body {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 1.5rem;
          padding: 1.75rem;
        }

        .sai-mock-panel {
          background: var(--sai-dark-card);
          border: 1px solid #1e293b;
          border-radius: 14px;
          padding: 1.5rem;
          color: #f1f5f9;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          border-bottom: 1px solid #1e293b;
          padding-bottom: 0.75rem;
        }

        .panel-header h3 { font-size: 0.95rem; font-weight: 700; margin: 0; }
        .panel-badge { font-size: 0.72rem; background: rgba(109, 93, 251, 0.2); color: #8c85ff; padding: 0.2rem 0.6rem; border-radius: 10px; font-weight: 600; }
        .trend-up { font-size: 0.75rem; color: #22c55e; font-weight: 700; }

        .panel-input-group { margin-bottom: 1rem; }
        .panel-input-group label { display: block; font-size: 0.75rem; color: #64748b; font-weight: 600; margin-bottom: 0.4rem; }
        .mock-input { background: #0b0f19; border: 1px solid #1e293b; padding: 0.65rem 0.85rem; border-radius: 8px; font-size: 0.85rem; color: #cbd5e1; }

        .panel-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem; }
        .panel-col label { display: block; font-size: 0.75rem; color: #64748b; font-weight: 600; margin-bottom: 0.4rem; }
        .mock-chip { background: #0b0f19; border: 1px solid #6d5dfb; color: #8c85ff; padding: 0.45rem 0.75rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; text-align: center; }

        .panel-generated-output { background: #060912; border: 1px solid #1e293b; border-radius: 10px; padding: 1.1rem; }
        .output-header { display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748b; margin-bottom: 0.6rem; }
        .output-header .score { color: #f59e0b; font-weight: 700; }
        .output-text { font-size: 0.85rem; line-height: 1.6; color: #cbd5e1; margin: 0; }

        /* Metrics grid inside mock */
        .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.25rem; }
        .metric-box { background: #0b0f19; border: 1px solid #1e293b; padding: 0.75rem; border-radius: 10px; text-align: center; }
        .metric-box .label { display: block; font-size: 0.7rem; color: #64748b; }
        .metric-box .value { font-family: var(--sai-font-display); font-size: 1.3rem; font-weight: 700; color: #fff; margin: 0.2rem 0; display: block; }
        .metric-box .sub { font-size: 0.68rem; font-weight: 600; }
        .sub.green { color: #22c55e; } .sub.purple { color: #8c85ff; }

        .chart-container { height: 190px; width: 100%; position: relative; }

        /* Floating Pills */
        .sai-floating-pill {
          position: absolute;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 0.6rem 1.1rem;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #0f172a;
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          z-index: 10;
        }

        body.dark .sai-floating-pill, body.dark-mode .sai-floating-pill {
          background: #1e293b;
          border-color: #334155;
          color: #fff;
        }

        .float-1 { top: -20px; left: 30px; animation: floatY 5s ease-in-out infinite alternate; }
        .float-2 { bottom: 40px; right: -25px; animation: floatY 4s ease-in-out infinite alternate-reverse; }
        .float-3 { top: 40%; left: -30px; animation: floatY 6s ease-in-out infinite alternate; }

        @media (max-width: 992px) {
          .sai-mock-body { grid-template-columns: 1fr; }
          .sai-floating-pill { display: none; }
        }

        /* ── 4. CUSTOMER STORIES / USE CASES ── */
        .sai-stories-section {
          padding: 6rem 1.5rem;
          background: var(--sai-bg-alt);
        }

        .sai-stories-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .sai-story-card {
          border: 1px solid var(--sai-border);
          border-radius: 16px;
          padding: 1.85rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s ease;
        }

        .sai-story-card:hover {
          transform: translateY(-4px);
          border-color: var(--sai-accent);
          box-shadow: 0 15px 35px rgba(0,0,0,0.06);
        }

        .story-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .story-icon {
          width: 42px; height: 42px;
          border-radius: 12px;
          background: #ffffff;
          border: 1px solid var(--sai-border);
          display: flex; align-items: center; justify-content: center;
          color: var(--sai-accent);
          font-size: 1.1rem;
        }

        body.dark .story-icon, body.dark-mode .story-icon { background: var(--sai-dark-card); }

        .story-tag {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--sai-accent);
        }

        .story-category {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--sai-text-muted);
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }

        .story-title {
          font-family: var(--sai-font-display);
          font-size: 1.2rem;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 0.75rem;
          color: var(--sai-text-primary);
        }

        .story-desc {
          font-size: 0.9rem;
          color: var(--sai-text-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .story-card-bottom {
          padding-top: 1rem;
          border-top: 1px solid var(--sai-border);
        }

        .story-stats {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--sai-text-primary);
        }

        @media (max-width: 1024px) {
          .sai-stories-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .sai-stories-grid { grid-template-columns: 1fr; }
        }

        /* ── 5. STICKY SECTION NAV ── */
        .sai-sticky-section-nav {
          position: sticky;
          top: 90px;
          z-index: 90;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(14px);
          border-y: 1px solid var(--sai-border);
          padding: 0.75rem 1.5rem;
          border-radius: 30px;
          max-width: 1040px;
          margin: 0 auto;
        }

        body.dark .sai-sticky-section-nav, body.dark-mode .sai-sticky-section-nav {
          background: rgba(6, 9, 18, 0.92);
        }

        .section-nav-container {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          overflow-x: auto;
          white-space: nowrap;
          padding-bottom: 0.2rem;
        }

        .section-nav-item {
          color: var(--sai-text-secondary);
          text-decoration: none;
          padding: 0.5rem 1.25rem;
          border-radius: 20px;
          font-size: 0.88rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .section-nav-item:hover, .section-nav-item.active {
          background: var(--sai-accent);
          color: #ffffff;
        }

        /* ── 6. HOW IT WORKS ── */
        .sai-how-it-works-section {
          padding: 7rem 1.5rem;
        }

        .sai-steps-container {
          display: flex;
          flex-direction: column;
          gap: 4.5rem;
        }

        .sai-step-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .sai-step-row.reverse {
          direction: rtl;
        }

        .sai-step-row.reverse .step-text-side,
        .sai-step-row.reverse .step-visual-side {
          direction: ltr;
        }

        .step-num {
          font-family: var(--sai-font-display);
          font-size: 3.5rem;
          font-weight: 800;
          color: var(--sai-accent);
          line-height: 1;
          display: block;
          margin-bottom: 0.5rem;
        }

        .step-title {
          font-family: var(--sai-font-display);
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--sai-text-primary);
        }

        .step-desc {
          font-size: 1.05rem;
          color: var(--sai-text-secondary);
          line-height: 1.65;
        }

        .step-card-mock {
          background: var(--sai-dark-bg);
          border: 1px solid var(--sai-dark-border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 16px 40px rgba(0,0,0,0.15);
        }

        .card-mock-header {
          background: #111522;
          padding: 0.75rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          border-bottom: 1px solid #1e293b;
        }

        .card-mock-header .dot { width: 9px; height: 9px; border-radius: 50%; background: #475569; }
        .card-mock-header .title { font-size: 0.78rem; color: #94a3b8; font-weight: 600; margin-left: 0.5rem; }

        .card-mock-body { padding: 1.5rem; color: #f1f5f9; }

        .step-prompt-ui label { display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.4rem; }
        .step-prompt-ui .prompt-box { background: #141721; border: 1px solid #1e293b; padding: 0.85rem; border-radius: 8px; font-size: 0.9rem; color: #cbd5e1; margin-bottom: 1rem; }
        .step-prompt-ui .prompt-actions { display: flex; justify-content: space-between; align-items: center; }
        .step-prompt-ui .pill { font-size: 0.75rem; color: #8c85ff; background: rgba(109, 93, 251, 0.2); padding: 0.2rem 0.6rem; border-radius: 8px; }
        .step-prompt-ui .gen-btn { background: var(--sai-accent); color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; font-size: 0.82rem; }

        .step-platforms-ui label { display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.6rem; }
        .platforms-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .plat-chip { background: #141721; border: 1px solid #1e293b; padding: 0.65rem; border-radius: 8px; font-size: 0.85rem; text-align: center; }
        .plat-chip.active { border-color: var(--sai-accent); color: #8c85ff; }

        .step-output-ui .out-top { display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.6rem; }
        .step-output-ui .plat-tag { color: #8c85ff; font-weight: 600; }
        .step-output-ui .score { color: #f59e0b; font-weight: 700; }
        .step-output-ui .out-text { font-family: inherit; font-size: 0.85rem; color: #cbd5e1; line-height: 1.6; white-space: pre-wrap; margin: 0; }

        .metrics-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; }
        .m-box { background: #141721; border: 1px solid #1e293b; padding: 0.75rem; border-radius: 8px; text-align: center; }
        .m-box .lbl { display: block; font-size: 0.7rem; color: #64748b; }
        .m-box .val { font-size: 1.2rem; font-weight: 700; color: #fff; display: block; margin: 0.2rem 0; }
        .m-box .sub { font-size: 0.68rem; color: #22c55e; font-weight: 600; }

        @media (max-width: 992px) {
          .sai-step-row, .sai-step-row.reverse { grid-template-columns: 1fr; gap: 2rem; direction: ltr !important; }
        }

        /* ── 7. GENERATOR SHOWCASE ── */
        .sai-generator-showcase-section {
          padding: 7rem 1.5rem;
          background: var(--sai-bg-alt);
        }

        .sai-generator-grid {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 4rem;
          align-items: center;
        }

        .sai-feature-bullets {
          list-style: none;
          padding: 0;
          margin: 1.75rem 0 2.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .sai-feature-bullets li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.98rem;
          color: var(--sai-text-secondary);
        }

        .bullet-check {
          color: var(--sai-accent);
          margin-top: 0.25rem;
          font-size: 0.9rem;
        }

        .sai-interactive-app-window {
          background: var(--sai-dark-bg);
          border: 1px solid var(--sai-dark-border);
          border-radius: 18px;
          padding: 1.5rem;
          color: #f1f5f9;
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        }

        .app-window-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #1e293b;
          padding-bottom: 0.85rem;
          margin-bottom: 1.25rem;
        }

        .window-dots { display: flex; gap: 0.4rem; }
        .window-dots .dot { width: 10px; height: 10px; border-radius: 50%; }

        .window-title { font-size: 0.85rem; font-weight: 600; color: #8c85ff; }
        .window-badge { font-size: 0.72rem; background: rgba(109, 93, 251, 0.2); color: #8c85ff; padding: 0.2rem 0.55rem; border-radius: 8px; }

        .app-presets-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
        }

        .preset-label { font-size: 0.78rem; color: #64748b; font-weight: 600; }
        .preset-chip {
          background: #141721;
          border: 1px solid #1e293b;
          color: #94a3b8;
          padding: 0.3rem 0.75rem;
          border-radius: 20px;
          font-size: 0.78rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .preset-chip.active, .preset-chip:hover {
          background: var(--sai-accent);
          color: #fff;
          border-color: var(--sai-accent);
        }

        .app-controls {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-bottom: 1.25rem;
        }

        .control-group label { display: block; font-size: 0.75rem; color: #64748b; font-weight: 600; margin-bottom: 0.4rem; }
        .chip-row { display: flex; gap: 0.4rem; flex-wrap: wrap; }

        .chip-btn {
          background: #141721;
          border: 1px solid #1e293b;
          color: #94a3b8;
          padding: 0.4rem 0.75rem;
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chip-btn.active { background: var(--sai-accent); color: #fff; border-color: var(--sai-accent); }

        .app-input-bar { display: flex; gap: 0.6rem; margin-bottom: 1.25rem; }
        .prompt-input { flex: 1; background: #060912; border: 1px solid #1e293b; border-radius: 10px; padding: 0.7rem 0.9rem; color: #fff; font-size: 0.88rem; outline: none; }
        .generate-btn { background: var(--sai-accent); color: #fff; border: none; padding: 0.7rem 1.25rem; border-radius: 10px; font-weight: 600; font-size: 0.88rem; cursor: pointer; white-space: nowrap; }

        .app-output-screen { background: #060912; border: 1px solid #1e293b; border-radius: 12px; padding: 1.25rem; }
        .output-top-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 0.6rem; margin-bottom: 0.85rem; font-size: 0.75rem; }
        .tag.plat { color: #8c85ff; font-weight: 700; margin-right: 0.5rem; }
        .tag.tone { color: #94a3b8; }
        .score { color: #f59e0b; font-weight: 700; }
        .output-pre { font-family: inherit; font-size: 0.88rem; line-height: 1.65; color: #cbd5e1; white-space: pre-wrap; margin: 0; min-height: 110px; }
        .blinking-cursor { animation: hostingerBlink 1s infinite; color: var(--sai-accent); }

        .output-footer { display: flex; justify-content: space-between; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid #1e293b; }
        .action-btn { background: #1e293b; color: #fff; border: none; padding: 0.45rem 0.85rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; text-decoration: none; }
        .action-btn.highlight { background: rgba(109, 93, 251, 0.2); color: #8c85ff; border: 1px solid rgba(109, 93, 251, 0.3); }

        @media (max-width: 992px) {
          .sai-generator-grid { grid-template-columns: 1fr; }
        }

        /* ── 8. MULTI-PLATFORM SHOWCASE ── */
        .sai-multi-platform-section {
          padding: 7rem 1.5rem;
        }

        .multi-platform-tabs {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .platform-tab-btn {
          background: var(--sai-bg-alt);
          border: 1px solid var(--sai-border);
          color: var(--sai-text-secondary);
          padding: 0.75rem 1.5rem;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.92rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .platform-tab-btn.active, .platform-tab-btn:hover {
          background: var(--sai-text-primary);
          color: var(--sai-bg);
          border-color: var(--sai-text-primary);
        }

        .multi-platform-card {
          max-width: 820px;
          margin: 0 auto;
          background: var(--sai-dark-bg);
          border: 1px solid var(--sai-dark-border);
          border-radius: 20px;
          padding: 2rem;
          color: #f1f5f9;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }

        .card-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #1e293b;
          padding-bottom: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .platform-identity { display: flex; align-items: center; gap: 0.85rem; }
        .plat-icon { font-size: 1.6rem; }
        .plat-name { font-size: 1.1rem; font-weight: 700; margin: 0 0 0.2rem; }
        .plat-badge { font-size: 0.75rem; color: #8c85ff; font-weight: 600; }
        .score-pill { font-size: 0.8rem; background: rgba(245, 158, 11, 0.15); color: #f59e0b; padding: 0.35rem 0.85rem; border-radius: 20px; font-weight: 700; }

        .content-preview { font-family: inherit; font-size: 0.98rem; line-height: 1.7; color: #cbd5e1; white-space: pre-wrap; margin: 0 0 1.5rem; }

        .card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #1e293b;
          padding-top: 1rem;
          font-size: 0.85rem;
          color: #94a3b8;
        }

        .copy-btn { background: #1e293b; color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer; }

        /* ── 9. ANALYTICS SHOWCASE ── */
        .sai-analytics-showcase-section {
          padding: 7rem 1.5rem;
          background: var(--sai-bg-alt);
        }

        .sai-analytics-big-card {
          max-width: 1080px;
          margin: 0 auto;
          background: var(--sai-dark-bg);
          border: 1px solid var(--sai-dark-border);
          border-radius: 20px;
          padding: 2.25rem;
          box-shadow: 0 25px 60px rgba(0,0,0,0.18);
        }

        .analytics-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .metric-tile {
          background: var(--sai-dark-card);
          border: 1px solid #1e293b;
          padding: 1.25rem;
          border-radius: 14px;
        }

        .m-title { display: block; font-size: 0.8rem; color: #64748b; font-weight: 600; }
        .m-value { font-family: var(--sai-font-display); font-size: 1.8rem; font-weight: 700; color: #fff; margin: 0.3rem 0; display: block; }
        .m-badge { font-size: 0.72rem; font-weight: 600; display: inline-block; padding: 0.15rem 0.5rem; border-radius: 6px; }
        .m-badge.green { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
        .m-badge.purple { background: rgba(109, 93, 251, 0.15); color: #8c85ff; }
        .m-badge.blue { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }

        .analytics-chart-wrap {
          height: 320px;
          width: 100%;
        }

        @media (max-width: 992px) {
          .analytics-metrics-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* ── 10. TRENDING TOPICS ── */
        .sai-trending-showcase-section {
          padding: 7rem 1.5rem;
        }

        .trending-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .trend-card {
          background: var(--sai-bg);
          border: 1px solid var(--sai-border);
          border-radius: 18px;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .trend-card:hover {
          border-color: var(--sai-accent);
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.05);
        }

        .trend-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .trend-cat { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--sai-accent); letter-spacing: 0.05em; }
        .trend-score { font-size: 0.82rem; font-weight: 700; color: var(--sai-text-primary); }

        .trend-title { font-family: var(--sai-font-display); font-size: 1.3rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--sai-text-primary); }
        .trend-stats { font-size: 0.85rem; color: var(--sai-text-muted); display: flex; gap: 1rem; margin-bottom: 1.25rem; }
        .trend-stats .growth { color: #10b981; font-weight: 600; }

        .trend-prompt-box { background: var(--sai-bg-alt); border: 1px solid var(--sai-border); padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem; }
        .box-label { font-size: 0.75rem; font-weight: 700; color: var(--sai-text-muted); display: block; margin-bottom: 0.3rem; }
        .prompt-text { font-size: 0.9rem; color: var(--sai-text-secondary); margin: 0; font-style: italic; }

        .draft-btn {
          display: inline-flex;
          align-items: center;
          background: var(--sai-text-primary);
          color: var(--sai-bg);
          text-decoration: none;
          padding: 0.65rem 1.25rem;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .draft-btn:hover { opacity: 0.9; }

        @media (max-width: 768px) {
          .trending-grid { grid-template-columns: 1fr; }
        }

        /* ── 11. SCHEDULER SHOWCASE ── */
        .sai-scheduler-showcase-section {
          padding: 7rem 1.5rem;
          background: var(--sai-bg-alt);
        }

        .scheduler-calendar-card {
          max-width: 1100px;
          margin: 0 auto;
          background: var(--sai-dark-bg);
          border: 1px solid var(--sai-dark-border);
          border-radius: 20px;
          padding: 2rem;
          color: #f1f5f9;
          box-shadow: 0 25px 60px rgba(0,0,0,0.18);
        }

        .calendar-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #1e293b;
          padding-bottom: 1.25rem;
          margin-bottom: 1.75rem;
        }

        .bar-title { font-size: 1.05rem; font-weight: 700; }
        .queue-badge { font-size: 0.85rem; background: rgba(109, 93, 251, 0.2); color: #8c85ff; padding: 0.35rem 0.85rem; border-radius: 20px; font-weight: 700; }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .calendar-day-col {
          background: var(--sai-dark-card);
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 1rem;
        }

        .day-header { text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 0.6rem; margin-bottom: 1rem; }
        .day-name { display: block; font-size: 0.85rem; font-weight: 700; }
        .day-date { font-size: 0.75rem; color: #64748b; }

        .scheduled-item {
          background: #060912;
          padding: 0.85rem;
          border-radius: 8px;
        }

        .item-top { display: flex; justify-content: space-between; font-size: 0.75rem; color: #94a3b8; margin-bottom: 0.4rem; }
        .item-title { font-size: 0.82rem; font-weight: 600; margin: 0 0 0.5rem; line-height: 1.4; }
        .status-tag { font-size: 0.7rem; color: #22c55e; font-weight: 600; }

        .calendar-footer-cta { text-align: center; padding-top: 1rem; border-top: 1px solid #1e293b; }

        @media (max-width: 1024px) {
          .calendar-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .calendar-grid { grid-template-columns: 1fr; }
        }

        /* ── 12. AI FEATURES ── */
        .sai-ai-features-section {
          padding: 7rem 1.5rem;
        }

        .ai-feature-blocks-list {
          display: flex;
          flex-direction: column;
          gap: 4.5rem;
        }

        .ai-feature-block {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 4rem;
          align-items: center;
        }

        .ai-feature-block.reverse { direction: rtl; }
        .ai-feature-block.reverse .block-info-col,
        .ai-feature-block.reverse .block-graphic-col { direction: ltr; }

        .block-tag { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--sai-accent); letter-spacing: 0.05em; margin-bottom: 0.5rem; display: block; }
        .block-title { font-family: var(--sai-font-display); font-size: 2.2rem; font-weight: 700; margin-bottom: 1rem; color: var(--sai-text-primary); }
        .block-desc { font-size: 1.05rem; color: var(--sai-text-secondary); line-height: 1.65; margin-bottom: 1.5rem; }

        .block-bullets { list-style: none; padding: 0; margin: 0 0 2rem; display: flex; flex-direction: column; gap: 0.65rem; }
        .block-bullets li { display: flex; gap: 0.6rem; font-size: 0.95rem; color: var(--sai-text-secondary); }
        .bullet-dot { color: var(--sai-accent); font-weight: 700; }

        .block-mock-window {
          background: var(--sai-dark-bg);
          border: 1px solid var(--sai-dark-border);
          border-radius: 16px;
          padding: 1.5rem;
          color: #f1f5f9;
          box-shadow: 0 20px 45px rgba(0,0,0,0.12);
        }

        .mock-window-header { display: flex; align-items: center; gap: 0.4rem; border-bottom: 1px solid #1e293b; padding-bottom: 0.75rem; margin-bottom: 1rem; }
        .mock-window-header .dot { width: 9px; height: 9px; border-radius: 50%; }
        .mock-window-header .title { font-size: 0.78rem; color: #94a3b8; margin-left: 0.4rem; }

        .mock-window-body { background: var(--sai-dark-card); border-radius: 10px; padding: 1.25rem; }
        .mock-badge { font-size: 0.75rem; color: #8c85ff; font-weight: 700; margin-bottom: 0.5rem; }
        .mock-title { font-size: 1.05rem; font-weight: 700; margin: 0 0 0.5rem; }
        .mock-pre { font-family: inherit; font-size: 0.88rem; color: #cbd5e1; line-height: 1.6; margin: 0; white-space: pre-wrap; }

        @media (max-width: 992px) {
          .ai-feature-block, .ai-feature-block.reverse { grid-template-columns: 1fr; gap: 2rem; direction: ltr !important; }
        }

        /* ── 13. PLATFORM SHOWCASE ── */
        .sai-platform-showcase-section {
          padding: 7rem 1.5rem;
          background: var(--sai-bg-alt);
        }

        .platforms-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .platform-big-card {
          background: var(--sai-bg);
          border: 1px solid var(--sai-border);
          border-radius: 18px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s ease;
        }

        .platform-big-card:hover {
          border-color: var(--sai-accent);
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.06);
        }

        .platform-big-card .card-header { display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1.25rem; }
        .plat-icon-wrap { width: 44px; height: 44px; border-radius: 12px; border: 2px solid var(--sai-border); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }
        .plat-title { font-size: 1.1rem; font-weight: 700; margin: 0 0 0.2rem; color: var(--sai-text-primary); }
        .plat-badge { font-size: 0.75rem; color: var(--sai-text-muted); font-weight: 500; }

        .platform-big-card .card-body { margin-bottom: 1.5rem; }
        .sample-label { font-size: 0.75rem; font-weight: 700; color: var(--sai-text-muted); display: block; margin-bottom: 0.4rem; }
        .sample-pre { font-family: inherit; font-size: 0.85rem; color: var(--sai-text-secondary); line-height: 1.6; white-space: pre-wrap; margin: 0; background: var(--sai-bg-alt); padding: 0.85rem; border-radius: 8px; border: 1px solid var(--sai-border); }

        .platform-big-card .card-footer { padding-top: 0.85rem; border-top: 1px solid var(--sai-border); font-size: 0.78rem; font-weight: 600; color: #10b981; }

        @media (max-width: 1024px) {
          .platforms-cards-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .platforms-cards-grid { grid-template-columns: 1fr; }
        }

        /* ── 14. BENEFITS ── */
        .sai-benefits-section {
          padding: 7rem 1.5rem;
        }

        .benefits-editorial-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .benefit-editorial-card {
          background: var(--sai-bg);
          border: 1px solid var(--sai-border);
          border-radius: 18px;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .benefit-editorial-card:hover {
          border-color: var(--sai-accent);
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.05);
        }

        .benefit-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
        .benefit-icon-box { width: 44px; height: 44px; border-radius: 12px; background: var(--sai-accent-soft); color: var(--sai-accent); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
        .benefit-badge { font-size: 0.72rem; font-weight: 700; color: var(--sai-accent); background: rgba(109, 93, 251, 0.1); padding: 0.2rem 0.6rem; border-radius: 10px; }

        .benefit-title { font-family: var(--sai-font-display); font-size: 1.4rem; font-weight: 700; margin: 0 0 0.3rem; color: var(--sai-text-primary); }
        .benefit-subtitle { font-size: 0.9rem; font-weight: 600; color: var(--sai-text-muted); margin-bottom: 0.75rem; }
        .benefit-desc { font-size: 0.92rem; color: var(--sai-text-secondary); line-height: 1.6; margin: 0; }

        @media (max-width: 1024px) {
          .benefits-editorial-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .benefits-editorial-grid { grid-template-columns: 1fr; }
        }

        /* ── 15. PRICING ── */
        .sai-pricing-section {
          padding: 7rem 1.5rem;
          background: var(--sai-bg-alt);
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .pricing-card {
          background: var(--sai-bg);
          border: 1px solid var(--sai-border);
          border-radius: 20px;
          padding: 2.25rem;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s ease;
        }

        .pricing-card.popular {
          border-color: var(--sai-accent);
          box-shadow: 0 20px 45px rgba(109, 93, 251, 0.15);
        }

        .popular-badge {
          position: absolute;
          top: -14px; right: 24px;
          background: var(--sai-accent);
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.85rem;
          border-radius: 20px;
        }

        .plan-name { font-family: var(--sai-font-display); font-size: 1.5rem; font-weight: 700; margin: 0 0 0.5rem; color: var(--sai-text-primary); }
        .plan-desc { font-size: 0.9rem; color: var(--sai-text-secondary); min-height: 44px; margin-bottom: 1.5rem; }

        .price-row { margin-bottom: 2rem; }
        .price-val { font-family: var(--sai-font-display); font-size: 3rem; font-weight: 800; color: var(--sai-text-primary); }
        .price-period { font-size: 0.9rem; color: var(--sai-text-muted); font-weight: 500; }

        .plan-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 0.85rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .plan-btn.primary { background: var(--sai-accent); color: #fff; }
        .plan-btn.primary:hover { background: var(--sai-accent-hover); }
        .plan-btn.outline { background: transparent; border: 1px solid var(--sai-border); color: var(--sai-text-primary); }
        .plan-btn.outline:hover { border-color: var(--sai-accent); color: var(--sai-accent); }

        .card-features-list { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--sai-border); }
        .list-title { font-size: 0.8rem; font-weight: 700; color: var(--sai-text-muted); text-transform: uppercase; display: block; margin-bottom: 1rem; }
        .card-features-list ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; }
        .card-features-list li { display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.9rem; color: var(--sai-text-secondary); }
        .feature-check { color: #10b981; margin-top: 0.2rem; }

        @media (max-width: 992px) {
          .pricing-grid { grid-template-columns: 1fr; max-width: 480px; }
        }

        /* ── 16. FAQ ── */
        .sai-faq-section {
          padding: 7rem 1.5rem;
        }

        .sai-faq-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .faq-accordion-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .faq-accordion-item {
          background: var(--sai-bg);
          border: 1px solid var(--sai-border);
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .faq-accordion-item:hover, .faq-accordion-item.open {
          border-color: var(--sai-accent);
        }

        .faq-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .faq-question {
          font-size: 1.05rem;
          font-weight: 700;
          margin: 0;
          color: var(--sai-text-primary);
        }

        .faq-toggle-icon {
          background: transparent;
          border: none;
          color: var(--sai-accent);
          font-size: 1.1rem;
          cursor: pointer;
        }

        .faq-item-body {
          margin-top: 0.85rem;
          padding-top: 0.85rem;
          border-top: 1px solid var(--sai-border);
        }

        .faq-answer {
          font-size: 0.95rem;
          color: var(--sai-text-secondary);
          line-height: 1.65;
          margin: 0;
        }

        /* ── 17. FINAL CTA ── */
        .sai-final-cta-section {
          padding: 4rem 1.5rem 7rem;
        }

        .sai-final-cta-card {
          max-width: 1100px;
          margin: 0 auto;
          background: linear-gradient(135deg, #0b0b0f 0%, #171b26 100%);
          border-radius: 24px;
          padding: 5rem 2rem;
          text-align: center;
          color: #ffffff;
          box-shadow: 0 25px 60px rgba(0,0,0,0.25);
          position: relative;
          overflow: hidden;
        }

        .final-cta-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: #a78bfa;
          padding: 0.35rem 1rem;
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .final-cta-title {
          font-family: var(--sai-font-display);
          font-size: clamp(2.4rem, 4.5vw, 3.6rem);
          font-weight: 700;
          line-height: 1.12;
          margin-bottom: 1.25rem;
        }

        .final-cta-sub {
          font-size: 1.15rem;
          color: #94a3b8;
          max-width: 580px;
          margin: 0 auto 2.5rem;
          line-height: 1.65;
        }

        .final-cta-btn-group {
          display: flex;
          justify-content: center;
          gap: 1.25rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .final-cta-footnote {
          font-size: 0.85rem;
          color: #64748b;
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        /* ── 18. FOOTER ── */
        .sai-footer-section {
          background: var(--sai-bg-alt);
          border-top: 1px solid var(--sai-border);
          padding: 5rem 1.5rem 2.5rem;
        }

        .sai-footer-grid {
          display: grid;
          grid-template-columns: 1.5fr repeat(3, 1fr);
          gap: 4rem;
          margin-bottom: 4rem;
        }

        .footer-brand-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          color: var(--sai-text-primary);
          margin-bottom: 1rem;
        }

        .footer-logo-img { width: 32px; height: 32px; object-fit: contain; }
        .brand-name { font-family: var(--sai-font-sans); font-weight: 700; font-size: 1.25rem; }

        .brand-tagline { font-size: 0.88rem; color: var(--sai-text-muted); line-height: 1.65; max-width: 320px; margin-bottom: 1.25rem; }

        .footer-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          padding: 0.3rem 0.75rem;
          border-radius: 20px;
          font-weight: 600;
        }

        .footer-links-col h4 {
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--sai-text-muted);
          margin-bottom: 1.25rem;
        }

        .footer-links-col a {
          display: block;
          color: var(--sai-text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
          transition: color 0.2s;
        }

        .footer-links-col a:hover {
          color: var(--sai-accent);
        }

        .sai-footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid var(--sai-border);
          text-align: center;
          font-size: 0.85rem;
          color: var(--sai-text-muted);
        }

        .sai-footer-bottom a { color: var(--sai-text-primary); text-decoration: none; font-weight: 600; }

        /* ── Master Mobile Responsiveness Overrides ── */
        @media (max-width: 992px) {
          .sai-footer-grid { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
          .sai-generator-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .ai-feature-block, .ai-feature-block.reverse { grid-template-columns: 1fr; gap: 2rem; direction: ltr !important; }
          .pricing-grid { grid-template-columns: 1fr; max-width: 480px; }
          .analytics-metrics-grid { grid-template-columns: repeat(2, 1fr); }
          .sai-stories-grid { grid-template-columns: repeat(2, 1fr); }
          .platforms-cards-grid { grid-template-columns: repeat(2, 1fr); }
          .benefits-editorial-grid { grid-template-columns: repeat(2, 1fr); }
          .calendar-grid { grid-template-columns: repeat(2, 1fr); }
          .sai-mock-body { grid-template-columns: 1fr; }
          .sai-floating-pill { display: none; }
          .sai-hero-section { padding-top: 8.5rem; }
        }

        @media (max-width: 768px) {
          .sai-navbar {
            top: 10px;
            width: calc(100% - 1.25rem);
            padding: 0 0.85rem;
            height: 58px;
          }
          .sai-brand-name { font-size: 1.1rem; }
          .sai-badge-v2 { display: none; }
          .sai-hero-section { padding: 7.5rem 1rem 3rem; }
          .sai-hero-headline { font-size: clamp(2rem, 8vw, 3rem); line-height: 1.15; }
          .sai-hero-subtitle { font-size: 0.98rem; margin-bottom: 1.75rem; }
          .sai-hero-ctas { flex-direction: column; width: 100%; gap: 0.75rem; }
          .sai-hero-cta-primary, .sai-hero-cta-secondary { width: 100%; justify-content: center; text-align: center; box-sizing: border-box; }
          .trending-grid { grid-template-columns: 1fr; }
          .sai-sticky-section-nav { top: 74px; width: calc(100% - 1rem); padding: 0.5rem 0.75rem; border-radius: 20px; }
          .section-nav-item { font-size: 0.8rem; padding: 0.35rem 0.85rem; }
          .sai-section-title { font-size: clamp(1.75rem, 6vw, 2.5rem); }
          .sai-section-header { margin-bottom: 2.5rem; }
          .sai-mock-window { border-radius: 14px; }
          .sai-mock-body { padding: 1rem; }
          .sai-mock-panel { padding: 1rem; }
          .metrics-grid { grid-template-columns: 1fr 1fr; }
          .analytics-chart-wrap { height: 230px; }
          .sai-analytics-big-card { padding: 1.25rem; }
          .multi-platform-card { padding: 1.25rem; }
          .scheduler-calendar-card { padding: 1.25rem; }
          .app-controls { grid-template-columns: 1fr; }
          .chip-row { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 0.25rem; }
          .multi-platform-tabs { justify-content: flex-start; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 0.4rem; }
          .platform-tab-btn { flex-shrink: 0; padding: 0.55rem 1.1rem; font-size: 0.85rem; }
          .final-cta-card { padding: 3rem 1.25rem; border-radius: 18px; }
          .final-cta-title { font-size: clamp(1.8rem, 6vw, 2.6rem); }
          .final-cta-btn-group { flex-direction: column; width: 100%; }
          .sai-btn-primary-large, .sai-btn-outline-large { width: 100%; justify-content: center; }
        }

        @media (max-width: 640px) {
          .sai-stories-grid { grid-template-columns: 1fr; }
          .platforms-cards-grid { grid-template-columns: 1fr; }
          .benefits-editorial-grid { grid-template-columns: 1fr; }
          .calendar-grid { grid-template-columns: 1fr; }
          .sai-footer-grid { grid-template-columns: 1fr; gap: 2rem; }
          .metrics-grid { grid-template-columns: 1fr; }
          .analytics-metrics-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 480px) {
          .analytics-metrics-grid { grid-template-columns: 1fr; }
          .panel-row { grid-template-columns: 1fr; }
          .app-input-bar { flex-direction: column; }
          .generate-btn { width: 100%; }
          .output-footer { flex-direction: column; gap: 0.5rem; }
          .action-btn { width: 100%; text-align: center; justify-content: center; }
        }
      `}</style>
    </div>
  );
}