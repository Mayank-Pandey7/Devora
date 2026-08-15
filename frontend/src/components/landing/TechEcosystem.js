import React, { useState } from "react";

// Real vector logos for each technology stack
const JavaScriptIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24">
    <rect width="32" height="32" rx="6" fill="#F7DF1E" />
    <path d="M18.5 24.5c.9.5 2 .8 3.2.8 2.2 0 3.6-1.1 3.6-3.1v-8.9h-3.3v8.8c0 .9-.5 1.4-1.3 1.4-.7 0-1.3-.3-1.8-.7l-.4 1.7zm-9.3-.3c1.2.8 2.6 1.1 4 1.1 2.8 0 4.5-1.5 4.5-3.8 0-2.2-1.4-3.2-3.4-4-1.4-.6-2-1-2-1.7 0-.7.6-1.2 1.6-1.2 1 0 2 .4 2.7.9l.5-1.7c-.8-.5-1.9-.8-3.2-.8-2.6 0-4.3 1.5-4.3 3.6 0 2.2 1.5 3.3 3.5 4.1 1.4.6 2 1.1 2 1.8 0 .8-.7 1.4-1.8 1.4-1.2 0-2.4-.5-3.2-1.1l-.9 1.4z" fill="#000000" />
  </svg>
);

const TypeScriptIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24">
    <rect width="32" height="32" rx="6" fill="#3178C6" />
    <path d="M14.6 14.8h-4v9.9H8V14.8H4V12.5h10.6v2.3zm2.5 7.8c.8.6 1.9.9 3.1.9 2 0 3.2-.9 3.2-2.3 0-1.4-.8-2.1-2.4-2.8-1.5-.6-2.5-1.3-2.5-2.6 0-1.6 1.3-2.6 3.3-2.6 1.1 0 2.1.3 2.9.8l-.6 1.8c-.7-.4-1.5-.7-2.3-.7-1 0-1.7.5-1.7 1.2 0 .8.6 1.2 2 1.8 1.9.8 2.9 1.6 2.9 3.1 0 1.9-1.5 3-3.6 3-1.4 0-2.7-.4-3.6-1.1l.3-2.4z" fill="#FFFFFF" />
  </svg>
);

const ReactIcon = () => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" width="26" height="26">
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
    <g stroke="#61DAFB" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2"/>
      <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
      <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
    </g>
  </svg>
);

const NextjsIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24">
    <circle cx="16" cy="16" r="15" fill="#000000" stroke="#333333" strokeWidth="1"/>
    <path d="M22.5 23.5L12.5 10H10v12h2v-9.5l9 12h1.5z" fill="#FFFFFF"/>
    <rect x="19.5" y="10" width="2" height="7.5" fill="#FFFFFF"/>
  </svg>
);

const NodejsIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24">
    <path d="M16 2.5l11.7 6.8v13.4L16 29.5 4.3 22.7V9.3L16 2.5z" fill="#539E43" />
    <path d="M16 2.5l11.7 6.8v6.7L16 9.2 4.3 16V9.3L16 2.5z" fill="#68A063" />
    <path d="M16 13.5l6.5 3.8v7.5L16 28.5l-6.5-3.7v-7.5l6.5-3.8z" fill="#333333" />
    <path d="M16 15l4.5 2.6v5.2L16 25.4l-4.5-2.6v-5.2L16 15z" fill="#FFFFFF" />
  </svg>
);

const PythonIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24">
    <path d="M15.9 3.5c-6.8 0-6.4 3-6.4 3l.01 3.1h6.5v.9H5.8s-4.3.5-4.3 6.3 3.8 6.1 3.8 6.1h2.3v-3.2s-.1-3.8 3.7-3.8h6.4s3.6-.1 3.6-3.5V6.9s.5-3.4-5.9-3.4zm-3.6 2c.7 0 1.2.5 1.2 1.2s-.5 1.2-1.2 1.2-1.2-.5-1.2-1.2.5-1.2 1.2-1.2z" fill="#3776AB" />
    <path d="M16.1 28.5c6.8 0 6.4-3 6.4-3l-.01-3.1h-6.5v-.9h10.2s4.3-.5 4.3-6.3-3.8-6.1-3.8-6.1h-2.3v3.2s.1 3.8-3.7 3.8h-6.4s-3.6.1-3.6 3.5v5.5s-.5 3.4 5.9 3.4zm3.6-2c-.7 0-1.2-.5-1.2-1.2s.5-1.2 1.2-1.2 1.2.5 1.2 1.2-.5 1.2-1.2 1.2z" fill="#FFD438" />
  </svg>
);

const PostgresIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24">
    <path d="M16 3c-5.8 0-9.8 4.2-9.8 10.2 0 4.1 2.3 8.3 5.4 10.7-1.1 1.6-2.7 2.9-4.6 3.6 3.4 1.1 7.1.4 9.8-1.5 2.7 1.9 6.4 2.6 9.8 1.5-1.9-.7-3.5-2-4.6-3.6 3.1-2.4 5.4-6.6 5.4-10.7C27.4 7.2 22.8 3 16 3zm0 4.2c3.5 0 6.3 2.8 6.3 6.3 0 3.5-2.8 6.3-6.3 6.3s-6.3-2.8-6.3-6.3c0-3.5 2.8-6.3 6.3-6.3z" fill="#336791"/>
    <circle cx="16" cy="13.5" r="3.2" fill="#4169E1" />
  </svg>
);

const DockerIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24">
    <path d="M29.5 13.5c-.5-.3-1.7-.4-2.7.2-.2-.7-.7-1.4-1.3-1.8l-.9-.6-.6.9c-.8 1.2-.9 2.7-.3 3.9-.7.4-1.8.4-2.8.1l-.6-.2-.2.6c-.6 2-1.9 3.5-3.8 4.4-1.5.7-3.2.9-4.8.7-2.6-.4-4.8-1.8-6.3-4-.4-.6-.7-1.2-.9-1.9h-.8c-.8 0-1.5.3-2 .8-.4.4-.7 1-.7 1.6 0 3.8 3.5 6.9 7.8 6.9 5.8 0 10.5-3.1 12.3-7.5 2.4.1 4.5-1.5 4.9-3.7l.1-.5-1.3-.5z" fill="#2496ED"/>
    <rect x="7" y="10" width="3" height="2.5" rx="0.5" fill="#2496ED"/>
    <rect x="11" y="10" width="3" height="2.5" rx="0.5" fill="#2496ED"/>
    <rect x="15" y="10" width="3" height="2.5" rx="0.5" fill="#2496ED"/>
    <rect x="11" y="7" width="3" height="2.5" rx="0.5" fill="#2496ED"/>
    <rect x="15" y="7" width="3" height="2.5" rx="0.5" fill="#2496ED"/>
    <rect x="19" y="10" width="3" height="2.5" rx="0.5" fill="#2496ED"/>
  </svg>
);

const AwsIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24">
    <path d="M10.8 16.5c0 .6.2 1.1.5 1.5.4.4.9.6 1.5.6.8 0 1.5-.4 1.9-1.1v-2.3c-.4-.1-.9-.2-1.4-.2-1.6 0-2.5.5-2.5 1.5zm3.9 3.4c-.6.6-1.5.9-2.5.9-1.3 0-2.3-.4-3-1.1-.7-.8-1.1-1.8-1.1-3 0-1.3.4-2.3 1.2-3.1.8-.8 1.9-1.2 3.3-1.2.7 0 1.4.1 2 .3v-.4c0-1.8-1-2.6-2.5-2.6-.9 0-1.7.3-2.4.9l-.9-1.4c1-.8 2.2-1.2 3.6-1.2 1.4 0 2.5.4 3.2 1.1.7.7 1.1 1.8 1.1 3.2v6.6h-1.8l-.2-1zm8.3-7.5l-2.4 8.7h-2.1l-1.9-6.9-1.9 6.9h-2.1l-2.4-8.7h2l1.5 6.3 1.9-6.3h2l1.9 6.3 1.5-6.3h2zm-16.5 10c4.8 2.5 11.2 2.5 16 0 .5-.3 1.1.2.8.7-2.6 2.3-6.4 3.5-10.4 3.5-3.8 0-7.3-1.2-9.8-3.4-.4-.4.1-.9.6-.8zm15.6-.4c.5-.1 1.5-.5 1.9-1.2.2-.4.4-1 .3-1.3 0-.1-.1-.1-.2 0-.6.5-1.6.8-2.2.9-.3.1-.2.5.2.6z" fill="#FF9900"/>
  </svg>
);

const SystemDesignIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="8" height="6" rx="2" fill="#EEF2FF"/>
    <rect x="20" y="4" width="8" height="6" rx="2" fill="#EEF2FF"/>
    <rect x="12" y="22" width="8" height="6" rx="2" fill="#EEF2FF"/>
    <line x1="8" y1="10" x2="8" y2="16" />
    <line x1="24" y1="10" x2="24" y2="16" />
    <line x1="8" y1="16" x2="24" y2="16" />
    <line x1="16" y1="16" x2="16" y2="22" />
  </svg>
);

const DsaIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="16" cy="6" r="3.5" fill="#ECFEFF"/>
    <circle cx="8" cy="18" r="3.5" fill="#ECFEFF"/>
    <circle cx="24" cy="18" r="3.5" fill="#ECFEFF"/>
    <circle cx="4" cy="27" r="2.5" fill="#ECFEFF"/>
    <circle cx="12" cy="27" r="2.5" fill="#ECFEFF"/>
    <line x1="13.5" y1="8.5" x2="10.5" y2="15.5"/>
    <line x1="18.5" y1="8.5" x2="21.5" y2="15.5"/>
    <line x1="6.5" y1="20.5" x2="5" y2="24.5"/>
    <line x1="9.5" y1="20.5" x2="11" y2="24.5"/>
  </svg>
);

const GraphqlIcon = () => (
  <svg viewBox="0 0 32 32" width="24" height="24">
    <path d="M16 3.5l10.8 6.3v12.4L16 28.5 5.2 22.2V9.8L16 3.5z" fill="none" stroke="#E10098" strokeWidth="2"/>
    <polygon points="16 5.5 25.5 21.5 6.5 21.5" fill="none" stroke="#E10098" strokeWidth="2"/>
    <circle cx="16" cy="3.5" r="2.5" fill="#E10098"/>
    <circle cx="26.8" cy="9.8" r="2.5" fill="#E10098"/>
    <circle cx="26.8" cy="22.2" r="2.5" fill="#E10098"/>
    <circle cx="16" cy="28.5" r="2.5" fill="#E10098"/>
    <circle cx="5.2" cy="22.2" r="2.5" fill="#E10098"/>
    <circle cx="5.2" cy="9.8" r="2.5" fill="#E10098"/>
  </svg>
);

const TECH_ITEMS = [
  { name: "JavaScript", category: "Language", icon: JavaScriptIcon },
  { name: "TypeScript", category: "Language", icon: TypeScriptIcon },
  { name: "React", category: "Frontend", icon: ReactIcon },
  { name: "Next.js", category: "Full Stack", icon: NextjsIcon },
  { name: "Node.js", category: "Backend", icon: NodejsIcon },
  { name: "Python", category: "Language / AI", icon: PythonIcon },
  { name: "PostgreSQL", category: "Database", icon: PostgresIcon },
  { name: "Docker", category: "DevOps", icon: DockerIcon },
  { name: "AWS", category: "Cloud", icon: AwsIcon },
  { name: "System Design", category: "Architecture", icon: SystemDesignIcon },
  { name: "DSA", category: "Algorithms", icon: DsaIcon },
  { name: "GraphQL", category: "API", icon: GraphqlIcon }
];

export default function TechEcosystem() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section id="ecosystem" style={{ padding: "5rem 1.5rem", background: "linear-gradient(145deg, #eef0f3 0%, #f6f5f1 35%, #faf6e9 70%, #fef3cf 100%)", fontFamily: "'Playpen Sans', cursive, sans-serif", position: "relative" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        
        {/* Static Clean Badge without hover distortion */}
        <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#1f2123", background: "#f5c842", padding: "5px 14px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          ENGINEERING DOMAINS & ECOSYSTEM
        </span>

        <h2 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#1f2123", marginTop: "1rem", marginBottom: "2.75rem", fontFamily: "'Libre Caslon Text', 'Crimson Pro', Georgia, serif" }}>
          Built for Modern Engineering Stacks
        </h2>

        {/* Tech Ecosystem Grid with Authentic Brand Logos and Smooth Card Lift */}
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
                  background: isHovered ? "#ffffff" : "#ffffff",
                  border: isHovered ? "1.5px solid #1f2123" : "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "20px",
                  textAlign: "center",
                  boxShadow: isHovered ? "0 14px 30px rgba(0, 0, 0, 0.08)" : "0 4px 15px rgba(0, 0, 0, 0.02)",
                  transform: isHovered ? "translateY(-6px) scale(1.03)" : "translateY(0) scale(1)",
                  cursor: "pointer",
                  transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)"
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "#f6f5f1",
                    border: "1px solid rgba(0,0,0,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 0.75rem auto",
                    transform: isHovered ? "scale(1.15) rotate(-4deg)" : "scale(1) rotate(0deg)",
                    boxShadow: isHovered ? "0 4px 14px rgba(0, 0, 0, 0.08)" : "none",
                    transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)"
                  }}
                >
                  <Icon />
                </div>
                <div style={{ fontWeight: 800, fontSize: "1.02rem", color: "#1f2123" }}>
                  {item.name}
                </div>
                <div style={{ fontSize: "0.76rem", color: "#6b7280", fontWeight: 700, marginTop: "4px" }}>
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
