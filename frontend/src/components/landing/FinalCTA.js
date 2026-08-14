import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FinalCTA() {
  return (
    <section style={{ padding: "5rem 1.5rem", background: "linear-gradient(145deg, #eef0f3 0%, #f6f5f1 35%, #faf6e9 70%, #fef3cf 100%)", textAlign: "center", position: "relative", overflow: "hidden", fontFamily: "'Playpen Sans', cursive, sans-serif" }}>
      <div style={{ maxWidth: "840px", margin: "0 auto", background: "#1f2123", borderRadius: "28px", padding: "4rem 2.5rem", color: "#ffffff", boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(245, 200, 66, 0.15)", border: "1px solid rgba(245, 200, 66, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          <Sparkles size={24} color="#f5c842" />
        </div>
        
        <h2 style={{ fontSize: "2.6rem", fontWeight: 800, color: "#ffffff", margin: "0 0 1rem 0", letterSpacing: "-0.03em", fontFamily: "'Libre Caslon Text', 'Crimson Pro', Georgia, serif" }}>
          Ready to become a better developer?
        </h2>
        <p style={{ fontSize: "1.05rem", color: "#cbd5e1", maxWidth: "580px", margin: "0 auto 2.25rem auto", lineHeight: 1.6 }}>
          Join developers practicing technical mock interviews, optimizing resumes for ATS, and landing top engineering roles.
        </p>

        <Link
          to="/register"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.95rem 2.2rem",
            background: "#f5c842",
            borderRadius: "30px",
            color: "#1f2123",
            fontWeight: 800,
            fontSize: "1rem",
            textDecoration: "none",
            boxShadow: "0 8px 25px rgba(245, 200, 66, 0.35)",
            transition: "all 0.15s ease"
          }}
        >
          Get Started with Devora Free <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
