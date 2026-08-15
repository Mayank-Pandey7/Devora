import React, { useState } from "react";

// Official high-fidelity vector logos for modern technology stacks
const JavaScriptIcon = () => (
  <svg viewBox="0 0 128 128" width="30" height="30">
    <rect width="128" height="128" rx="18" fill="#F7DF1E" />
    <path fill="#000000" d="M67.3 103.5c3.3 5.3 7.6 9.3 15 9.3 6.3 0 10.3-3.1 10.3-7.4 0-5.2-4.1-7-11-10l-3.8-1.6c-10.8-4.6-18-10.4-18-22.9 0-11.4 8.7-20.1 22.4-20.1 9.7 0 16.6 3.4 21.5 12.1l-11.4 7.3c-2.4-4.4-5.2-6.1-10.1-6.1-4.6 0-7.6 3-7.6 6.7 0 4.6 3 6.5 9.6 9.4l3.8 1.6c12.8 5.4 19.4 11.3 19.4 23.8 0 13.6-10.7 21.4-25 21.4-13.9 0-22.7-6.8-27.2-15.9l12.1-7.6zm-45.7-1.3c2.4 4.1 5.7 7.1 11.4 7.1 6 0 9.8-2.4 9.8-12.1V51.8h14.4v46.9c0 17.6-10.2 25.3-24.4 25.3-12 0-19.2-6-23-14.4l11.8-7.4z" />
  </svg>
);

const TypeScriptIcon = () => (
  <svg viewBox="0 0 128 128" width="30" height="30">
    <rect width="128" height="128" rx="18" fill="#3178C6" />
    <path fill="#FFFFFF" d="M35.6 51.5h16.2v64H68v-64h16.2V37.6H35.6v13.9zm49.9 44.7c4.1 3.5 9.4 5.4 15 5.2 6.5 0 10.9-2.8 10.9-7.4 0-4.7-3.6-6.8-11.9-10.3-13.7-5.8-19.8-11.9-19.8-22.7 0-13 10.4-22.4 25.6-22.4 9.4-.2 18.5 3.3 25.3 9.8l-7.7 9.8c-4.3-4.1-10.1-6.4-16.1-6.3-5.8 0-9.6 2.6-9.6 6.5 0 4.1 3.2 5.9 10.9 9.3 14.1 5.9 20.8 12.3 20.8 23.6 0 13.9-10.7 23.4-27 23.4-10.9.3-21.5-4.1-28.7-12l6.3-7.4z"/>
  </svg>
);

const ReactIcon = () => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" width="32" height="32">
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
    <g stroke="#61DAFB" strokeWidth="1.2" fill="none">
      <ellipse rx="11" ry="4.2"/>
      <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
      <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
    </g>
  </svg>
);

const NextjsIcon = () => (
  <svg viewBox="0 0 128 128" width="30" height="30">
    <circle cx="64" cy="64" r="64" fill="#000000"/>
    <path d="M106.3 111.9L49.2 38.4H38.4V89.6H47.1V49.3L99.5 117.2c2.4-1.6 4.7-3.4 6.8-5.3z" fill="#FFFFFF"/>
    <rect x="81.7" y="38.4" width="8.5" height="51.2" fill="#FFFFFF"/>
  </svg>
);

const NodejsIcon = () => (
  <svg viewBox="0 0 128 128" width="32" height="32">
    <path fill="#339933" d="M64 8.7L115.3 38.3V97.7L64 127.3L12.7 97.7V38.3L64 8.7Z"/>
    <path fill="#FFFFFF" d="M64 26.6C54.4 26.6 47 31.9 47 41.2C47 48.7 51.6 53.3 58.9 55.4L64 56.8C68.6 58.1 71.3 60.1 71.3 63.8C71.3 68.2 67.5 71.3 61.6 71.3C55.4 71.3 51.1 68.1 48.8 63.3L39.8 68.6C43.5 76.5 51.7 81.3 61.6 81.3C73.1 81.3 81.3 74.8 81.3 63.6C81.3 56.3 76.8 51.4 69.3 49.3L64.2 47.9C59.9 46.7 57.3 44.8 57.3 41.4C57.3 37.3 60.8 34.6 65.7 34.6C71.1 34.6 74.9 37.2 76.9 41.6L85.6 36.4C81.9 29.8 74.6 26.6 64 26.6Z"/>
  </svg>
);

