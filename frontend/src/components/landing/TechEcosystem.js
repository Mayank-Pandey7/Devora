import React, { useState } from "react";

// High-fidelity authentic vector logos for modern technology stacks
const JavaScriptIcon = () => (
  <svg viewBox="0 0 128 128" width="28" height="28">
    <path fill="#F7DF1E" d="M0 0h128v128H0z"/>
    <path d="M67.312 103.504c3.264 5.344 7.6 9.328 15.008 9.328 6.272 0 10.256-3.12 10.256-7.44 0-5.168-4.112-7.04-10.976-10.016l-3.76-1.6c-10.8-4.64-17.968-10.368-17.968-22.896 0-11.408 8.704-20.096 22.368-20.096 9.712 0 16.64 3.408 21.536 12.096l-11.44 7.344c-2.448-4.352-5.168-6.128-10.096-6.128-4.624 0-7.6 2.992-7.6 6.656 0 4.624 2.992 6.528 9.648 9.392l3.76 1.616c12.784 5.44 19.44 11.28 19.44 23.84 0 13.6-10.736 21.36-24.96 21.36-13.872 0-22.704-6.8-27.184-15.936l11.968-7.536zm-45.744-1.28c2.448 4.08 5.712 7.072 11.424 7.072 5.984 0 9.792-2.448 9.792-12.096V51.792h14.4v46.912c0 17.552-10.208 25.312-24.352 25.312-11.968 0-19.168-5.984-22.992-14.416l11.728-7.376z"/>
  </svg>
);

const TypeScriptIcon = () => (
  <svg viewBox="0 0 128 128" width="28" height="28">
    <path fill="#3178C6" d="M0 0h128v128H0z"/>
    <path fill="#FFF" d="M35.6 51.5h16.2v64H68v-64h16.2V37.6H35.6v13.9zm49.9 44.7c4.1 3.5 9.4 5.4 15 5.2 6.5 0 10.9-2.8 10.9-7.4 0-4.7-3.6-6.8-11.9-10.3-13.7-5.8-19.8-11.9-19.8-22.7 0-13 10.4-22.4 25.6-22.4 9.4-.2 18.5 3.3 25.3 9.8l-7.7 9.8c-4.3-4.1-10.1-6.4-16.1-6.3-5.8 0-9.6 2.6-9.6 6.5 0 4.1 3.2 5.9 10.9 9.3 14.1 5.9 20.8 12.3 20.8 23.6 0 13.9-10.7 23.4-27 23.4-10.9.3-21.5-4.1-28.7-12l6.3-7.4z"/>
  </svg>
);

const ReactIcon = () => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" width="30" height="30">
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
    <g stroke="#61DAFB" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2"/>
      <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
      <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
    </g>
  </svg>
);

const NextjsIcon = () => (
  <svg viewBox="0 0 180 180" width="28" height="28">
    <mask height="180" id="mask0_next_eco" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: "alpha" }}>
      <circle cx="90" cy="90" fill="black" r="90" />
    </mask>
    <g mask="url(#mask0_next_eco)">
      <circle cx="90" cy="90" fill="black" r="90" />
      <path d="M149.508 157.438L69.1478 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z" fill="url(#paint0_linear_next_eco)" />
      <rect fill="url(#paint1_linear_next_eco)" height="72" width="12" x="115" y="54" />
    </g>
    <defs>
      <linearGradient id="paint0_linear_next_eco" x1="109" x2="144.5" y1="116.5" y2="160.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="paint1_linear_next_eco" x1="121" x2="120.799" y1="54" y2="106.875" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

const NodejsIcon = () => (
  <svg viewBox="0 0 256 289" width="28" height="28">
    <path fill="#539E43" d="M128 0L256 73.9v141.2L128 289 0 215.1V73.9L128 0z"/>
    <path fill="#333333" d="M128 26.6l103.5 59.8v114.2L128 260.4 24.5 200.6V86.4L128 26.6z"/>
    <path fill="#539E43" d="M128 48.7l83.8 48.4v92.5L128 238 44.2 189.6V97.1L128 48.7z"/>
    <path fill="#FFFFFF" d="M128 72.8l63.5 36.7v70.1L128 216.3 64.5 179.6v-70.1L128 72.8z"/>
  </svg>
);

const PythonIcon = () => (
  <svg viewBox="0 0 110 110" width="28" height="28">
    <path fill="url(#python-blue)" d="M54.5 0C24.8 0 26.5 12.8 26.5 12.8l.03 13.3h28.5v4H15.6S0 27.9 0 57.8c0 30 13.5 29 13.5 29h8.1V71.7s-.4-17.9 17.6-17.9h28.3s16.7.3 16.7-16.3V13.8S86.6 0 54.5 0zm-15.6 9c3 0 5.5 2.5 5.5 5.5 0 3-2.5 5.5-5.5 5.5s-5.5-2.5-5.5-5.5c0-3 2.5-5.5 5.5-5.5z"/>
    <path fill="url(#python-yellow)" d="M55.5 110c29.7 0 28-12.8 28-12.8l-.03-13.3H55v-4h39.4S110 82.1 110 52.2c0-30-13.5-29-13.5-29h-8.1v15.1s.4 17.9-17.6 17.9H42.5s-16.7-.3-16.7 16.3v23.7S23.4 110 55.5 110zm15.6-9c-3 0-5.5-2.5-5.5-5.5 0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5c0 3-2.5 5.5-5.5 5.5z"/>
    <defs>
      <linearGradient id="python-blue" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stopColor="#387EB8"/>
        <stop offset="100%" stopColor="#366994"/>
      </linearGradient>
      <linearGradient id="python-yellow" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stopColor="#FFE873"/>
        <stop offset="100%" stopColor="#FFD43B"/>
      </linearGradient>
    </defs>
  </svg>
);

