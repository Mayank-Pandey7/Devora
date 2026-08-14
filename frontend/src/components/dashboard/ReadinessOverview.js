import React from 'react';

export default function ReadinessOverview({ careerScore, interviewScore, resumeScore }) {
  // Score status label
  const getStatusLabel = (score) => {
    if (score >= 85) return 'Strong';
    if (score >= 70) return 'Improving';
    if (score > 0) return 'Needs Practice';
    return 'Not Started';
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftColumn}>
        <span style={styles.label}>DEVELOPER READINESS</span>
        <div style={styles.scoreRow}>
          <span style={styles.primaryScore}>
            {careerScore > 0 ? careerScore : '—'}
          </span>
          <span style={styles.scoreMax}>/ 100</span>
        </div>
        <div style={styles.statusMeta}>
          <span style={styles.statusPill}>
            {getStatusLabel(careerScore)}
          </span>
          <span style={styles.statusNote}>
            Aggregated from verified sessions & scans
          </span>
        </div>
      </div>

      <div style={styles.rightColumn}>
        {/* Interview Progress Bar */}
        <div style={styles.progressRow}>
          <div style={styles.progressHeader}>
            <span style={styles.progressTitle}>INTERVIEW READINESS</span>
            <span style={styles.progressVal}>
              {interviewScore > 0 ? `${interviewScore} / 100` : 'No data'}
            </span>
          </div>
          <div style={styles.progressBarTrack}>
            <div
              style={{
                ...styles.progressBarFill,
                width: `${Math.min(100, Math.max(0, interviewScore))}%`,
                background: interviewScore >= 80 ? '#4ade80' : '#6366f1'
              }}
            />
          </div>
        </div>

        {/* Resume ATS Progress Bar */}
        <div style={styles.progressRow}>
          <div style={styles.progressHeader}>
            <span style={styles.progressTitle}>RESUME ATS STRENGTH</span>
            <span style={styles.progressVal}>
              {resumeScore > 0 ? `${resumeScore} / 100` : 'No data'}
            </span>
          </div>
          <div style={styles.progressBarTrack}>
            <div
              style={{
                ...styles.progressBarFill,
                width: `${Math.min(100, Math.max(0, resumeScore))}%`,
                background: resumeScore >= 80 ? '#38bdf8' : '#6366f1'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '260px 1fr',
    gap: '2.5rem',
    background: '#0c111d',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    padding: '1.75rem',
    marginBottom: '2rem',
    alignItems: 'center',
  },
  leftColumn: {
    borderRight: '1px solid #1e293b',
    paddingRight: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '0.68rem',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
    marginBottom: '0.5rem',
  },
  scoreRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.35rem',
  },
  primaryScore: {
    fontSize: '3.25rem',
    fontWeight: 900,
    color: '#f8fafc',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
    lineHeight: 1,
    letterSpacing: '-0.03em',
  },
  scoreMax: {
    fontSize: '1rem',
    color: '#64748b',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
    fontWeight: 600,
  },
  statusMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    marginTop: '0.75rem',
  },
  statusPill: {
    alignSelf: 'flex-start',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '4px',
    background: '#1e293b',
    color: '#cbd5e1',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
  statusNote: {
    fontSize: '0.72rem',
    color: '#64748b',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  progressRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#94a3b8',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
  progressVal: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: '#f8fafc',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
  progressBarTrack: {
    width: '100%',
    height: '6px',
    background: '#1e293b',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
};
