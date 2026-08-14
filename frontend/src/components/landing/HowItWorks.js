import React from "react";
import { Mic, Sparkles, Award } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Select your career tool",
    desc: "Choose between AI Technical Mock Interviews or AI Resume ATS Optimization based on your immediate hiring goals.",
    icon: Sparkles,
    previewContent: {
      type: "tools",
      items: ["AI Technical Interview", "ATS Resume Audit", "Job Description Matcher"]
    }
  },
  {
    step: "02",
    title: "Let Devora analyze your work",
    desc: "Our Gemini AI engine evaluates your answers or parses your PDF resume against real-world FAANG and top-tier tech benchmarks.",
    icon: Mic,
    previewContent: {
      type: "scoring",
      metric: "Evaluation in Progress...",
      sub: "Benchmarking technical depth & ATS keyword alignment"
    }
  },
  {
    step: "03",
    title: "Level up with actionable feedback",
    desc: "Review detailed gold-standard answers, identify missing keywords, and track your Career Readiness score over time.",
    icon: Award,
    previewContent: {
      type: "result",
      score: "88/100",
      tag: "Top Tier Candidate",
      insights: ["Clear technical articulation", "+4 Recommended ATS Keywords"]
    }
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: '5rem 1.5rem', background: "linear-gradient(145deg, #eef0f3 0%, #f6f5f1 35%, #faf6e9 70%, #fef3cf 100%)", fontFamily: "'Playpen Sans', cursive, sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1f2123', background: '#f5c842', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            HOW DEVORA WORKS
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1f2123', margin: '0.85rem 0 0.5rem 0', fontFamily: "'Libre Caslon Text', 'Crimson Pro', Georgia, serif" }}>
            Three Steps to Interview Confidence
          </h2>
          <p style={{ fontSize: '1rem', color: '#71757c', maxWidth: '600px', margin: '0 auto' }}>
            A streamlined workflow designed to turn practice into high-paying engineering offers.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.05)',
                  borderRadius: '24px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f6f5f1', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color="#1f2123" />
                  </div>
                  <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#e2e8f0', fontFamily: "'Space Grotesk', sans-serif" }}>
                    {s.step}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1f2123', marginBottom: '0.5rem', fontFamily: "'Libre Caslon Text', 'Crimson Pro', Georgia, serif" }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#71757c', lineHeight: 1.6, flex: 1 }}>
                  {s.desc}
                </p>

                {/* Micro Preview Card */}
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fcfcfd', borderRadius: '16px', border: '1px solid #e4e6ea' }}>
                  {s.previewContent.type === 'tools' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {s.previewContent.items.map((it, i) => (
                        <div key={i} style={{ fontSize: '0.78rem', color: '#1f2123', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ color: '#f5c842', fontWeight: 900 }}>•</span> {it}
                        </div>
                      ))}
                    </div>
                  )}

                  {s.previewContent.type === 'scoring' && (
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1f2123', marginBottom: '2px' }}>
                        {s.previewContent.metric}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#71757c' }}>
                        {s.previewContent.sub}
                      </div>
                    </div>
                  )}

                  {s.previewContent.type === 'result' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', background: 'rgba(34, 197, 94, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                          {s.previewContent.tag}
                        </span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1f2123', fontFamily: "'Space Grotesk', sans-serif" }}>
                          {s.previewContent.score}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#71757c' }}>
                        {s.previewContent.insights.join(" • ")}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
