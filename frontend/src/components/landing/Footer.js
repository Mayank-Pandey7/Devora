import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ background: "#ffffff", borderTop: "1px solid rgba(0,0,0,0.06)", padding: "4rem 1.5rem 2.5rem", fontFamily: "'Playpen Sans', cursive, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2.5rem", marginBottom: "3rem" }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem", background: "#f6f5f1", padding: "4px 14px", borderRadius: "20px", border: "1px solid rgba(0,0,0,0.06)" }}>
              <img src="/logo.png" alt="Devora" style={{ width: "28px", height: "28px", objectFit: "contain" }} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 900, color: "#1f2123" }}>
                Devora
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#71757c", lineHeight: 1.6, maxWidth: "280px" }}>
              Build better. Interview smarter. Get hired. An AI-powered career copilot for modern developers.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 style={{ fontSize: "0.75rem", fontWeight: 800, color: "#1f2123", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
              Features
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <a href="#interview-prep" style={{ color: "#5b5e64", fontSize: "0.88rem", textDecoration: "none", fontWeight: 600 }}>AI Interview Prep</a>
              <a href="#resume-analyzer" style={{ color: "#5b5e64", fontSize: "0.88rem", textDecoration: "none", fontWeight: 600 }}>ATS Resume Scanner</a>
              <a href="#ecosystem" style={{ color: "#5b5e64", fontSize: "0.88rem", textDecoration: "none", fontWeight: 600 }}>Tech Ecosystem</a>
              <Link to="/dashboard" style={{ color: "#5b5e64", fontSize: "0.88rem", textDecoration: "none", fontWeight: 600 }}>Career Dashboard</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontSize: "0.75rem", fontWeight: 800, color: "#1f2123", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
              Platform
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <a href="#how-it-works" style={{ color: "#5b5e64", fontSize: "0.88rem", textDecoration: "none", fontWeight: 600 }}>How It Works</a>
              <a href="#faq" style={{ color: "#5b5e64", fontSize: "0.88rem", textDecoration: "none", fontWeight: 600 }}>FAQ</a>
              <Link to="/login" style={{ color: "#5b5e64", fontSize: "0.88rem", textDecoration: "none", fontWeight: 600 }}>Sign In</Link>
              <Link to="/register" style={{ color: "#5b5e64", fontSize: "0.88rem", textDecoration: "none", fontWeight: 600 }}>Create Account</Link>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #f0f2f5", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ fontSize: "0.8rem", color: "#71757c", margin: 0 }}>
            © {new Date().getFullYear()} Devora. All rights reserved. Build better. Interview smarter. Get hired.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#71757c" }}>Privacy Policy</span>
            <span style={{ fontSize: "0.8rem", color: "#71757c" }}>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