const PythonIcon = () => (
  <svg viewBox="0 0 128 128" width="30" height="30">
    <path fill="#3776AB" d="M63.4 8.7c-29.2 0-27.4 12.7-27.4 12.7l.03 13.1h28.1v3.9H25.3S10 36.3 10 65.8c0 29.5 13.3 28.5 13.3 28.5h7.9V80.4s-.4-17.6 17.3-17.6h27.8s16.4.3 16.4-16V22.2s.5-13.5-29.3-13.5zm-15.3 8.9c2.9 0 5.4 2.5 5.4 5.4s-2.5 5.4-5.4 5.4-5.4-2.5-5.4-5.4 2.5-5.4 5.4-5.4z"/>
    <path fill="#FFD438" d="M64.6 119.3c29.2 0 27.4-12.7 27.4-12.7l-.03-13.1H63.9v-3.9h38.8s15.3 2.1 15.3-27.4c0-29.5-13.3-28.5-13.3-28.5h-7.9v13.9s.4 17.6-17.3 17.6H51.6s-16.4-.3-16.4 16v14.4s-.5 13.7 29.4 13.7zm15.3-8.9c-2.9 0-5.4-2.5-5.4-5.4s2.5-5.4 5.4-5.4 5.4 2.5 5.4 5.4-2.5 5.4-5.4 5.4z"/>
  </svg>
);

const PostgresIcon = () => (
  <svg viewBox="0 0 128 128" width="30" height="30">
    <path fill="#336791" d="M64.2 12c-23.7 0-42.8 17.5-42.8 39.2 0 12.8 6.7 24.3 17.1 31.7-.5 2.1-1.5 5-2.9 8.2 6.8-1.5 13.2-5.4 17.8-10.2 3.4.9 7 1.3 10.8 1.3 23.7 0 42.8-17.5 42.8-39.2S87.9 12 64.2 12zM52 42c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm32 30c-5.5 0-10.5-2.2-14.2-5.8 4.2-3.8 6.8-9.2 6.8-15.2 0-1.8-.2-3.5-.7-5.2 6.1 2.8 10.3 8.8 10.3 15.8 0 5.7-2.9 10.4-2.2 10.4z"/>
    <circle cx="52" cy="36" r="3" fill="#FFFFFF"/>
  </svg>
);

const DockerIcon = () => (
  <svg viewBox="0 0 128 128" width="32" height="32">
    <path fill="#2496ED" d="M120 56.4c-2.2-1.5-7.4-1.9-11.7 1-.8-3.2-3.2-6.3-5.9-8.2l-4.1-2.8-2.7 4.2c-3.6 5.7-4.1 12.6-1.3 18.2-3.3 1.9-8.3 1.9-12.8.5l-2.8-.8-.9 2.8c-2.8 9.3-8.8 16.3-17.6 20.6-6.9 3.3-14.8 4.2-22.2 3.3-12.1-1.9-22.3-8.4-29.2-18.6-1.9-2.8-3.2-5.6-4.1-8.9h-3.7c-3.7 0-6.9 1.5-9.3 3.7-1.9 1.9-3.2 4.7-3.2 7.4 0 17.7 16.2 32.1 36.1 32.1 27 0 48.9-14.5 57.3-34.9 11.2.5 21-7 22.9-17.3l.5-2.3-5.3-2zM32 47h14v11.6H32zm18 0H64v11.6H50zm18 0H82v11.6H68zm-18-14H64v11.6H50zm18 0H82v11.6H68zm18 14h14v11.6H86zm-36-28H64v11.6H50zm18 0H82v11.6H68z"/>
  </svg>
);

const AwsIcon = () => (
  <svg viewBox="0 0 128 128" width="34" height="34">
    <path fill="#232F3E" d="M43.5 68.6c0 2.5.8 4.7 2.2 6.5 1.7 1.8 3.9 2.6 6.5 2.6 3.5 0 6.5-1.7 8.3-4.8V53.2c-1.7-.4-3.9-.9-6.1-.9-7 0-10.9 4.3-10.9 16.3zm17 14.8c-2.6 2.6-6.5 3.9-10.9 3.9-5.7 0-10-1.7-13.1-4.8-3.1-3.5-4.8-7.9-4.8-13.1 0-5.7 1.7-10 5.2-13.5 3.5-3.5 8.3-5.2 14.4-5.2 3.1 0 6.1.4 8.7 1.3V46.6c0-7.9-4.3-11.4-10.9-11.4-3.9 0-7.4 1.3-10.5 3.9l-3.9-6.1c4.4-3.5 9.6-5.2 15.7-5.2 6.1 0 10.9 1.7 14 4.8 3.1 3.1 4.8 7.9 4.8 14v28.8h-7.9l-.8-4.4zm36.2-32.8l-10.5 38h-9.2L68.8 58.7l-8.3 30.1h-9.2l-10.5-38h8.7l6.5 27.5 8.3-27.5h8.7l8.3 27.5 6.5-27.5h8.7z"/>
    <path fill="#FF9900" d="M21.5 89.6c20.9 10.9 48.8 10.9 69.8 0 2.2-1.3 4.8.9 3.5 3.1-11.4 10-27.9 15.3-45.3 15.3-16.6 0-31.9-5.2-42.8-14.8-1.7-1.8.4-3.9 2.6-3.5zm68-1.8c2.2-.4 6.5-2.2 8.3-5.2.9-1.8 1.7-4.4 1.3-5.7 0-.4-.4-.4-.9 0-2.6 2.2-7 3.5-9.6 3.9-1.3.4-.9 2.2.9 2.6z"/>
  </svg>
);

