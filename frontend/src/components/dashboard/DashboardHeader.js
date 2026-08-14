import React from 'react';

export default function DashboardHeader({ user, targetRole }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'Developer';

  return (
    <div style={styles.header}>
      <div style={styles.topRow}>
        <span style={styles.sectionTag}>DASHBOARD</span>
        <span style={styles.roleTag}>{targetRole || 'Full Stack Developer'}</span>
      </div>
      <h1 style={styles.greeting}>
        {getGreeting()}, {firstName}.
      </h1>
      <p style={styles.subtext}>
        Track what you've practiced, reviewed, and improved.
      </p>
    </div>
  );
}

const styles = {
  header: {
    marginBottom: '2rem',
    borderBottom: '1px solid #1e293b',
    paddingBottom: '1.25rem',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.35rem',
  },
  sectionTag: {
    fontSize: '0.68rem',
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
  roleTag: {
    fontSize: '0.68rem',
    fontWeight: 600,
    color: '#94a3b8',
    background: '#0f172a',
    border: '1px solid #1e293b',
    padding: '2px 8px',
    borderRadius: '4px',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
  greeting: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#f8fafc',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  subtext: {
    fontSize: '0.88rem',
    color: '#94a3b8',
    margin: '0.25rem 0 0 0',
  },
};
