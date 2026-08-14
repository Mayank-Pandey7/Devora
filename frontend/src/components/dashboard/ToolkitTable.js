import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function ToolkitTable({ stats }) {
  const navigate = useNavigate();

  const interviewScore = stats?.interviewScore || 0;
  const resumeScore = stats?.resumeScore || 0;

  const getStatus = (score) => {
    if (score >= 85) return { label: 'Excellent', color: '#4ade80' };
    if (score >= 70) return { label: 'Strong', color: '#818cf8' };
    if (score > 0) return { label: 'Improving', color: '#facc15' };
    return { label: 'Not Started', color: '#64748b' };
  };

  const rows = [
    {
      area: 'Technical Interview',
      desc: 'Coding, DSA, architecture & behavioral answers',
      score: interviewScore > 0 ? `${interviewScore} / 100` : '—',
      status: getStatus(interviewScore),
      actionText: 'Practice',
      to: '/interview',
    },
    {
      area: 'Resume ATS Compatibility',
      desc: 'PDF structure, keyword density & job matching',
      score: resumeScore > 0 ? `${resumeScore} / 100` : '—',
      status: getStatus(resumeScore),
      actionText: 'Audit',
      to: '/resume-analyzer',
    },
    {
      area: 'Developer Profile',
      desc: `${stats?.skills?.length || 3} verified technologies • ${stats?.experienceLevel || 'Mid-Level'}`,
      score: 'Active',
      status: { label: 'Configured', color: '#94a3b8' },
      actionText: 'Edit',
      to: '/profile',
    },
  ];

  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionTitle}>YOUR TOOLKIT</span>
      </div>

      <div style={styles.tableContainer}>
        <div style={styles.tableHead}>
          <div style={{ flex: 2 }}>AREA</div>
          <div style={{ flex: 1, textAlign: 'center' }}>SCORE</div>
          <div style={{ flex: 1, textAlign: 'center' }}>STATUS</div>
          <div style={{ flex: 0.8, textAlign: 'right' }}>ACTION</div>
        </div>

        <div style={styles.tableBody}>
          {rows.map((row, idx) => (
            <div
              key={idx}
              onClick={() => navigate(row.to)}
              style={styles.tableRow}
              className="devora-table-row"
            >
              <div style={{ flex: 2 }}>
                <div style={styles.areaName}>{row.area}</div>
                <div style={styles.areaDesc}>{row.desc}</div>
              </div>

              <div style={{ flex: 1, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#f8fafc', fontSize: '0.88rem' }}>
                {row.score}
              </div>

              <div style={{ flex: 1, textAlign: 'center' }}>
                <span
                  style={{
                    ...styles.statusTag,
                    color: row.status.color,
                    borderColor: row.status.color + '40',
                  }}
                >
                  {row.status.label}
                </span>
              </div>

              <div style={{ flex: 0.8, textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '2px', color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
                <span>{row.actionText}</span>
                <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .devora-table-row {
          transition: background 0.15s ease;
        }
        .devora-table-row:hover {
          background: #111726 !important;
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
  tableContainer: {
    background: '#0c111d',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  tableHead: {
    display: 'flex',
    padding: '0.75rem 1.25rem',
    background: '#080c14',
    borderBottom: '1px solid #1e293b',
    fontSize: '0.65rem',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
  tableBody: {
    display: 'flex',
    flexDirection: 'column',
  },
  tableRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #1e293b',
    cursor: 'pointer',
    gap: '0.5rem',
  },
  areaName: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#f8fafc',
  },
  areaDesc: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    marginTop: '2px',
  },
  statusTag: {
    fontSize: '0.68rem',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '4px',
    background: '#090d16',
    border: '1px solid',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
};