const SystemDesignIcon = () => (
  <svg viewBox="0 0 128 128" width="30" height="30">
    <rect x="14" y="16" width="36" height="28" rx="8" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="6"/>
    <rect x="78" y="16" width="36" height="28" rx="8" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="6"/>
    <rect x="46" y="84" width="36" height="28" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="6"/>
    <path d="M32 44v24h64V44M64 68v16" fill="none" stroke="#1F2123" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="32" cy="30" r="4" fill="#4F46E5"/>
    <circle cx="96" cy="30" r="4" fill="#4F46E5"/>
    <circle cx="64" cy="98" r="4" fill="#D97706"/>
  </svg>
);

const DsaIcon = () => (
  <svg viewBox="0 0 128 128" width="30" height="30">
    <path d="M64 36L34 76M64 36l30 40M34 76l-16 32M34 76l18 32M94 76l-18 32M94 76l18 32" fill="none" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="64" cy="28" r="16" fill="#0EA5E9"/>
    <circle cx="34" cy="72" r="14" fill="#38BDF8"/>
    <circle cx="94" cy="72" r="14" fill="#38BDF8"/>
    <circle cx="18" cy="108" r="10" fill="#7DD3FC"/>
    <circle cx="52" cy="108" r="10" fill="#7DD3FC"/>
    <circle cx="76" cy="108" r="10" fill="#7DD3FC"/>
    <circle cx="112" cy="108" r="10" fill="#7DD3FC"/>
  </svg>
);

const GraphqlIcon = () => (
  <svg viewBox="0 0 128 128" width="30" height="30">
    <path d="M64 14l43.3 25v50L64 114 20.7 89V39L64 14z" fill="none" stroke="#E10098" strokeWidth="8"/>
    <polygon points="64 22 102 88 26 88" fill="none" stroke="#E10098" strokeWidth="8"/>
    <circle cx="64" cy="14" r="10" fill="#E10098"/>
    <circle cx="107.3" cy="39" r="10" fill="#E10098"/>
    <circle cx="107.3" cy="89" r="10" fill="#E10098"/>
    <circle cx="64" cy="114" r="10" fill="#E10098"/>
    <circle cx="20.7" cy="89" r="10" fill="#E10098"/>
    <circle cx="20.7" cy="39" r="10" fill="#E10098"/>
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

        {/* Tech Ecosystem Grid with High-Fidelity Brand Logos and Smooth Card Lift */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1.2rem" }}>
          {TECH_ITEMS.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  padding: "1.5rem 1.15rem",
                  background: "#ffffff",
                  border: isHovered ? "1.5px solid #1f2123" : "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "22px",
                  textAlign: "center",
                  boxShadow: isHovered ? "0 16px 36px rgba(0, 0, 0, 0.09)" : "0 4px 15px rgba(0, 0, 0, 0.02)",
                  transform: isHovered ? "translateY(-6px) scale(1.03)" : "translateY(0) scale(1)",
                  cursor: "pointer",
                  transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)"
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: "#f8f9fa",
                    border: "1px solid rgba(0,0,0,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 0.85rem auto",
                    transform: isHovered ? "scale(1.12) rotate(-4deg)" : "scale(1) rotate(0deg)",
                    boxShadow: isHovered ? "0 6px 16px rgba(0, 0, 0, 0.08)" : "0 2px 6px rgba(0, 0, 0, 0.02)",
                    transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)"
                  }}
                >
                  <Icon />
                </div>
                <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#1f2123" }}>
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
