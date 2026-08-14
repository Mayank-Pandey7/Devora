import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    q: "How does Devora evaluate technical interview answers?",
    a: "Devora uses Google's Gemini AI model calibrated against actual FAANG and top-tier tech interview rubrics. It evaluates your response across technical correctness, completeness, handling of edge cases, architectural trade-offs, and communication clarity."
  },
  {
    q: "How does the AI Resume ATS scanner work?",
    a: "When you upload a PDF or text resume, Devora extracts the text and runs an ATS algorithm scan. It detects technical keywords, benchmarks them against current engineering job requirements, calculates a compatibility score, and highlights missing skills."
  },
  {
    q: "Can I practice both live conversational mock interviews and step-by-step Q&A?",
    a: "Yes! Devora offers two formats: Question-by-Question mode (where you receive immediate gold-standard solutions and detailed critiques) and Live Mock Interviewer mode (a dynamic back-and-forth discussion where the AI interviewer asks thoughtful follow-ups)."
  },
  {
    q: "Is my resume and interview data private?",
    a: "Yes, 100%. Your resumes, practice sessions, and scores are strictly isolated to your authenticated account and are never shared with third parties or recruiters without your explicit permission."
  },
  {
    q: "What roles and seniorities does Devora support?",
    a: "Devora supports Junior, Mid-Level, Senior, and Lead engineering roles across Full Stack, Frontend (React/Next.js), Backend (Node.js/Python), System Design, Data Structures & Algorithms, and Behavioral interviews."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" style={{ padding: "5rem 1.5rem", background: "linear-gradient(145deg, #f6f5f1 0%, #faf6e9 50%, #fef3cf 100%)", fontFamily: "'Playpen Sans', cursive, sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#1f2123", background: "#f5c842", padding: "4px 12px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#1f2123", margin: "0.85rem 0 0.5rem 0", fontFamily: "'Libre Caslon Text', 'Crimson Pro', Georgia, serif" }}>
            Everything You Need to Know
          </h2>
          <p style={{ fontSize: "1rem", color: "#71757c" }}>
            Got questions about Devora? We've got answers.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.05)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.02)",
                  transition: "all 0.15s ease"
                }}
              >
                <div
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  style={{
                    padding: "1.25rem 1.75rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer"
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "#1f2123" }}>
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp size={18} color="#1f2123" /> : <ChevronDown size={18} color="#71757c" />}
                </div>

                {isOpen && (
                  <div style={{ padding: "0 1.75rem 1.5rem 1.75rem", color: "#5b5e64", fontSize: "0.9rem", lineHeight: 1.6, borderTop: "1px solid #f0f2f5", paddingTop: "1rem" }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
