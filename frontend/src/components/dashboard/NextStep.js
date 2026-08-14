import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';

export default function NextStep({ stats }) {
  const navigate = useNavigate();

  const interviewScore = stats?.interviewScore || 0;
  const resumeScore = stats?.resumeScore || 0;
  const targetRole = stats?.targetRole || 'Full Stack Developer';

  let recommendation = {
    title: 'Complete your first interview session',
    desc: `Run a ${targetRole} technical round to establish your baseline readiness score.`,
    actionText: 'Start interview',
    to: '/interview'
  };

  if (stats?.totalInterviews === 0 && stats?.totalResumes === 0) {
    recommendation = {
      title: 'Establish your career baseline',
      desc: 'Complete your first interview session or scan your resume to start tracking readiness metrics.',
      actionText: 'Start first session',
      to: '/interview'
    };
  } else if (stats?.totalResumes === 0) {
    recommendation = {
      title: 'Run your first ATS resume scan',
      desc: 'Upload your developer resume to extract technical keywords and check formatting health.',
      actionText: 'Scan resume',
      to: '/resume-analyzer'
    };
  } else if (interviewScore > 0 && interviewScore < 80) {
    recommendation = {
      title: `Strengthen ${targetRole} technical depth`,
      desc: `Your interview average is ${interviewScore}%. Practice an advanced round to focus on trade-offs and edge cases.`,
      actionText: 'Practice interview',
      to: '/interview'
    };
  } else if (resumeScore > 0 && resumeScore < 80) {
    recommendation = {
      title: 'Optimize ATS keyword density',
      desc: `Your resume scored ${resumeScore}%. Match your resume against target job postings to identify critical missing skills.`,
      actionText: 'Match job description',
      to: '/resume-analyzer'
    };
  } else if (interviewScore >= 80 && resumeScore >= 80) {
    recommendation = {
      title: 'Target job application alignment',
      desc: 'High baseline across interview and resume metrics. Run a tailored job description match for specific roles.',
      actionText: 'Match job posting',
      to: '/resume-analyzer'
    };
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.topRow}>
          <span style={styles.tag}>RECOMMENDED NEXT STEP</span>
        </div>
        <div style={styles.title}>{recommendation.title}</div>
        <p style={styles.desc}>{recommendation.desc}</p>
      </div>

      <button
        onClick={() => navigate(recommendation.to)}
        style={styles.actionBtn}
      >
        <span>{recommendation.actionText}</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#0c111d',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    padding: '1.25rem 1.5rem',
    marginBottom: '2rem',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  content: {
    flex: 1,
    minWidth: '240px',
  },
  topRow: {
    marginBottom: '0.35rem',
  },
  tag: {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: '#6366f1',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
  },
  title: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#f8fafc',
    margin: '0 0 0.25rem 0',
  },
  desc: {
    fontSize: '0.82rem',
    color: '#94a3b8',
    margin: 0,
    lineHeight: 1.5,
  },
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.65rem 1.1rem',
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#f8fafc',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  },
};