const PostgresIcon = () => (
  <svg viewBox="0 0 128 128" width="28" height="28">
    <path fill="#336791" d="M63.8 11.2c-29 0-52.6 23.6-52.6 52.6 0 17.7 8.8 33.3 22.3 42.8-1.5 3.3-3.6 6.3-6.2 8.7 11.8.8 22.3-4.2 29.5-12.4 2.3.3 4.6.5 7 .5 29 0 52.6-23.6 52.6-52.6 0-29-23.6-52.6-52.6-52.6zm-1.8 18.2c7.8 0 14.2 6.3 14.2 14.2 0 7.8-6.3 14.2-14.2 14.2-7.8 0-14.2-6.3-14.2-14.2 0-7.8 6.3-14.2 14.2-14.2zm24.6 60.6c-5.8 4.2-12.8 6.8-20.5 7.1-1.3 0-2.5-.1-3.8-.2 9.5-7.5 15.6-19.1 15.6-32.1 0-4-.6-7.8-1.7-11.4 8.7 6.7 14.3 17.2 14.3 29 0 6.6-1.5 12.8-3.9 17.6z"/>
    <circle cx="62" cy="43.6" r="6.5" fill="#FFFFFF"/>
    <circle cx="63.5" cy="43.6" r="3.5" fill="#336791"/>
  </svg>
);

const DockerIcon = () => (
  <svg viewBox="0 0 128 128" width="28" height="28">
    <path fill="#2496ED" d="M117.5 54.3c-2.1-1.4-7.2-1.8-11.4.9-.8-3.1-3.1-6.1-5.7-8l-4-2.7-2.6 4.1c-3.5 5.5-4 12.2-1.3 17.6-3.2 1.8-8 1.8-12.4.5l-2.7-.8-.9 2.7c-2.7 9-8.5 15.8-17 19.9-6.7 3.2-14.3 4.1-21.5 3.2-11.7-1.8-21.6-8.1-28.3-18-1.8-2.7-3.1-5.4-4-8.6h-3.6c-3.6 0-6.7 1.4-9 3.6-1.8 1.8-3.1 4.5-3.1 7.2 0 17.1 15.7 31.1 35 31.1 26.1 0 47.3-14 55.4-33.8 10.8.5 20.3-6.8 22.1-16.7l.5-2.2-5.4-2.2zM31.5 45h13.5v11.2H31.5zm18 0H63v11.2H49.5zm18 0H81v11.2H67.5zm-18-13.5H63v11.2H49.5zm18 0H81v11.2H67.5zm18 13.5H99v11.2H85.5z"/>
  </svg>
);

const AwsIcon = () => (
  <svg viewBox="0 0 128 128" width="30" height="30">
    <path fill="#232F3E" d="M43.5 68.6c0 2.5.8 4.7 2.2 6.5 1.7 1.8 3.9 2.6 6.5 2.6 3.5 0 6.5-1.7 8.3-4.8V53.2c-1.7-.4-3.9-.9-6.1-.9-7 0-10.9 4.3-10.9 16.3zm17 14.8c-2.6 2.6-6.5 3.9-10.9 3.9-5.7 0-10-1.7-13.1-4.8-3.1-3.5-4.8-7.9-4.8-13.1 0-5.7 1.7-10 5.2-13.5 3.5-3.5 8.3-5.2 14.4-5.2 3.1 0 6.1.4 8.7 1.3V46.6c0-7.9-4.3-11.4-10.9-11.4-3.9 0-7.4 1.3-10.5 3.9l-3.9-6.1c4.4-3.5 9.6-5.2 15.7-5.2 6.1 0 10.9 1.7 14 4.8 3.1 3.1 4.8 7.9 4.8 14v28.8h-7.9l-.8-4.4zm36.2-32.8l-10.5 38h-9.2L68.8 58.7l-8.3 30.1h-9.2l-10.5-38h8.7l6.5 27.5 8.3-27.5h8.7l8.3 27.5 6.5-27.5h8.7z"/>
    <path fill="#FF9900" d="M21.5 89.6c20.9 10.9 48.8 10.9 69.8 0 2.2-1.3 4.8.9 3.5 3.1-11.4 10-27.9 15.3-45.3 15.3-16.6 0-31.9-5.2-42.8-14.8-1.7-1.8.4-3.9 2.6-3.5zm68-1.8c2.2-.4 6.5-2.2 8.3-5.2.9-1.8 1.7-4.4 1.3-5.7 0-.4-.4-.4-.9 0-2.6 2.2-7 3.5-9.6 3.9-1.3.4-.9 2.2.9 2.6z"/>
  </svg>
);

const SystemDesignIcon = () => (
  <svg viewBox="0 0 128 128" width="28" height="28">
    <rect x="14" y="16" width="36" height="28" rx="8" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="6"/>
    <rect x="78" y="16" width="36" height="28" rx="8" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="6"/>
    <rect x="46" y="84" width="36" height="28" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="6"/>
    <path d="M32 44v24h64V44M64 68v16" fill="none" stroke="#1F2123" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="32" cy="30" r="3" fill="#4F46E5"/>
    <circle cx="96" cy="30" r="3" fill="#4F46E5"/>
    <circle cx="64" cy="98" r="3" fill="#D97706"/>
  </svg>
);

const DsaIcon = () => (
  <svg viewBox="0 0 128 128" width="28" height="28">
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
  <svg viewBox="0 0 128 128" width="28" height="28">
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
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "#f8f9fa",
                    border: "1px solid rgba(0,0,0,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 0.85rem auto",
                    transform: isHovered ? "scale(1.15) rotate(-4deg)" : "scale(1) rotate(0deg)",
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
