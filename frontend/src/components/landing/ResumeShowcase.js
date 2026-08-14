import React from "react";
import { Link } from "react-router-dom";
import { FileText, Award, AlertTriangle, Sparkles, Briefcase } from "lucide-react";

export default function ResumeShowcase() {
  return (
    <section id="resume-analyzer" style={{ padding: "5rem 1.5rem", background: "linear-gradient(145deg, #f6f5f1 0%, #faf6e9 50%, #fef3cf 100%)", fontFamily: "'Playpen Sans', cursive, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#1f2123", background: "#f5c842", padding: "4px 12px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            AI RESUME ANALYZER & ATS SCANNER
          </span>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#1f2123", margin: "0.85rem 0 0.5rem 0", fontFamily: "'Libre Caslon Text', 'Crimson Pro', Georgia, serif" }}>
            Beat the ATS Filters Before A Human Ever Reads It
          </h2>
          <p style={{ fontSize: "1rem", color: "#71757c", maxWidth: "650px", margin: "0 auto" }}>
            75% of developer resumes are filtered out by applicant tracking systems. Devora audits your resume against industry benchmarks and job descriptions.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "2.5rem", alignItems: "center" }}>
          {/* Left: ATS Scorecard Mockup Card */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "24px", padding: "2.25rem", boxShadow: "0 8px 30px rgba(0, 0, 0, 0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid #f0f2f5", paddingBottom: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#71757c", textTransform: "uppercase" }}>
                  AUDITED FILE
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1f2123" }}>
                  Alex_Senior_Frontend_Resume.pdf
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#1f2123", fontFamily: "'Space Grotesk', sans-serif" }}>
                  88 / 100
                </div>
                <div style={{ fontSize: "0.72rem", color: "#16a34a", fontWeight: 700 }}>ATS Score (High Pass)</div>
              </div>
            </div>

            {/* Keyword Extraction */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#5b5e64", marginBottom: "0.5rem" }}>
                DETECTED STACK KEYWORDS
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {["TypeScript", "React", "Next.js", "Node.js", "GraphQL", "Tailwind CSS", "Jest", "CI/CD"].map((kw, i) => (
                  <span key={i} style={{ padding: "4px 10px", background: "#f6f5f1", border: "1px solid rgba(0,0,0,0.06)", color: "#1f2123", borderRadius: "16px", fontSize: "0.75rem", fontWeight: 700 }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills Warning */}
            <div style={{ padding: "1rem", background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.15)", borderRadius: "14px", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#dc2626", marginBottom: "4px", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <AlertTriangle size={14} /> Critical Keyword Gaps Detected
              </div>
              <div style={{ fontSize: "0.82rem", color: "#7f1d1d" }}>
                Missing mentions of <strong>Docker</strong>, <strong>Redis</strong>, and <strong>AWS Cloud Architecture</strong> for targeted Senior role.
              </div>
            </div>

            <Link
              to="/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                background: "#1f2123",
                borderRadius: "14px",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "0.9rem",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(0,0,0,0.1)"
              }}
            >
              <FileText size={15} /> Audit Your Resume Free
            </Link>
          </div>

          {/* Right: Key Value Props */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", background: "#ffffff", padding: "1.25rem", borderRadius: "18px", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#f6f5f1", border: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Award size={20} color="#1f2123" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1f2123", margin: "0 0 0.35rem 0", fontFamily: "'Libre Caslon Text', 'Crimson Pro', Georgia, serif" }}>
                  Instant ATS Parsing & Scoring
                </h3>
                <p style={{ fontSize: "0.88rem", color: "#71757c", lineHeight: 1.5, margin: 0 }}>
                  Upload your PDF and get a comprehensive score breakdown evaluating formatting, section clarity, readability, and technical depth.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", background: "#ffffff", padding: "1.25rem", borderRadius: "18px", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#f6f5f1", border: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Briefcase size={20} color="#1f2123" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1f2123", margin: "0 0 0.35rem 0", fontFamily: "'Libre Caslon Text', 'Crimson Pro', Georgia, serif" }}>
                  Job Description Keyword Matcher
                </h3>
                <p style={{ fontSize: "0.88rem", color: "#71757c", lineHeight: 1.5, margin: 0 }}>
                  Paste any job posting to calculate an exact match percentage and discover missing keywords before you apply.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", background: "#ffffff", padding: "1.25rem", borderRadius: "18px", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#f6f5f1", border: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Sparkles size={20} color="#f5c842" />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1f2123", margin: "0 0 0.35rem 0", fontFamily: "'Libre Caslon Text', 'Crimson Pro', Georgia, serif" }}>
                  Google XYZ Impact Formulation
                </h3>
                <p style={{ fontSize: "0.88rem", color: "#71757c", lineHeight: 1.5, margin: 0 }}>
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
