import React, { useState } from "react";
import { Sparkles, Code2, Layers, Cpu, Database, Server, Cloud, Shield, GitBranch, Terminal } from "lucide-react";

const TECH_ITEMS = [
  { name: "JavaScript", category: "Language", icon: Terminal },
  { name: "TypeScript", category: "Language", icon: Code2 },
  { name: "React", category: "Frontend", icon: Layers },
  { name: "Next.js", category: "Full Stack", icon: Cpu },
  { name: "Node.js", category: "Backend", icon: Server },
  { name: "Python", category: "Language / AI", icon: Terminal },
  { name: "PostgreSQL", category: "Database", icon: Database },
  { name: "Docker", category: "DevOps", icon: Layers },
  { name: "AWS", category: "Cloud", icon: Cloud },
  { name: "System Design", category: "Architecture", icon: Shield },
  { name: "DSA", category: "Algorithms", icon: GitBranch },
  { name: "GraphQL", category: "API", icon: Code2 }
];

export default function TechEcosystem() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [pillHovered, setPillHovered] = useState(false);

  return (
    <section id="ecosystem" style={{ padding: "5rem 1.5rem", background: "linear-gradient(145deg, #eef0f3 0%, #f6f5f1 35%, #faf6e9 70%, #fef3cf 100%)", fontFamily: "'Playpen Sans', cursive, sans-serif", position: "relative" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        
        {/* Floating Interactive Badge with Hover Glow */}
        <div style={{ display: "inline-block", marginBottom: "0.5rem" }}>
          <span
            onMouseEnter={() => setPillHovered(true)}
            onMouseLeave={() => setPillHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              fontSize: "0.78rem",
              fontWeight: 800,
              color: "#1f2123",
              background: pillHovered ? "#1f2123" : "#f5c842",
              color: pillHovered ? "#f5c842" : "#1f2123",
              padding: "6px 16px",
              borderRadius: "30px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              cursor: "pointer",
              transform: pillHovered ? "translateY(-3px) scale(1.06)" : "translateY(0) scale(1)",
              boxShadow: pillHovered ? "0 8px 25px rgba(31, 33, 35, 0.25)" : "0 3px 10px rgba(245, 200, 66, 0.3)",
              transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)"
            }}
          >
            <Sparkles size={14} color={pillHovered ? "#f5c842" : "#1f2123"} />
            ENGINEERING DOMAINS & ECOSYSTEM
          </span>
        </div>

        <h2 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#1f2123", marginTop: "1rem", marginBottom: "2.75rem", fontFamily: "'Libre Caslon Text', 'Crimson Pro', Georgia, serif" }}>
          Built for Modern Engineering Stacks
        </h2>

        {/* Tech Ecosystem Grid with Dynamic Hover Lift & Theme Inversion */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1.15rem" }}>
          {TECH_ITEMS.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  padding: "1.4rem 1.1rem",
                  background: isHovered ? "#1f2123" : "#ffffff",
                  border: isHovered ? "1.5px solid #1f2123" : "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "20px",
                  textAlign: "center",
                  boxShadow: isHovered ? "0 16px 36px rgba(0, 0, 0, 0.18)" : "0 4px 15px rgba(0, 0, 0, 0.02)",
                  transform: isHovered ? "translateY(-8px) scale(1.04)" : "translateY(0) scale(1)",
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)"
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background: isHovered ? "#f5c842" : "#f6f5f1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 0.75rem auto",
                    transform: isHovered ? "scale(1.2) rotate(-8deg)" : "scale(1) rotate(0deg)",
                    boxShadow: isHovered ? "0 6px 18px rgba(245, 200, 66, 0.5)" : "none",
                    transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)"
                  }}
                >
                  <Icon size={20} color={isHovered ? "#1f2123" : "#1f2123"} strokeWidth={isHovered ? 2.5 : 2} />
                </div>
                <div style={{ fontWeight: 800, fontSize: "1.05rem", color: isHovered ? "#ffffff" : "#1f2123", transition: "color 0.15s ease" }}>
                  {item.name}
                </div>
                <div style={{ fontSize: "0.76rem", color: isHovered ? "#f5c842" : "#5b5e64", fontWeight: 700, marginTop: "4px", transition: "color 0.15s ease" }}>
                  {item.category}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
