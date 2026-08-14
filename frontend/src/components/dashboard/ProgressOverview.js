import React from 'react';

export default function ProgressOverview({ stats, progressChart = [] }) {
  const hasHistory = (stats?.totalInterviews > 0 || stats?.totalResumes > 0);

  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <div>
          <span style={styles.sectionTitle}>PROGRESS</span>
          <div style={styles.sectionSub}>Your performance trajectory over time.</div>
        </div>
      </div>

      <div style={styles.container}>
        {!hasHistory ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyTitle}>YOUR PROGRESS WILL APPEAR HERE</div>
            <p style={styles.emptyDesc}>
              Complete a few interview sessions or resume scans to begin charting your score progression.
            </p>
          </div>
        ) : (
          <div style={styles.chartBlock}>
            <div style={styles.timelineRow}>
              {progressChart.map((step, idx) => (
                <div key={idx} style={styles.timelineStep}>
                  <div style={styles.stepLabel}>{step.label}</div>
                  <div style={styles.scoreBarContainer}>
                    <div
                      style={{
                        ...styles.scoreBarFill,
                        height: `${step.career}%`,
                        background: idx === progressChart.length - 1 ? '#6366f1' : '#334155'
                      }}
                    />
                  </div>
                  <div style={styles.stepValue}>{step.career}%</div>
                </div>
              ))}
            </div>
            <div style={styles.chartLegend}>
              <span style={styles.legendItem}>
                <span style={{ ...styles.legendDot, background: '#6366f1' }} />
                Overall Readiness Benchmark
              </span>
            </div>
          </div>
        )}
      </div>
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
  sectionSub: {
    fontSize: '0.78rem',
    color: '#94a3b8',
    marginTop: '2px',
  },
  container: {
    background: '#0c111d',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    padding: '1.5rem',
  },
  emptyState: {
    padding: '2rem 1rem',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#94a3b8',
    letterSpacing: '0.08em',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
    marginBottom: '0.35rem',
  },
  emptyDesc: {
    fontSize: '0.82rem',
    color: '#64748b',
    margin: 0,
  },
  chartBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  timelineRow: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '140px',
    padding: '0.5rem 0',
    borderBottom: '1px solid #1e293b',
  },
  timelineStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    height: '100%',
    justifyContent: 'flex-end',
  },
  stepLabel: {
    fontSize: '0.72rem',
    color: '#64748b',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
  scoreBarContainer: {
    width: '32px',
    height: '90px',
    background: '#090d16',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'flex-end',
    overflow: 'hidden',
    border: '1px solid #1e293b',
  },
  scoreBarFill: {
    width: '100%',
    borderRadius: '3px 3px 0 0',
    transition: 'height 0.4s ease',
  },
  stepValue: {
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#f8fafc',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
  chartLegend: {
    display: 'flex',
    justifyContent: 'center',
  },
  legendItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.75rem',
    color: '#94a3b8',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '2px',
  },
};
