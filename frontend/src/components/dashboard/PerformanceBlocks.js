import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function PerformanceBlocks({ stats, latestInterview, latestResume }) {
  const avgInterviewScore = stats?.interviewScore || 0;
  const completedRounds = stats?.completedInterviews || 0;
  const resumeScore = stats?.resumeScore || 0;

  return (
    <div style={styles.grid}>
      {/* Block 1: Interview Performance */}
      <div style={styles.block}>
        <div style={styles.blockHeader}>
          <span style={styles.blockTag}>INTERVIEW PERFORMANCE</span>
          <Link to="/interview" style={styles.blockLink}>
            Practice <ArrowRight size={12} />
          </Link>
        </div>

        <div style={styles.metricRow}>
          <div style={styles.metricItem}>
            <span style={styles.metricLabel}>AVERAGE SCORE</span>
            <span style={styles.metricValue}>
              {avgInterviewScore > 0 ? `${avgInterviewScore}%` : '—'}
            </span>
          </div>
          <div style={styles.metricItem}>
            <span style={styles.metricLabel}>COMPLETED ROUNDS</span>
            <span style={styles.metricValue}>{completedRounds}</span>
          </div>
          <div style={styles.metricItem}>
            <span style={styles.metricLabel}>TARGET ROLE</span>
            <span style={{ ...styles.metricValue, fontSize: '0.95rem' }}>
              {stats?.targetRole || 'Full Stack'}
            </span>
          </div>
        </div>

        <div style={styles.blockFooter}>
          {latestInterview ? (
            <span style={styles.footerNote}>
              Last session: {latestInterview.title} • {new Date(latestInterview.date).toLocaleDateString()}
            </span>
          ) : (
            <span style={styles.footerNote}>
              No interview sessions recorded yet.
            </span>
          )}
        </div>
      </div>

      {/* Block 2: Resume Status */}
      <div style={styles.block}>
        <div style={styles.blockHeader}>
          <span style={styles.blockTag}>RESUME STATUS</span>
          <Link to="/resume-analyzer" style={styles.blockLink}>
            Audit <ArrowRight size={12} />
          </Link>
        </div>

        <div style={styles.metricRow}>
          <div style={styles.metricItem}>
            <span style={styles.metricLabel}>ATS SCORE</span>
            <span style={styles.metricValue}>
              {resumeScore > 0 ? `${resumeScore}%` : '—'}
            </span>
          </div>
          <div style={styles.metricItem}>
            <span style={styles.metricLabel}>TOTAL AUDITS</span>
            <span style={styles.metricValue}>{stats?.totalResumes || 0}</span>
          </div>
          <div style={styles.metricItem}>
            <span style={styles.metricLabel}>STATUS</span>
            <span style={{ ...styles.metricValue, fontSize: '0.95rem', color: resumeScore >= 80 ? '#4ade80' : '#cbd5e1' }}>
              {resumeScore >= 80 ? 'High Pass' : resumeScore > 0 ? 'Review Needed' : 'Unscanned'}
            </span>
          </div>
        </div>

        <div style={styles.blockFooter}>
          {latestResume ? (
            <span style={styles.footerNote}>
              Latest file: {latestResume.title} • {new Date(latestResume.date).toLocaleDateString()}
            </span>
          ) : (
            <span style={styles.footerNote}>
              No resume audited yet.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2rem',
  },
  block: {
    background: '#0c111d',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  blockHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  blockTag: {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
  blockLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: '#94a3b8',
    textDecoration: 'none',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
  metricRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  metricItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  metricLabel: {
    fontSize: '0.62rem',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
  metricValue: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#f8fafc',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
  blockFooter: {
    borderTop: '1px solid #1e293b',
    paddingTop: '0.65rem',
  },
  footerNote: {
    fontSize: '0.72rem',
    color: '#64748b',
  },
};
