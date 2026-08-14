import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mic, FileText, User } from 'lucide-react';

const TOOLS = [
  {
    to: '/interview',
    tag: 'INTERVIEW PREPARATION',
    title: 'Practice Technical & Mock Interviews',
    desc: 'Simulate live rounds across JavaScript, React, System Design, or DSA with real-time AI scoring.',
    icon: Mic,
  },
  {
    to: '/resume-analyzer',
    tag: 'RESUME & ATS AUDIT',
    title: 'Analyze Resume & Match Job Description',
    desc: 'Extract technical keywords, benchmark ATS compatibility, and identify missing requirements.',
    icon: FileText,
  },
  {
    to: '/profile',
    tag: 'DEVELOPER PROFILE',
    title: 'Configure Role & Tech Stack',
    desc: 'Keep your target position, seniority level, and core skills up to date.',
    icon: User,
  },
];

export default function ContinueWorking() {
  const navigate = useNavigate();

  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionTitle}>CONTINUE WORKING</span>
      </div>

      <div style={styles.toolsList}>
        {TOOLS.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <div
              key={idx}
              onClick={() => navigate(tool.to)}
              style={styles.toolRow}
              className="devora-tool-row"
            >
              <div style={styles.toolLeft}>
                <div style={styles.iconBox}>
                  <Icon size={16} color="#94a3b8" />
                </div>
                <div style={styles.textGroup}>
                  <span style={styles.toolTag}>{tool.tag}</span>
                  <div style={styles.toolTitle}>{tool.title}</div>
                  <div style={styles.toolDesc}>{tool.desc}</div>
                </div>
              </div>

              <div style={styles.actionBtn}>
                <span>Continue</span>
                <ArrowRight size={14} className="arrow-icon" />
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .devora-tool-row {
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .devora-tool-row:hover {
          background: #131b2e !important;
          border-color: #334155 !important;
        }
        .devora-tool-row:hover .arrow-icon {
          transform: translateX(3px);
          transition: transform 0.15s ease;
        }
      `}</style>
    </div>
  );
}

const styles = {
  section: {
    marginBottom: '2rem',
  },
  sectionHeader: {
    marginBottom: '0.75rem',
  },
  sectionTitle: {
    fontSize: '0.68rem',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
  toolsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
  },
  toolRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#0c111d',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    padding: '1rem 1.25rem',
    cursor: 'pointer',
    gap: '1rem',
  },
  toolLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flex: 1,
    minWidth: 0,
  },
  iconBox: {
    width: '34px',
    height: '34px',
    borderRadius: '6px',
    background: '#0f172a',
    border: '1px solid #1e293b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },
  toolTag: {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
  toolTitle: {
    fontSize: '0.92rem',
    fontWeight: 700,
    color: '#f8fafc',
  },
  toolDesc: {
    fontSize: '0.78rem',
    color: '#94a3b8',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#cbd5e1',
    flexShrink: 0,
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
};
