import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Play, CheckCircle2, Sparkles, Award } from "lucide-react";

export default function InterviewShowcase() {
  const [activeTab, setActiveTab] = useState("javascript");

  const DEMO_QUESTIONS = {
    javascript: {
      question: "Explain the JavaScript Event Loop and how microtasks differ from macrotasks in order of execution.",
      userAnswer: "The event loop checks the call stack. When empty, it executes all microtasks (like Promise callbacks and queueMicrotask) before picking one macrotask (like setTimeout).",
      score: "92/100",
      strengths: ["Clear distinction between queues", "Accurately noted that all microtasks drain first"],
      followUp: "How does async/await affect stack execution when encountering an unawaited Promise?"
    },
    react: {
      question: "What problems does React 18 Concurrent Mode solve, and how does useTransition improve UX?",
      userAnswer: "Concurrent Mode allows React to interrupt non-urgent renders to prioritize high-priority user input. useTransition marks state updates as non-blocking transitions.",
      score: "89/100",
      strengths: ["Understands render interruption", "Clear application of useTransition for responsive UI"],
      followUp: "What is tearing in concurrent rendering and how does useSyncExternalStore mitigate it?"
    },
    systemDesign: {
      question: "Design a distributed rate limiter capable of handling 50,000 requests/sec with low latency.",
      userAnswer: "Use Redis with the Sliding Window Log or Token Bucket algorithm. Deploy Redis Cluster near application nodes to keep response times under 5ms.",
      score: "94/100",
      strengths: ["Selected appropriate Token Bucket algorithm", "Addressed latency via distributed Redis Cluster"],
      followUp: "How would you handle Redis node failures gracefully to avoid complete traffic drops?"
    }
  };

  const currentDemo = DEMO_QUESTIONS[activeTab];

  return (
    <section id="interview-prep" style={{ padding: "5rem 1.5rem", background: "linear-gradient(145deg, #eef0f3 0%, #f6f5f1 35%, #faf6e9 70%, #fef3cf 100%)", fontFamily: "'Playpen Sans', cursive, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#1f2123", background: "#f5c842", padding: "4px 12px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            AI INTERVIEW PREPARATION
          </span>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#1f2123", margin: "0.85rem 0 0.5rem 0", fontFamily: "'Libre Caslon Text', 'Crimson Pro', Georgia, serif" }}>
            Practice Technical Interviews with an AI Hiring Lead
          </h2>
          <p style={{ fontSize: "1rem", color: "#71757c", maxWidth: "650px", margin: "0 auto" }}>
            Simulate realistic interview rounds across JavaScript, React, System Design, DSA, and Behavioral questions with instant AI scoring.
          </p>
        </div>

        {/* Interactive Demo Container */}
        <div style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "24px", padding: "2.25rem", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem", alignItems: "center", boxShadow: "0 8px 30px rgba(0, 0, 0, 0.03)" }}>
          {/* Left: Interactive Tabs & Question */}
          <div>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              <button
                onClick={() => setActiveTab("javascript")}
                style={{
                  padding: "0.55rem 1.25rem",
                  background: activeTab === "javascript" ? "#1f2123" : "#f6f5f1",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "24px",
                  color: activeTab === "javascript" ? "#ffffff" : "#4b4e54",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                JavaScript
              </button>
              <button
                onClick={() => setActiveTab("react")}
                style={{
                  padding: "0.55rem 1.25rem",
                  background: activeTab === "react" ? "#1f2123" : "#f6f5f1",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "24px",
                  color: activeTab === "react" ? "#ffffff" : "#4b4e54",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                React Architecture
              </button>
              <button
                onClick={() => setActiveTab("systemDesign")}
                style={{
                  padding: "0.55rem 1.25rem",
                  background: activeTab === "systemDesign" ? "#1f2123" : "#f6f5f1",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "24px",
                  color: activeTab === "systemDesign" ? "#ffffff" : "#4b4e54",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                System Design
              </button>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#71757c", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                INTERVIEW QUESTION
              </span>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1f2123", marginTop: "4px", lineHeight: 1.4, fontFamily: "'Libre Caslon Text', 'Crimson Pro', Georgia, serif" }}>
                {currentDemo.question}
              </h3>
            </div>

            <div style={{ background: "#fcfcfd", border: "1px solid #e4e6ea", borderRadius: "16px", padding: "1.1rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#71757c", textTransform: "uppercase", marginBottom: "4px" }}>
                CANDIDATE RESPONSE
              </div>
              <p style={{ fontSize: "0.9rem", color: "#1f2123", lineHeight: 1.5, margin: 0 }}>
                "{currentDemo.userAnswer}"
              </p>
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
              <Play size={15} fill="#fff" /> Start Live Interview Prep
            </Link>
          </div>

          {/* Right: AI Scorecard Preview */}
          <div style={{ background: "#1f2123", borderRadius: "20px", padding: "1.75rem", color: "#ffffff", boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Sparkles size={18} color="#f5c842" />
                <span style={{ fontWeight: 800, color: "#ffffff", fontSize: "0.95rem" }}>Devora AI Scorecard</span>
              </div>
              <div style={{ padding: "4px 12px", borderRadius: "16px", background: "rgba(245, 200, 66, 0.2)", border: "1px solid rgba(245, 200, 66, 0.4)", color: "#f5c842", fontWeight: 800, fontSize: "0.95rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                {currentDemo.score}
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#4ade80", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <CheckCircle2 size={15} /> Key Technical Strengths
              </div>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.5, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {currentDemo.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div style={{ padding: "0.85rem 1rem", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#f5c842", textTransform: "uppercase", marginBottom: "3px" }}>
                💡 AI Follow-Up Question
              </div>
              <div style={{ fontSize: "0.84rem", color: "#f1f3f5", lineHeight: 1.4 }}>
                {currentDemo.followUp}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
