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
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#1f2123", background: "#f5c842", padding: "5px 14px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            AI INTERVIEW PREPARATION
          </span>
          <h2 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#1f2123", margin: "1rem 0 0.6rem 0", fontFamily: "'Libre Caslon Text', 'Crimson Pro', Georgia, serif" }}>
            Practice Technical Interviews with an AI Hiring Lead
          </h2>
          <p style={{ fontSize: "1.05rem", color: "#374151", maxWidth: "650px", margin: "0 auto", lineHeight: 1.6, fontWeight: 500 }}>
            Simulate realistic interview rounds across JavaScript, React, System Design, DSA, and Behavioral questions with instant AI scoring.
          </p>
        </div>

        {/* Interactive Demo Container */}
        <div style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "24px", padding: "2.5rem", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2.5rem", alignItems: "center", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)" }}>
          {/* Left: Interactive Tabs & Question */}
          <div>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              <button
                onClick={() => setActiveTab("javascript")}
                style={{
                  padding: "0.6rem 1.3rem",
                  background: activeTab === "javascript" ? "#1f2123" : "#f6f5f1",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "24px",
                  color: activeTab === "javascript" ? "#ffffff" : "#374151",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                JavaScript
              </button>
              <button
                onClick={() => setActiveTab("react")}
                style={{
                  padding: "0.6rem 1.3rem",
                  background: activeTab === "react" ? "#1f2123" : "#f6f5f1",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "24px",
                  color: activeTab === "react" ? "#ffffff" : "#374151",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                React Architecture
              </button>
              <button
                onClick={() => setActiveTab("systemDesign")}
                style={{
                  padding: "0.6rem 1.3rem",
                  background: activeTab === "systemDesign" ? "#1f2123" : "#f6f5f1",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "24px",
                  color: activeTab === "systemDesign" ? "#ffffff" : "#374151",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                System Design
              </button>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                INTERVIEW QUESTION
              </span>
              <h3 style={{ fontSize: "1.22rem", fontWeight: 800, color: "#1f2123", marginTop: "4px", lineHeight: 1.45, fontFamily: "'Libre Caslon Text', 'Crimson Pro', Georgia, serif" }}>
                {currentDemo.question}
              </h3>
            </div>

            <div style={{ background: "#fcfcfd", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "1.2rem", marginBottom: "1.75rem" }}>
              <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#4b5563", textTransform: "uppercase", marginBottom: "6px" }}>
                CANDIDATE RESPONSE
              </div>
              <p style={{ fontSize: "0.95rem", color: "#1f2123", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                "{currentDemo.userAnswer}"
              </p>
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
              <Play size={15} fill="#fff" /> Start Live Interview Prep
            </Link>
          </div>

          {/* Right: AI Scorecard Preview */}
          <div style={{ background: "#1f2123", borderRadius: "20px", padding: "2rem", color: "#ffffff", boxShadow: "0 10px 35px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.35rem", borderBottom: "1px solid rgba(255,255,255,0.12)", paddingBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Sparkles size={18} color="#f5c842" />
                <span style={{ fontWeight: 800, color: "#ffffff", fontSize: "1rem" }}>Devora AI Scorecard</span>
              </div>
              <div style={{ padding: "5px 14px", borderRadius: "16px", background: "rgba(245, 200, 66, 0.2)", border: "1px solid rgba(245, 200, 66, 0.4)", color: "#f5c842", fontWeight: 800, fontSize: "1rem", fontFamily: "'Space Grotesk', sans-serif" }}>
                {currentDemo.score}
              </div>
            </div>

            <div style={{ marginBottom: "1.35rem" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#4ade80", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <CheckCircle2 size={16} /> Key Technical Strengths
              </div>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.9rem", color: "#e2e8f0", lineHeight: 1.55, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {currentDemo.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div style={{ padding: "1rem 1.15rem", background: "rgba(255, 255, 255, 0.07)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "14px" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#f5c842", textTransform: "uppercase", marginBottom: "4px" }}>
                💡 AI Follow-Up Question
              </div>
              <div style={{ fontSize: "0.88rem", color: "#f8fafc", lineHeight: 1.45, fontWeight: 500 }}>
                {currentDemo.followUp}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
