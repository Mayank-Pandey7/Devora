import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function RecentActivity({ activityFeed = [] }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) return 'Today';
    
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionTitle}>RECENT ACTIVITY</span>
      </div>

      <div style={styles.container}>
        {activityFeed.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyTitle}>NO ACTIVITY YET</div>
            <p style={styles.emptyDesc}>
              Your work will appear here after your first interview session or resume analysis.
            </p>
            <Link to="/interview" style={styles.emptyAction}>
              Start first interview session <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div style={styles.activityList}>
            {activityFeed.map((item, idx) => (
              <div
                key={item.id || idx}
                style={styles.activityRow}
                className="devora-activity-row"
              >
                <div style={styles.dateCol}>
                  {formatDate(item.date)}
                </div>

                <div style={styles.typeCol}>
                  <span style={styles.typeTag}>
                    {item.type === 'interview' ? 'INTERVIEW' : 'RESUME'}
                  </span>
                </div>

                <div style={styles.titleCol}>
                  <span style={styles.itemTitle}>{item.title}</span>
                  <span style={styles.itemDetail}>{item.detail}</span>
                </div>

                <div style={styles.scoreCol}>
                  {item.score !== null && item.score !== undefined ? (
                    <span
                      style={{
                        ...styles.scorePill,
                        color: item.score >= 80 ? '#4ade80' : '#cbd5e1',
                        borderColor: item.score >= 80 ? 'rgba(34, 197, 94, 0.3)' : '#334155'
                      }}
                    >
                      {item.score}%
                    </span>
                  ) : (
                    <span style={styles.inProgressTag}>In progress</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .devora-activity-row {
          transition: background 0.15s ease;
        }
        .devora-activity-row:hover {
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
  container: {
    background: '#0c111d',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  emptyState: {
    padding: '2.5rem 1.5rem',
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
    margin: '0 0 1rem 0',
  },
  emptyAction: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#6366f1',
    textDecoration: 'none',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
  },
  activityRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.85rem 1.25rem',
    borderBottom: '1px solid #1e293b',
    gap: '1rem',
  },
  dateCol: {
    width: '75px',
    fontSize: '0.75rem',
    color: '#64748b',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
    flexShrink: 0,
  },
  typeCol: {
    width: '90px',
    flexShrink: 0,
  },
  typeTag: {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: '#94a3b8',
    background: '#090d16',
    border: '1px solid #1e293b',
    padding: '2px 6px',
    borderRadius: '4px',
    letterSpacing: '0.06em',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
  titleCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },
  itemTitle: {
    fontSize: '0.88rem',
    fontWeight: 600,
    color: '#f8fafc',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemDetail: {
    fontSize: '0.72rem',
    color: '#64748b',
  },
  scoreCol: {
    flexShrink: 0,
    textAlign: 'right',
  },
  scorePill: {
    fontSize: '0.78rem',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '4px',
    border: '1px solid',
    background: '#090d16',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
  inProgressTag: {
    fontSize: '0.7rem',
    color: '#64748b',
    fontStyle: 'italic',
  },
};
