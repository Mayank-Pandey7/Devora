import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, API } from '../context/AuthContext';
import DevoraLoader from '../components/common/DevoraLoader';
import {
  ArrowUpRight,
  ArrowRight,
  Mic,
  FileText,
  User,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  Layers,
  Settings,
  Bell,
  Clock,
  Briefcase,
  AlertTriangle,
  Github,
  Linkedin,
  Globe,
  LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';

const getInitialDashboardCache = () => {
  try {
    const cached = sessionStorage.getItem('devora_dashboard_cache');
    if (cached) return JSON.parse(cached);
  } catch (e) {}
  return null;
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const cachedData = getInitialDashboardCache();
  const [stats, setStats] = useState(cachedData?.stats || null);
  const [activityFeed, setActivityFeed] = useState(cachedData?.activityFeed || []);
  const [interviewsList, setInterviewsList] = useState(cachedData?.interviewsList || []);
  const [resumesList, setResumesList] = useState(cachedData?.resumesList || []);
  const [loading, setLoading] = useState(!cachedData?.stats);
  const [openAccordion, setOpenAccordion] = useState('stack');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, interviewsRes, resumesRes] = await Promise.all([
        API.get('/dashboard/stats').catch(() => ({ data: { success: false } })),
        API.get('/interviews').catch(() => ({ data: { success: false } })),
        API.get('/resumes').catch(() => ({ data: { success: false } }))
      ]);

      const newStats = statsRes.data?.success ? statsRes.data.stats : null;
      const newActivity = statsRes.data?.activityFeed || [];
      const newInterviews = interviewsRes.data?.interviews || [];
      const newResumes = resumesRes.data?.analyses || [];

      if (newStats) {
        setStats(newStats);
        setActivityFeed(newActivity);
      }
      if (interviewsRes.data?.success) {
        setInterviewsList(newInterviews);
      }
      if (resumesRes.data?.success) {
        setResumesList(newResumes);
      }

      if (newStats || newInterviews.length > 0 || newResumes.length > 0) {
        sessionStorage.setItem('devora_dashboard_cache', JSON.stringify({
          stats: newStats || stats,
          activityFeed: newActivity,
          interviewsList: newInterviews,
          resumesList: newResumes
        }));
      }
    } catch (err) {
      console.warn('Failed to load dashboard statistics:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const careerScore = stats?.careerScore || (stats?.totalInterviews > 0 || stats?.totalResumes > 0 ? 75 : 0);
  const interviewScore = stats?.interviewScore || 0;
  const resumeScore = stats?.resumeScore || 0;
  const targetRole = stats?.targetRole || user?.targetRole || 'Full Stack Developer';
  const experienceLevel = stats?.experienceLevel || user?.experienceLevel || 'Mid-Level';
  const userSkills = stats?.skills?.length > 0 ? stats.skills : (user?.skills?.length > 0 ? user.skills : ['JavaScript', 'React', 'Node.js']);
  const firstName = user?.name ? user.name.split(' ')[0] : 'Developer';

  const totalInterviews = stats?.totalInterviews || interviewsList.length;
  const completedInterviews = stats?.completedInterviews || interviewsList.filter(i => i.status === 'completed').length;
  const totalResumes = stats?.totalResumes || resumesList.length;
  const latestResume = resumesList[0] || null;
  const latestInterview = interviewsList[0] || null;

  // Compute dynamic task checklist based on real account state
  const careerChecklist = [
    {
      id: 1,
      title: 'Configure Developer Profile & Tech Stack',
      detail: `${userSkills.length} skills added • ${experienceLevel}`,
      done: true,
      type: 'profile',
      link: '/profile'
    },
    {
      id: 2,
      title: 'Complete First Technical Mock Round',
      detail: completedInterviews > 0 ? `${completedInterviews} completed • Avg ${interviewScore}%` : 'Pending session',
      done: completedInterviews > 0,
      type: 'interview',
      link: '/interview'
    },
    {
      id: 3,
      title: 'Audit PDF Resume for ATS Compatibility',
      detail: totalResumes > 0 ? `${latestResume?.fileName || 'Resume.pdf'} • ${resumeScore}/100` : 'Pending upload',
      done: totalResumes > 0,
      type: 'resume',
      link: '/resume-analyzer'
    },
    {
      id: 4,
      title: 'Target Job Description Keyword Match',
      detail: latestResume?.jobMatchScore ? `Matched • ${latestResume.jobMatchScore}% fit` : 'Compare against a job posting',
      done: Boolean(latestResume?.jobMatchScore),
      type: 'resume',
      link: '/resume-analyzer'
    },
    {
      id: 5,
      title: 'Achieve 80%+ Technical Readiness Score',
      detail: careerScore >= 80 ? `Target Reached (${careerScore}%)` : `Current Score: ${careerScore}%`,
      done: careerScore >= 80,
      type: 'interview',
      link: '/interview'
    }
  ];

  const completedTasks = careerChecklist.filter(c => c.done).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) return 'Today';
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading && !stats) {
    return <DevoraLoader message="Syncing your Devora dashboard..." />;
  }

  return (
    <div style={styles.dashboardContainer}>
      {/* ─── 1. HERO GREETING & REAL METRIC PILL ROW ─── */}
      <section style={styles.heroSection}>
        <h1 style={styles.greetingTitle}>Welcome in, {firstName}</h1>

        <div style={styles.heroMetricsBar}>
            {/* Segmented Metric Group */}
            <div style={styles.segmentedMetricGroup}>
              <div style={styles.segmentColumn}>
                <span style={styles.segmentLabel}>Interviews</span>
                <div style={styles.segmentPillDark}>
                  <span>{completedInterviews} Done</span>
                </div>
              </div>

              <div style={styles.segmentColumn}>
                <span style={styles.segmentLabel}>Readiness</span>
                <div style={styles.segmentPillYellow}>
                  <span>{careerScore > 0 ? `${careerScore}%` : 'Not Set'}</span>
                </div>
              </div>

              <div style={styles.segmentColumnWide}>
                <span style={styles.segmentLabel}>Verified Skills</span>
                <div style={styles.diagonalPatternBar}>
                  <span style={styles.patternBarText}>
                    {userSkills.slice(0, 3).join(' • ')}
                  </span>
                </div>
              </div>

              <div style={styles.segmentColumn}>
                <span style={styles.segmentLabel}>Resume ATS</span>
                <div style={styles.segmentPillOutlined}>
                  <span>{resumeScore > 0 ? `${resumeScore}%` : 'Unscanned'}</span>
                </div>
              </div>
            </div>

            {/* Real Counter Group */}
            <div style={styles.counterStatsGroup}>
              <div style={styles.counterItem}>
                <div style={styles.counterIconCircle}>
                  <Award size={13} color="#1f2123" />
                </div>
                <div style={styles.counterNumber}>{careerScore > 0 ? careerScore : '—'}</div>
                <div style={styles.counterLabel}>Career Score</div>
              </div>

              <div style={styles.counterItem}>
                <div style={styles.counterIconCircle}>
                  <Mic size={13} color="#1f2123" />
                </div>
                <div style={styles.counterNumber}>{totalInterviews}</div>
                <div style={styles.counterLabel}>Rounds</div>
              </div>

              <div style={styles.counterItem}>
                <div style={styles.counterIconCircle}>
                  <FileText size={13} color="#1f2123" />
                </div>
                <div style={styles.counterNumber}>{resumeScore > 0 ? `${resumeScore}%` : '—'}</div>
                <div style={styles.counterLabel}>ATS Score</div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3. TOP 4 CARDS ROW ─── */}
        <section style={styles.cardsRowTop}>
          {/* Card 1: Edge-to-Edge Developer Portrait Card (Matching Reference Image) */}
          <div style={styles.profileCard} onClick={() => navigate('/profile')} title="Go to Profile">
            {/* 1. Full-Bleed Background Portrait */}
            {user?.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('data:')) ? (
              <img
                src={user.avatar}
                alt={user?.name || 'Developer'}
                style={styles.cardBleedImg}
              />
            ) : user?.avatar ? (
              <div style={styles.cardBleedEmojiWrapper}>
                <span style={{ fontSize: '6.5rem' }}>{user.avatar}</span>
              </div>
            ) : (
              <div style={styles.cardBleedInitialWrapper}>
                <span>{firstName.charAt(0).toUpperCase()}</span>
              </div>
            )}

            {/* 2. Frosted Ambient Gradient Overlay at Bottom */}
            <div style={styles.cardBottomFrostedGradient} />

            {/* 3. Bottom Float Row: Name & Role on Left + Frosted Pill on Right */}
            <div style={styles.cardBottomFloatRow}>
              <div style={styles.cardBottomTextCol}>
                <h3 style={styles.cardBottomName}>{user?.name || 'Mayank Pandey'}</h3>
                <span style={styles.cardBottomRole}>{targetRole || 'Full Stack Developer'}</span>
              </div>

              <div style={styles.cardFrostedScorePill}>
                <span>{careerScore > 0 ? `${careerScore}/100` : '70/100'}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Interview Performance & History Card */}
          <div style={styles.whiteCard}>
            <div style={styles.cardHeaderRow}>
              <div>
                <h3 style={styles.cardTitle}>Interview Prep</h3>
                <div style={styles.cardBigMetricRow}>
                  <span style={styles.cardBigNumber}>
                    {interviewScore > 0 ? `${interviewScore}%` : '0%'}
                  </span>
                  <span style={styles.cardMetricSub}>
                    Average Score<br />{completedInterviews} rounds completed
                  </span>
                </div>
              </div>
              <button style={styles.arrowCircleBtn} onClick={() => navigate('/interview')} title="Start Interview">
                <ArrowUpRight size={15} color="#1f2123" />
              </button>
            </div>

            {/* Real Interview Breakdown Bars */}
            <div style={styles.breakdownList}>
              <div style={styles.breakdownRow}>
                <span style={styles.breakdownLabel}>Total Sessions</span>
                <span style={styles.breakdownVal}>{totalInterviews}</span>
              </div>
              <div style={styles.breakdownRow}>
                <span style={styles.breakdownLabel}>Completed</span>
                <span style={styles.breakdownVal}>{completedInterviews}</span>
              </div>
              <div style={styles.breakdownRow}>
                <span style={styles.breakdownLabel}>Target Role</span>
                <span style={styles.breakdownVal}>{targetRole}</span>
              </div>
            </div>

            <button style={styles.cardBottomActionBtn} onClick={() => navigate('/interview')}>
              <span>Start Mock Round</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 3: Resume ATS Scanner Health Card */}
          <div style={styles.whiteCard}>
            <div style={styles.cardHeaderRow}>
              <div>
                <h3 style={styles.cardTitle}>Resume ATS</h3>
                <div style={styles.cardBigMetricRow}>
                  <span style={styles.cardBigNumber}>
                    {resumeScore > 0 ? `${resumeScore}%` : '—'}
                  </span>
                  <span style={styles.cardMetricSub}>
                    ATS Score<br />{totalResumes} file(s) audited
                  </span>
                </div>
              </div>
              <button style={styles.arrowCircleBtn} onClick={() => navigate('/resume-analyzer')} title="Audit Resume">
                <ArrowUpRight size={15} color="#1f2123" />
              </button>
            </div>

            {/* Real Resume Status */}
            <div style={styles.breakdownList}>
              <div style={styles.breakdownRow}>
                <span style={styles.breakdownLabel}>Latest File</span>
                <span style={{ ...styles.breakdownVal, maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {latestResume?.fileName || 'None uploaded'}
                </span>
              </div>
              <div style={styles.breakdownRow}>
                <span style={styles.breakdownLabel}>Job Match</span>
                <span style={styles.breakdownVal}>
                  {latestResume?.jobMatchScore ? `${latestResume.jobMatchScore}%` : 'Not run'}
                </span>
              </div>
              <div style={styles.breakdownRow}>
                <span style={styles.breakdownLabel}>Status</span>
                <span style={{ ...styles.breakdownVal, color: resumeScore >= 80 ? '#1f2123' : '#b45309', fontWeight: 700 }}>
                  {resumeScore >= 80 ? 'High Pass' : resumeScore > 0 ? 'Needs Review' : 'Pending Scan'}
                </span>
              </div>
            </div>

            <button style={styles.cardBottomActionBtn} onClick={() => navigate('/resume-analyzer')}>
              <span>Upload & Scan PDF</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 4: Career Readiness & Real Checklist Card */}
          <div style={styles.readinessChecklistCard}>
            <div style={styles.readinessHeader}>
              <h3 style={styles.readinessTitle}>Readiness</h3>
              <span style={styles.readinessPercent}>{careerScore}%</span>
            </div>

            {/* Real Tasks Bar */}
            <div style={styles.checklistPillBar}>
              <div style={{ ...styles.checklistPill, background: '#f5c842', width: `${Math.max(25, (completedTasks / careerChecklist.length) * 100)}%`, color: '#1f2123' }}>
                <span>{completedTasks} of {careerChecklist.length} Done</span>
              </div>
              <div style={{ ...styles.checklistPill, background: '#1f2123', width: `${100 - Math.max(25, (completedTasks / careerChecklist.length) * 100)}%`, color: '#fff' }}>
                <span>{careerChecklist.length - completedTasks} Pending</span>
              </div>
            </div>

            {/* Dark Charcoal Real Checklist Container */}
            <div style={styles.darkChecklistContainer}>
              <div style={styles.darkChecklistHeader}>
                <span style={styles.darkChecklistTitle}>Milestone Checklist</span>
                <span style={styles.darkChecklistFraction}>{completedTasks}/{careerChecklist.length}</span>
              </div>

              <div style={styles.checklistItemsList}>
                {careerChecklist.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => navigate(task.link)}
                    style={styles.checklistItem}
                  >
                    <div style={styles.checklistIconBox}>
                      {task.type === 'interview' ? <Mic size={13} color="#f5c842" /> : task.type === 'resume' ? <FileText size={13} color="#38bdf8" /> : <User size={13} color="#a5b4fc" />}
                    </div>
                    <div style={styles.checklistTextWrap}>
                      <div style={{ ...styles.checkItemTitle, opacity: task.done ? 0.7 : 1 }}>
                        {task.title}
                      </div>
                      <div style={styles.checkItemTime}>{task.detail}</div>
                    </div>
                    <div style={{ ...styles.checkStatusCircle, background: task.done ? '#f5c842' : 'rgba(255,255,255,0.08)', borderColor: task.done ? '#f5c842' : '#4b4e54' }}>
                      {task.done && <Check size={11} color="#1f2123" strokeWidth={3} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── 4. BOTTOM ROW (ACCORDION & REAL RECENT ACTIVITY) ─── */}
        <section style={styles.cardsRowBottom}>
          {/* Left Accordion Column */}
          <div style={styles.accordionCard}>
            {/* Item 1: Verified Stack */}
            <div style={styles.accordionItem} onClick={() => setOpenAccordion(openAccordion === 'stack' ? '' : 'stack')}>
              <div style={styles.accordionItemHeader}>
                <span style={styles.accordionTitle}>Technical Stack & Core Skills</span>
                {openAccordion === 'stack' ? <ChevronUp size={16} color="#8e9298" /> : <ChevronDown size={16} color="#8e9298" />}
              </div>
              {openAccordion === 'stack' && (
                <div style={styles.accordionBody}>
                  <div style={styles.stackTagList}>
                    {userSkills.map((skill, i) => (
                      <span key={i} style={styles.stackPillBadge}>{skill}</span>
                    ))}
                  </div>
                  <button onClick={() => navigate('/profile')} style={styles.editProfileSmallLink}>
                    Edit skills in profile →
                  </button>
                </div>
              )}
            </div>

            {/* Item 2: Target Position */}
            <div style={styles.accordionItem} onClick={() => setOpenAccordion(openAccordion === 'target' ? '' : 'target')}>
              <div style={styles.accordionItemHeader}>
                <span style={styles.accordionTitle}>Target Role & Seniority</span>
                {openAccordion === 'target' ? <ChevronUp size={16} color="#8e9298" /> : <ChevronDown size={16} color="#8e9298" />}
              </div>
              {openAccordion === 'target' && (
                <div style={styles.accordionBody}>
                  <div style={{ fontSize: '0.85rem', color: '#1f2123', fontWeight: 700 }}>
                    {targetRole}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#71757c', marginTop: '2px' }}>
                    Level: {experienceLevel}
                  </div>
                </div>
              )}
            </div>

            {/* Item 3: Latest Resume */}
            <div style={{ ...styles.accordionItem, borderBottom: 'none' }} onClick={() => setOpenAccordion(openAccordion === 'resume' ? '' : 'resume')}>
              <div style={styles.accordionItemHeader}>
                <span style={styles.accordionTitle}>Latest Audited Resume</span>
                {openAccordion === 'resume' ? <ChevronUp size={16} color="#8e9298" /> : <ChevronDown size={16} color="#8e9298" />}
              </div>
              {openAccordion === 'resume' && (
                <div style={styles.accordionBody}>
                  {latestResume ? (
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#1f2123', fontWeight: 700 }}>
                        {latestResume.fileName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#71757c', marginTop: '2px' }}>
                        ATS Score: {latestResume.atsScore}/100 • {formatDate(latestResume.createdAt)}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: '#8e9298' }}>
                      No resume uploaded yet.{' '}
                      <Link to="/resume-analyzer" style={{ color: '#1f2123', fontWeight: 700 }}>
                        Upload PDF →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: REAL Activity Timeline Table */}
          <div style={styles.calendarCard}>
            <div style={styles.calendarTopHeader}>
              <h3 style={styles.calendarMonthTitle}>Recent Activity</h3>
              <span style={styles.activityFeedCount}>{activityFeed.length} recorded events</span>
            </div>

            {activityFeed.length === 0 ? (
              <div style={styles.emptyActivityBox}>
                <div style={styles.emptyActivityTitle}>NO PRACTICE SESSIONS OR AUDITS YET</div>
                <p style={styles.emptyActivityDesc}>
                  Your interview practice rounds and resume ATS scans will appear here automatically.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button onClick={() => navigate('/interview')} style={styles.emptyActionBtnPrimary}>
                    Start Interview Prep
                  </button>
                  <button onClick={() => navigate('/resume-analyzer')} style={styles.emptyActionBtnSecondary}>
                    Scan Resume
                  </button>
                </div>
              </div>
            ) : (
              <div style={styles.realActivityList}>
                {activityFeed.slice(0, 6).map((item, idx) => (
                  <div key={item.id || idx} style={styles.realActivityRow}>
                    <div style={styles.realDateCol}>
                      {formatDate(item.date)}
                    </div>
                    <div style={styles.realTypeCol}>
                      <span
                        style={{
                          ...styles.realTypeTag,
                          background: item.type === 'interview' ? 'rgba(31, 33, 35, 0.08)' : 'rgba(245, 200, 66, 0.25)',
                          color: '#1f2123'
                        }}
                      >
                        {item.type === 'interview' ? 'INTERVIEW' : 'RESUME'}
                      </span>
                    </div>
                    <div style={styles.realTitleCol}>
                      <div style={styles.realItemTitle}>{item.title}</div>
                      <div style={styles.realItemDetail}>{item.detail}</div>
                    </div>
                    <div style={styles.realScoreCol}>
                      {item.score !== null && item.score !== undefined ? (
                        <span
                          style={{
                            ...styles.realScorePill,
                            background: item.score >= 80 ? '#1f2123' : '#f5c842',
                            color: item.score >= 80 ? '#ffffff' : '#1f2123'
                          }}
                        >
                          {item.score}%
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: '#8e9298' }}>In progress</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
  );
}

const styles = {
  dashboardContainer: {
    width: '100%',
    fontFamily: "'Playpen Sans', cursive, sans-serif",
  },
  topNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2.5rem',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  brandPill: {
    padding: '0.5rem 1.4rem',
    background: 'rgba(255, 255, 255, 0.7)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    borderRadius: '30px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
  },
  brandText: {
    fontSize: '1.15rem',
    fontWeight: 800,
    color: '#1f2123',
    letterSpacing: '-0.02em',
    fontFamily: "'Space Grotesk', 'Playpen Sans', sans-serif",
  },
  centerNav: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.75)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    borderRadius: '40px',
    padding: '4px 6px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
    backdropFilter: 'blur(10px)',
  },
  navItemActive: {
    background: '#1f2123',
    color: '#ffffff',
    border: 'none',
    borderRadius: '30px',
    padding: '0.5rem 1.25rem',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  navItem: {
    background: 'transparent',
    color: '#4b4e54',
    border: 'none',
    padding: '0.5rem 1.1rem',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  topRightActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  userProfilePill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '4px 14px 4px 4px',
    background: 'rgba(255, 255, 255, 0.85)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    borderRadius: '30px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
    transition: 'all 0.15s ease',
  },
  avatarCircleSmall: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#1f2123',
    color: '#f5c842',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontWeight: 800,
  },
  profilePillText: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#1f2123',
  },
  pillLogoutBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.85)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
  },
  avatarInitial: {
    fontSize: '0.85rem',
    fontWeight: 800,
  },
  heroSection: {
    marginBottom: '2.5rem',
  },
  greetingTitle: {
    fontSize: '2.6rem',
    fontWeight: 800,
    color: '#1f2123',
    letterSpacing: '-0.03em',
    marginBottom: '1.25rem',
  },
  heroMetricsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  segmentedMetricGroup: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '0.75rem',
    flex: 1,
    minWidth: '320px',
  },
  segmentColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  segmentColumnWide: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    flex: 1,
  },
  segmentLabel: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: '#5b5e64',
  },
  segmentPillDark: {
    background: '#1f2123',
    color: '#ffffff',
    padding: '0.55rem 1.4rem',
    borderRadius: '25px',
    fontWeight: 700,
    fontSize: '0.85rem',
    textAlign: 'center',
  },
  segmentPillYellow: {
    background: '#f5c842',
    color: '#1f2123',
    padding: '0.55rem 1.4rem',
    borderRadius: '25px',
    fontWeight: 700,
    fontSize: '0.85rem',
    textAlign: 'center',
  },
  diagonalPatternBar: {
    height: '36px',
    borderRadius: '25px',
    background: 'repeating-linear-gradient(45deg, #e4e6ea, #e4e6ea 6px, #f2f3f6 6px, #f2f3f6 12px)',
    border: '1px solid rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 1rem',
    overflow: 'hidden',
  },
  patternBarText: {
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#1f2123',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  segmentPillOutlined: {
    padding: '0.55rem 1.2rem',
    borderRadius: '25px',
    border: '1px solid #c9cdd4',
    background: 'rgba(255, 255, 255, 0.4)',
    color: '#1f2123',
    fontWeight: 700,
    fontSize: '0.85rem',
    textAlign: 'center',
  },
  counterStatsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  counterItem: {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
    columnGap: '0.4rem',
  },
  counterIconCircle: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gridRow: 'span 2',
  },
  counterNumber: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#1f2123',
    lineHeight: 1,
    letterSpacing: '-0.03em',
  },
  counterLabel: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: '#71757c',
    gridColumn: 2,
  },
  cardsRowTop: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1.3fr',
    gap: '1.25rem',
    marginBottom: '1.5rem',
  },
  profileCard: {
    position: 'relative',
    background: '#232528',
    borderRadius: '26px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    height: '280px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  cardBleedImg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1,
  },
  cardBleedEmojiWrapper: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    background: '#1f2123',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  cardBleedInitialWrapper: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #1f2123 0%, #2c2f33 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '5rem',
    fontWeight: 900,
    color: '#f5c842',
    zIndex: 1,
  },
  cardBottomFrostedGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '38%',
    background: 'linear-gradient(to top, rgba(12, 10, 8, 0.75) 0%, rgba(12, 10, 8, 0.4) 45%, rgba(12, 10, 8, 0.08) 80%, transparent 100%)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)',
    WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)',
    zIndex: 2,
    pointerEvents: 'none',
  },
  cardBottomFloatRow: {
    position: 'relative',
    zIndex: 3,
    padding: '0.95rem 1.15rem',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '0.65rem',
    width: '100%',
    boxSizing: 'border-box',
  },
  cardBottomTextCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
    minWidth: 0,
  },
  cardBottomName: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.02em',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cardBottomRole: {
    fontSize: '0.82rem',
    color: 'rgba(255, 255, 255, 0.88)',
    fontWeight: 600,
    textShadow: '0 1px 4px rgba(0, 0, 0, 0.6)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cardFrostedScorePill: {
    border: '1.5px solid rgba(255, 255, 255, 0.55)',
    background: 'rgba(255, 255, 255, 0.18)',
    backdropFilter: 'blur(10px)',
    padding: '0.45rem 1.1rem',
    borderRadius: '26px',
    fontSize: '0.92rem',
    fontWeight: 700,
    color: '#ffffff',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
  },
  socialLinksRow: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.4rem',
  },
  socialIconLink: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    textDecoration: 'none',
  },
  whiteCard: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '280px',
  },
  cardHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: '1.05rem',
    fontWeight: 800,
    color: '#1f2123',
    margin: 0,
  },
  cardBigMetricRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem',
    marginTop: '0.25rem',
  },
  cardBigNumber: {
    fontSize: '2.4rem',
    fontWeight: 900,
    color: '#1f2123',
    letterSpacing: '-0.03em',
  },
  cardMetricSub: {
    fontSize: '0.72rem',
    color: '#71757c',
    lineHeight: 1.2,
  },
  arrowCircleBtn: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.04)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  breakdownList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
    margin: '0.5rem 0',
  },
  breakdownRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.78rem',
  },
  breakdownLabel: {
    color: '#71757c',
    fontWeight: 500,
  },
  breakdownVal: {
    color: '#1f2123',
    fontWeight: 700,
  },
  cardBottomActionBtn: {
    width: '100%',
    padding: '0.6rem 0.9rem',
    background: '#1f2123',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.35rem',
    cursor: 'pointer',
  },
  readinessChecklistCard: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '1.25rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    height: '280px',
  },
  readinessHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '0.5rem',
  },
  readinessTitle: {
    fontSize: '1rem',
    fontWeight: 800,
    color: '#1f2123',
    margin: 0,
  },
  readinessPercent: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#1f2123',
  },
  checklistPillBar: {
    display: 'flex',
    gap: '4px',
    marginBottom: '0.75rem',
  },
  checklistPill: {
    borderRadius: '16px',
    padding: '3px 10px',
    fontSize: '0.7rem',
    fontWeight: 700,
    textAlign: 'center',
  },
  darkChecklistContainer: {
    background: '#1f2123',
    borderRadius: '18px',
    padding: '1rem',
    color: '#ffffff',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  darkChecklistHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.65rem',
  },
  darkChecklistTitle: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#ffffff',
  },
  darkChecklistFraction: {
    fontSize: '0.9rem',
    fontWeight: 800,
    color: '#f5c842',
  },
  checklistItemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  checklistItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    cursor: 'pointer',
  },
  checklistIconBox: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    background: 'rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checklistTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  checkItemTitle: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#f1f3f5',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  checkItemTime: {
    fontSize: '0.65rem',
    color: '#8e9298',
  },
  checkStatusCircle: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '1.5px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardsRowBottom: {
    display: 'grid',
    gridTemplateColumns: '1fr 2.3fr',
    gap: '1.25rem',
  },
  accordionCard: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '1.25rem 1.5rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  accordionItem: {
    borderBottom: '1px solid #f0f2f5',
    padding: '0.85rem 0',
    cursor: 'pointer',
  },
  accordionItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionTitle: {
    fontSize: '0.88rem',
    fontWeight: 700,
    color: '#1f2123',
  },
  accordionBody: {
    marginTop: '0.5rem',
  },
  stackTagList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
  },
  stackPillBadge: {
    fontSize: '0.72rem',
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: '12px',
    background: '#f6f5f1',
    color: '#1f2123',
    border: '1px solid rgba(0,0,0,0.06)',
  },
  editProfileSmallLink: {
    display: 'inline-block',
    marginTop: '0.5rem',
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#1f2123',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
  },
  calendarCard: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    border: '1px solid rgba(0, 0, 0, 0.04)',
  },
  calendarTopHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
  },
  calendarMonthTitle: {
    fontSize: '1rem',
    fontWeight: 800,
    color: '#1f2123',
    margin: 0,
  },
  activityFeedCount: {
    fontSize: '0.75rem',
    color: '#8e9298',
    fontWeight: 600,
  },
  emptyActivityBox: {
    padding: '3rem 1.5rem',
    textAlign: 'center',
  },
  emptyActivityTitle: {
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#1f2123',
    letterSpacing: '0.06em',
    marginBottom: '0.4rem',
  },
  emptyActivityDesc: {
    fontSize: '0.82rem',
    color: '#71757c',
    margin: '0 0 1.25rem 0',
  },
  emptyActionBtnPrimary: {
    padding: '0.55rem 1.1rem',
    background: '#1f2123',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  emptyActionBtnSecondary: {
    padding: '0.55rem 1.1rem',
    background: '#f5c842',
    color: '#1f2123',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  realActivityList: {
    display: 'flex',
    flexDirection: 'column',
  },
  realActivityRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.85rem 0',
    borderBottom: '1px solid #f0f2f5',
    gap: '1rem',
  },
  realDateCol: {
    width: '75px',
    fontSize: '0.75rem',
    color: '#71757c',
    fontWeight: 600,
    flexShrink: 0,
  },
  realTypeCol: {
    width: '85px',
    flexShrink: 0,
  },
  realTypeTag: {
    fontSize: '0.65rem',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '12px',
    display: 'inline-block',
    textAlign: 'center',
    width: '100%',
  },
  realTitleCol: {
    flex: 1,
    minWidth: 0,
  },
  realItemTitle: {
    fontSize: '0.88rem',
    fontWeight: 700,
    color: '#1f2123',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  realItemDetail: {
    fontSize: '0.72rem',
    color: '#71757c',
    marginTop: '1px',
  },
  realScoreCol: {
    flexShrink: 0,
  },
  realScorePill: {
    fontSize: '0.78rem',
    fontWeight: 800,
    padding: '3px 10px',
    borderRadius: '12px',
  },
};
