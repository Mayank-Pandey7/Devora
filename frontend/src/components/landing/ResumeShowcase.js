import React from "react";
import { Link } from "react-router-dom";
import { FileText, Award, AlertTriangle, Sparkles, Briefcase } from "lucide-react";

export default function ResumeShowcase() {
  return (
    <section id="resume-analyzer" style={{ padding: "5rem 1.5rem", background: "linear-gradient(145deg, #f6f5f1 0%, #faf6e9 50%, #fef3cf 100%)", fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#1f2123", background: "#f5c842", padding: "5px 14px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            AI RESUME ANALYZER & ATS SCANNER
          </span>
          <h2 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#1f2123", margin: "1rem 0 0.6rem 0", fontFamily: "'Space Grotesk', -apple-system, sans-serif", letterSpacing: "-0.02em" }}>
            Beat the ATS Filters Before A Human Ever Reads It
          </h2>
          <p style={{ fontSize: "1.05rem", color: "#374151", maxWidth: "650px", margin: "0 auto", lineHeight: 1.6, fontWeight: 500 }}>
            75% of developer resumes are filtered out by applicant tracking systems. Devora audits your resume against industry benchmarks and job descriptions.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "2.5rem", alignItems: "center" }}>
          {/* Left: ATS Scorecard Mockup Card */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "24px", padding: "2.5rem", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid #f0f2f5", paddingBottom: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  AUDITED FILE
                </div>
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#1f2123", marginTop: "2px" }}>
                  Alex_Senior_Frontend_Resume.pdf
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.9rem", fontWeight: 900, color: "#1f2123", fontFamily: "'Space Grotesk', sans-serif" }}>
                  88 / 100
                </div>
                <div style={{ fontSize: "0.76rem", color: "#15803d", fontWeight: 800 }}>ATS Score (High Pass)</div>
              </div>
            </div>

            {/* Keyword Extraction */}
            <div style={{ marginBottom: "1.35rem" }}>
              <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#4b5563", marginBottom: "0.6rem" }}>
                DETECTED STACK KEYWORDS
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                {["TypeScript", "React", "Next.js", "Node.js", "GraphQL", "Tailwind CSS", "Jest", "CI/CD"].map((kw, i) => (
                  <span key={i} style={{ padding: "5px 12px", background: "#f6f5f1", border: "1px solid rgba(0,0,0,0.06)", color: "#1f2123", borderRadius: "16px", fontSize: "0.78rem", fontWeight: 700 }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills Warning */}
            <div style={{ padding: "1.1rem", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "14px", marginBottom: "1.75rem" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#dc2626", marginBottom: "5px", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <AlertTriangle size={15} /> Critical Keyword Gaps Detected
              </div>
              <div style={{ fontSize: "0.86rem", color: "#991b1b", lineHeight: 1.5, fontWeight: 500 }}>
                Missing mentions of <strong>Docker</strong>, <strong>Redis</strong>, and <strong>AWS Cloud Architecture</strong> for targeted Senior role.
              </div>
            </div>

            <Link
              to="/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.85rem 1.6rem",
                background: "#1f2123",
                borderRadius: "14px",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "0.92rem",
                textDecoration: "none",
                boxShadow: "0 6px 18px rgba(0,0,0,0.12)"
              }}
            >
              <FileText size={15} /> Audit Your Resume Free
            </Link>
          </div>

          {/* Right: Key Value Props */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", gap: "1.1rem", alignItems: "flex-start", background: "#ffffff", padding: "1.35rem", borderRadius: "20px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 6px 20px rgba(0,0,0,0.03)" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#f6f5f1", border: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Award size={22} color="#1f2123" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#1f2123", margin: "0 0 0.4rem 0", fontFamily: "'Space Grotesk', -apple-system, sans-serif" }}>
                  Instant ATS Parsing & Scoring
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.55, margin: 0, fontWeight: 500 }}>
                  Upload your PDF and get a comprehensive score breakdown evaluating formatting, section clarity, readability, and technical depth.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1.1rem", alignItems: "flex-start", background: "#ffffff", padding: "1.35rem", borderRadius: "20px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 6px 20px rgba(0,0,0,0.03)" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#f6f5f1", border: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Briefcase size={22} color="#1f2123" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#1f2123", margin: "0 0 0.4rem 0", fontFamily: "'Space Grotesk', -apple-system, sans-serif" }}>
                  Job Description Keyword Matcher
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.55, margin: 0, fontWeight: 500 }}>
                  Paste any job posting to calculate an exact match percentage and discover missing keywords before you apply.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1.1rem", alignItems: "flex-start", background: "#ffffff", padding: "1.35rem", borderRadius: "20px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 6px 20px rgba(0,0,0,0.03)" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "#f6f5f1", border: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Sparkles size={22} color="#f5c842" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#1f2123", margin: "0 0 0.4rem 0", fontFamily: "'Space Grotesk', -apple-system, sans-serif" }}>
                  Google XYZ Impact Formulation
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.55, margin: 0, fontWeight: 500 }}>
                  Get tailored suggestions to rephrase bullet points into metric-driven outcomes that catch recruiter attention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
