import React from "react";

const TECH_ITEMS = [
  { name: "JavaScript", category: "Language" },
  { name: "TypeScript", category: "Language" },
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Full Stack" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Language / AI" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Docker", category: "DevOps" },
  { name: "AWS", category: "Cloud" },
  { name: "System Design", category: "Architecture" },
  { name: "DSA", category: "Algorithms" },
  { name: "GraphQL", category: "API" }
];

export default function TechEcosystem() {
  return (
    <section id="ecosystem" style={{ padding: "4.5rem 1.5rem", background: "linear-gradient(145deg, #eef0f3 0%, #f6f5f1 35%, #faf6e9 70%, #fef3cf 100%)", fontFamily: "'Playpen Sans', cursive, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#1f2123", background: "#f5c842", padding: "4px 12px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          ENGINEERING DOMAINS & ECOSYSTEM
        </span>
        <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#1f2123", marginTop: "0.85rem", marginBottom: "2.5rem", fontFamily: "'Libre Caslon Text', 'Crimson Pro', Georgia, serif" }}>
          Built for Modern Engineering Stacks
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem" }}>
          {TECH_ITEMS.map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: "1.25rem 1rem",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.05)",
                borderRadius: "18px",
                textAlign: "center",
                boxShadow: "0 4px 14px rgba(0,0,0,0.02)",
                transition: "all 0.15s ease"
              }}
            >
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#1f2123" }}>
                {item.name}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#71757c", fontWeight: 600, marginTop: "4px" }}>
                {item.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
