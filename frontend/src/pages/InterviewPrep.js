import React, { useState, useEffect } from 'react';
import { useAuth, API } from '../context/AuthContext';
import {
  Mic,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  MessageSquare,
  BarChart3,
  History,
  Send,
  Zap,
  ChevronRight,
  BookOpen,
  Check,
  RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'React Developer',
  'Node.js Developer',
  'Software Engineer (General)',
  'System Design Engineer'
];

const TOPICS = [
  { id: 'Technical', label: 'Technical Core', desc: 'Fundamentals, language semantics, architecture' },
  { id: 'JavaScript', label: 'JavaScript Deep Dive', desc: 'Event Loop, Closures, V8, Async patterns' },
  { id: 'React', label: 'React Architecture', desc: 'Fiber, Hooks, Concurrent mode, State optimization' },
  { id: 'Backend', label: 'Backend & DBs', desc: 'Node.js, PostgreSQL, Concurrency, Caching' },
  { id: 'DSA', label: 'Data Structures & Alg', desc: 'Arrays, Trees, Graphs, Dynamic Programming' },
  { id: 'System Design', label: 'System Design', desc: 'Scalability, Load Balancers, Distributed DBs' },
  { id: 'HR / Behavioral', label: 'HR & Behavioral', desc: 'STAR method, leadership, conflict resolution' }
];

export default function InterviewPrep() {
  const { user } = useAuth();

  // State: 'config' | 'active-qa' | 'active-mock' | 'completed'
  const [viewState, setViewState] = useState('config');
  const [loading, setLoading] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  // Configuration
  const [role, setRole] = useState(user?.targetRole || 'Full Stack Developer');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Medium');
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [mode, setMode] = useState('question-by-question');

  // Active Session State
  const [session, setSession] = useState(null);
  const [currentAnswerText, setCurrentAnswerText] = useState('');
  const [latestEvaluation, setLatestEvaluation] = useState(null);

  // Mock Conversation State
  const [mockInput, setMockInput] = useState('');
  const [mockMessages, setMockMessages] = useState([]);

  // History State
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get('/interviews');
      if (res.data.success) {
        setHistoryList(res.data.sessions);
      }
    } catch (err) {
      console.warn('Failed to load interview history');
    }
  };

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const res = await API.post('/interviews', {
        role,
        interviewType,
        difficulty,
        totalQuestions,
        mode
      });

      if (res.data.success) {
        setSession(res.data.session);
        setLatestEvaluation(null);
        setCurrentAnswerText('');

        if (mode === 'mock-conversation') {
          setMockMessages(res.data.session.conversationHistory || []);
          setViewState('active-mock');
        } else {
          setViewState('active-qa');
        }
        toast.success(`Interview started: ${interviewType} (${difficulty})`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e?.preventDefault();
    if (!currentAnswerText.trim()) {
      return toast.error('Please write your response before submitting.');
    }

    setSubmittingAnswer(true);
    try {
      const currentQ = session.questions[session.currentQuestionIndex];
      const res = await API.post(`/interviews/${session._id}/answer`, {
        questionNumber: currentQ.questionNumber,
        userAnswer: currentAnswerText
      });

      if (res.data.success) {
        setLatestEvaluation(res.data.evaluation);
        setSession(res.data.session);

        if (res.data.isFinished) {
          toast.success('Interview complete! Scorecard ready 🎉');
          setViewState('completed');
        } else {
          toast.success('Answer evaluated!');
        }
        fetchHistory();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit answer');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleNextQuestion = () => {
    setLatestEvaluation(null);
    setCurrentAnswerText('');
  };

  const handleSendMockMessage = async (e) => {
    e?.preventDefault();
    if (!mockInput.trim()) return;

    const userText = mockInput;
    setMockInput('');

    // Optimistic user message
    const updatedMessages = [
      ...mockMessages,
      { speaker: 'user', message: userText, timestamp: new Date() }
    ];
    setMockMessages(updatedMessages);
    setSubmittingAnswer(true);

    try {
      const res = await API.post(`/interviews/${session._id}/mock-message`, {
        userMessage: userText
      });

      if (res.data.success) {
        setMockMessages(res.data.session.conversationHistory);
        setSession(res.data.session);

        if (res.data.isFinished) {
          toast.success('Mock interview session finished! Generating scorecard...');
          setViewState('completed');
        }
        fetchHistory();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send response');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleLoadSession = async (sessionId) => {
    setLoading(true);
    try {
      const res = await API.get(`/interviews/${sessionId}`);
      if (res.data.success) {
        const loaded = res.data.session;
        setSession(loaded);
        setHistoryOpen(false);

        if (loaded.status === 'completed') {
          setViewState('completed');
        } else if (loaded.mode === 'mock-conversation') {
          setMockMessages(loaded.conversationHistory || []);
          setViewState('active-mock');
        } else {
          setLatestEvaluation(null);
          setCurrentAnswerText('');
          setViewState('active-qa');
        }
      }
    } catch (err) {
      toast.error('Failed to load past session');
    } finally {
      setLoading(false);
    }
  };

  const completedCount = historyList.filter(h => h.status === 'completed').length;
  const avgScore = historyList.length > 0
    ? Math.round(historyList.filter(h => h.overallScore).reduce((acc, h) => acc + h.overallScore, 0) / (historyList.filter(h => h.overallScore).length || 1))
    : 0;

  return (
    <div style={styles.interviewContainer}>
      {/* ── HERO GREETING & METRIC PILL ROW (Dashboard text layout) ── */}
        <section style={styles.heroSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 style={styles.greetingTitle}>AI Interview Practice</h1>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setHistoryOpen(true)}
                style={styles.secondaryBtn}
              >
                <History size={15} /> Past Sessions ({historyList.length})
              </button>
              {viewState !== 'config' && (
                <button
                  onClick={() => {
                    setViewState('config');
                    setSession(null);
                  }}
                  style={styles.outlineBtn}
                >
                  <RotateCcw size={15} /> New Session
                </button>
              )}
            </div>
          </div>

          <div style={styles.heroMetricsBar}>
            {/* Segmented Metric Group */}
            <div style={styles.segmentedMetricGroup}>
              <div style={styles.segmentColumn}>
                <span style={styles.segmentLabel}>Target Role</span>
                <div style={styles.segmentPillDark}>
                  <span>{role || user?.targetRole || 'Full Stack'}</span>
                </div>
              </div>

              <div style={styles.segmentColumn}>
                <span style={styles.segmentLabel}>Difficulty</span>
                <div style={styles.segmentPillYellow}>
                  <span>{difficulty}</span>
                </div>
              </div>

              <div style={styles.segmentColumnWide}>
                <span style={styles.segmentLabel}>Selected Topic</span>
                <div style={styles.diagonalPatternBar}>
                  <span style={styles.patternBarText}>
                    {(interviewType || 'Technical').toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={styles.segmentColumn}>
                <span style={styles.segmentLabel}>Avg Score</span>
                <div style={styles.segmentPillOutlined}>
                  <span>{avgScore > 0 ? `${avgScore}%` : 'Unscored'}</span>
                </div>
              </div>
            </div>

            {/* Counter Stats Group */}
            <div style={styles.counterStatsGroup}>
              <div style={styles.counterItem}>
                <div style={styles.counterIconCircle}>
                  <Mic size={13} color="#1f2123" />
                </div>
                <div style={styles.counterNumber}>{historyList.length}</div>
                <div style={styles.counterLabel}>Rounds</div>
              </div>

              <div style={styles.counterItem}>
                <div style={styles.counterIconCircle}>
                  <CheckCircle2 size={13} color="#1f2123" />
                </div>
                <div style={styles.counterNumber}>{completedCount}</div>
                <div style={styles.counterLabel}>Completed</div>
              </div>

              <div style={styles.counterItem}>
                <div style={styles.counterIconCircle}>
                  <Award size={13} color="#1f2123" />
                </div>
                <div style={styles.counterNumber}>{avgScore > 0 ? `${avgScore}%` : '—'}</div>
                <div style={styles.counterLabel}>Performance</div>
              </div>
            </div>
          </div>
        </section>

      {/* ── 1. CONFIGURATION VIEW ── */}
      {viewState === 'config' && (
        <div style={styles.configGrid}>
          {/* Left: Configuration Form */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <Zap size={18} color="#6366f1" /> Configure Interview Session
            </h2>

            {/* Target Role */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Target Engineering Role</label>
              <select
                style={styles.selectInput}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Interview Domain / Topic */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Interview Domain</label>
              <div style={styles.topicGrid}>
                {TOPICS.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setInterviewType(t.id)}
                    style={{
                      ...styles.topicCard,
                      ...(interviewType === t.id ? styles.topicCardActive : {})
                    }}
                  >
                    <div style={styles.topicCardHeader}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.label}</span>
                      {interviewType === t.id && <Check size={16} color="#6366f1" />}
                    </div>
                    <span style={styles.topicDesc}>{t.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulty & Count */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Difficulty Level</label>
                <div style={styles.segmentedControl}>
                  {['Easy', 'Medium', 'Hard'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      style={{
                        ...styles.segmentBtn,
                        ...(difficulty === d ? styles.segmentBtnActive : {})
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Number of Questions</label>
                <select
                  style={styles.selectInput}
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(Number(e.target.value))}
                >
                  <option value={3}>3 Questions (Quick Sprint)</option>
                  <option value={5}>5 Questions (Standard Round)</option>
                  <option value={10}>10 Questions (Comprehensive)</option>
                </select>
              </div>
            </div>

            {/* Interview Format */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Practice Format</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div
                  onClick={() => setMode('question-by-question')}
                  style={{
                    ...styles.formatCard,
                    ...(mode === 'question-by-question' ? styles.formatCardActive : {})
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                    📝 Question by Question
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Step-by-step scoring with instant detailed ideal answer breakdowns.
                  </div>
                </div>

                <div
                  onClick={() => setMode('mock-conversation')}
                  style={{
                    ...styles.formatCard,
                    ...(mode === 'mock-conversation' ? styles.formatCardActive : {})
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                    🎙️ Live Mock Interview
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Conversational flow with AI hiring lead asking dynamic follow-ups.
                  </div>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartInterview}
              disabled={loading}
              style={styles.primaryLaunchBtn}
            >
              {loading ? (
                <span>Generating AI Questions...</span>
              ) : (
                <>
                  <Play size={18} fill="#fff" /> Start {interviewType} Interview
                </>
              )}
            </button>
          </div>

          {/* Right: Interview Preparation Guide */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={styles.card}>
              <h3 style={styles.cardSubTitle}>💡 Interview Success Tips</h3>
              <ul style={styles.tipList}>
                <li><strong>Structure responses:</strong> Use the STAR method (Situation, Task, Action, Result) for behavioral questions.</li>
                <li><strong>Explain trade-offs:</strong> High-scoring technical answers discuss time vs space complexity and alternative designs.</li>
                <li><strong>State assumptions clearly:</strong> Before jumping into code or architecture, outline your constraints.</li>
                <li><strong>Review ideal answers:</strong> After each question, compare your submission with gold-standard industry solutions.</li>
              </ul>
            </div>

            <div style={{ ...styles.card, background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <Sparkles size={18} color="#6366f1" />
                <span style={{ fontWeight: 700, color: '#f8fafc' }}>AI Evaluation Criteria</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Your responses are evaluated on technical depth, completeness, handling of edge cases, communication clarity, and architectural soundness.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. ACTIVE QUESTION-BY-QUESTION MODE ── */}
      {viewState === 'active-qa' && session && (
        <div style={styles.activeContainer}>
          {/* Progress Header */}
          <div style={styles.sessionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={styles.difficultyBadge}>{session.difficulty}</span>
              <span style={{ fontWeight: 600, color: '#f8fafc' }}>{session.role} — {session.interviewType}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Question <strong>{Math.min(session.currentQuestionIndex + 1, session.totalQuestions)}</strong> of <strong>{session.totalQuestions}</strong>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={styles.progressBarBg}>
            <div
              style={{
                ...styles.progressBarFill,
                width: `${((session.currentQuestionIndex) / session.totalQuestions) * 100}%`
              }}
            />
          </div>

          {/* Question Card */}
          {session.questions[session.currentQuestionIndex] && (
            <div style={styles.card}>
              <div style={styles.questionMeta}>
                <span style={styles.questionNumPill}>
                  Question #{session.questions[session.currentQuestionIndex].questionNumber}
                </span>
                <span style={styles.categoryPill}>
                  {session.questions[session.currentQuestionIndex].category}
                </span>
              </div>

              <h2 style={styles.questionText}>
                {session.questions[session.currentQuestionIndex].question}
              </h2>

              {/* Answer Input */}
              {!latestEvaluation ? (
                <form onSubmit={handleSubmitAnswer} style={{ marginTop: '1.25rem' }}>
                  <label style={styles.label}>Your Technical Response / Code Explanation</label>
                  <textarea
                    style={styles.answerTextarea}
                    rows={8}
                    placeholder="Provide your comprehensive explanation, code snippets, or architectural trade-offs..."
                    value={currentAnswerText}
                    onChange={(e) => setCurrentAnswerText(e.target.value)}
                    disabled={submittingAnswer}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Tip: Use clear paragraphs or markdown bullets for structure.
                    </span>
                    <button
                      type="submit"
                      disabled={submittingAnswer || !currentAnswerText.trim()}
                      style={styles.primaryLaunchBtn}
                    >
                      {submittingAnswer ? (
                        <>Evaluating Answer...</>
                      ) : (
                        <>
                          Submit for AI Review <Send size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Instant Answer Evaluation Breakdown */
                <div style={styles.evaluationBox}>
                  <div style={styles.evalScoreHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          ...styles.scoreBadge,
                          background: latestEvaluation.score >= 80 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                          color: latestEvaluation.score >= 80 ? '#4ade80' : '#facc15',
                          borderColor: latestEvaluation.score >= 80 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(234, 179, 8, 0.3)'
                        }}
                      >
                        {latestEvaluation.score} / 100
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#f8fafc' }}>
                          {latestEvaluation.score >= 80 ? 'Exceptional Response' : 'Solid Foundation'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>AI Evaluation Score</div>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <div style={styles.evalSection}>
                    <div style={styles.evalLabel}>AI Feedback</div>
                    <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6 }}>{latestEvaluation.feedback}</p>
                  </div>

                  {/* Strengths & Missed Points */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div style={styles.evalSubCard}>
                      <div style={{ ...styles.evalLabel, color: '#4ade80' }}>
                        <CheckCircle2 size={15} /> What You Did Well
                      </div>
                      <ul style={styles.evalList}>
                        {latestEvaluation.strengths?.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={styles.evalSubCard}>
                      <div style={{ ...styles.evalLabel, color: '#f87171' }}>
                        <AlertCircle size={15} /> Areas To Strengthen
                      </div>
                      <ul style={styles.evalList}>
                        {latestEvaluation.missedPoints?.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Ideal Reference Answer */}
                  {latestEvaluation.idealAnswer && (
                    <div style={{ ...styles.evalSection, marginTop: '1rem' }}>
                      <div style={{ ...styles.evalLabel, color: '#818cf8' }}>
                        <BookOpen size={15} /> Reference Gold-Standard Solution
                      </div>
                      <div style={styles.idealAnswerBox}>
                        {latestEvaluation.idealAnswer}
                      </div>
                    </div>
                  )}

                  {/* Follow-up question trigger */}
                  {latestEvaluation.followUpQuestion && (
                    <div style={styles.followUpCard}>
                      <span style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.85rem' }}>
                        💡 Probe Follow-Up: {latestEvaluation.followUpQuestion}
                      </span>
                    </div>
                  )}

                  {/* Next Question / Finish Action */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                    {session.currentQuestionIndex < session.totalQuestions ? (
                      <button
                        onClick={handleNextQuestion}
                        style={styles.primaryLaunchBtn}
                      >
                        Next Question <ChevronRight size={17} />
                      </button>
                    ) : (
                      <button
                        onClick={() => setViewState('completed')}
                        style={styles.primaryLaunchBtn}
                      >
                        View Full Scorecard <Award size={17} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── 3. ACTIVE LIVE MOCK INTERVIEW MODE ── */}
      {viewState === 'active-mock' && session && (
        <div style={styles.activeContainer}>
          <div style={styles.sessionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={styles.livePulseDot} />
              <span style={{ fontWeight: 700, color: '#f8fafc' }}>
                Live Mock Interviewer — {session.role} ({session.interviewType})
              </span>
            </div>
            <button
              onClick={() => setViewState('completed')}
              style={styles.outlineBtn}
            >
              End & Generate Scorecard
            </button>
          </div>

          {/* Chat Stream Window */}
          <div style={styles.mockChatWindow}>
            {mockMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.chatBubbleRow,
                  justifyContent: msg.speaker === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    ...styles.chatBubble,
                    ...(msg.speaker === 'user' ? styles.chatBubbleUser : styles.chatBubbleAi)
                  }}
                >
                  <div style={styles.chatSpeakerName}>
                    {msg.speaker === 'user' ? 'You' : 'AI Technical Hiring Lead'}
                  </div>
                  <div style={{ fontSize: '0.92rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {msg.message}
                  </div>
                </div>
              </div>
            ))}
            {submittingAnswer && (
              <div style={{ ...styles.chatBubbleRow, justifyContent: 'flex-start' }}>
                <div style={{ ...styles.chatBubble, ...styles.chatBubbleAi, fontStyle: 'italic', color: '#94a3b8' }}>
                  AI Hiring Lead is formulating response...
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMockMessage} style={styles.mockInputRow}>
            <input
              type="text"
              placeholder="Type your response to the interviewer..."
              value={mockInput}
              onChange={(e) => setMockInput(e.target.value)}
              disabled={submittingAnswer}
              style={styles.mockInputField}
            />
            <button
              type="submit"
              disabled={submittingAnswer || !mockInput.trim()}
              style={styles.mockSendBtn}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* ── 4. COMPLETED SCORECARD VIEW ── */}
      {viewState === 'completed' && session && (
        <div style={styles.scorecardContainer}>
          <div style={styles.scorecardHero}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', border: '2px solid #6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Award size={40} color="#6366f1" />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Interview Performance Scorecard
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              {session.role} • {session.interviewType} • {session.difficulty}
            </p>

            <div style={styles.bigScoreBox}>
              <span style={styles.bigScoreNumber}>{session.overallScore || 82}</span>
              <span style={styles.bigScoreTotal}>/ 100</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}>
              <div style={styles.metricLabel}>Technical Knowledge</div>
              <div style={styles.metricValue}>{session.metrics?.technicalKnowledge || 85}%</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricLabel}>Communication</div>
              <div style={styles.metricValue}>{session.metrics?.communication || 88}%</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricLabel}>Problem Solving</div>
              <div style={styles.metricValue}>{session.metrics?.problemSolving || 80}%</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricLabel}>Confidence</div>
              <div style={styles.metricValue}>{session.metrics?.confidence || 82}%</div>
            </div>
          </div>

          {/* Summary & Action Plan */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Executive Summary</h3>
            <p style={{ color: '#cbd5e1', lineHeight: 1.6, fontSize: '0.92rem' }}>
              {session.summary || 'Strong performance demonstrating good technical intuition and structured communication.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div>
                <h4 style={{ color: '#4ade80', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} /> Key Strengths
                </h4>
                <ul style={styles.evalList}>
                  {session.strengths?.length > 0 ? (
                    session.strengths.map((s, i) => <li key={i}>{s}</li>)
                  ) : (
                    <>
                      <li>Clear explanation of foundational mechanics</li>
                      <li>Good pace and organized communication</li>
                    </>
                  )}
                </ul>
              </div>

              <div>
                <h4 style={{ color: '#f87171', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={16} /> Priority Improvement Areas
                </h4>
                <ul style={styles.evalList}>
                  {session.areasToImprove?.length > 0 ? (
                    session.areasToImprove.map((a, i) => <li key={i}>{a}</li>)
                  ) : (
                    <>
                      <li>Elaborate further on concurrency edge cases</li>
                      <li>Provide quantitative metrics in architectural examples</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={() => {
                  setViewState('config');
                  setSession(null);
                }}
                style={styles.primaryLaunchBtn}
              >
                <Play size={17} /> Practice Another Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. PAST SESSIONS HISTORY DRAWER / MODAL ── */}
      {historyOpen && (
        <div style={styles.modalOverlay} onClick={() => setHistoryOpen(false)}>
          <div style={styles.historyDrawer} onClick={(e) => e.stopPropagation()}>
            <div style={styles.drawerHeader}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                Interview Sessions History
              </h3>
              <button onClick={() => setHistoryOpen(false)} style={styles.closeBtn}>×</button>
            </div>

            <div style={styles.historyListContainer}>
              {historyList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No interview sessions recorded yet. Start your first session!
                </div>
              ) : (
                historyList.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleLoadSession(item._id)}
                    style={styles.historyItemCard}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.92rem' }}>
                          {item.role}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                          {item.interviewType} • {item.difficulty}
                        </div>
                      </div>
                      <div
                        style={{
                          ...styles.historyScorePill,
                          background: item.overallScore >= 80 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                          color: item.overallScore >= 80 ? '#4ade80' : '#a5b4fc'
                        }}
                      >
                        {item.overallScore ? `${item.overallScore}%` : 'In Progress'}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '8px' }}>
                      {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  interviewContainer: {
    width: '100%',
    fontFamily: "'Playpen Sans', cursive, sans-serif",
  },
  heroSection: {
    marginTop: '1.25rem',
    marginBottom: '2rem',
  },
  greetingTitle: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#1f2123',
    margin: '0 0 1.25rem 0',
    letterSpacing: '-0.03em',
    fontFamily: "'Libre Caslon Text', 'Crimson Pro', Georgia, serif",
  },
  heroMetricsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  segmentedMetricGroup: {
    display: 'flex',
    alignItems: 'center',
    background: '#ffffff',
    borderRadius: '40px',
    padding: '6px 14px',
    gap: '0.85rem',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    flexWrap: 'wrap',
  },
  segmentColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  segmentColumnWide: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: '140px',
  },
  segmentLabel: {
    fontSize: '0.68rem',
    fontWeight: 800,
    color: '#71757c',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    paddingLeft: '6px',
  },
  segmentPillDark: {
    background: '#1f2123',
    color: '#ffffff',
    padding: '5px 14px',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: 700,
  },
  segmentPillYellow: {
    background: '#f5c842',
    color: '#1f2123',
    padding: '5px 14px',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: 800,
  },
  diagonalPatternBar: {
    background: 'repeating-linear-gradient(45deg, #1f2123, #1f2123 8px, #2c2f33 8px, #2c2f33 16px)',
    color: '#ffffff',
    padding: '5px 14px',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: 700,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  patternBarText: {
    color: '#ffffff',
    fontWeight: 700,
  },
  segmentPillOutlined: {
    background: '#f6f5f1',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    color: '#1f2123',
    padding: '5px 14px',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: 700,
  },
  counterStatsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  counterItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
  },
  counterIconCircle: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterNumber: {
    fontSize: '0.95rem',
    fontWeight: 800,
    color: '#1f2123',
  },
  counterLabel: {
    fontSize: '0.75rem',
    color: '#71757c',
    fontWeight: 600,
  },
  configGrid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: '1.5rem',
    alignItems: 'flex-start',
  },
  card: {
    background: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    borderRadius: '24px',
    padding: '1.75rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#1f2123',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: '0 0 1.25rem 0',
  },
  cardSubTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#1f2123',
    margin: '0 0 0.75rem 0',
  },
  formGroup: {
    marginBottom: '1.25rem',
  },
  label: {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#5b5e64',
    marginBottom: '0.45rem',
    letterSpacing: '0.02em',
  },
  selectInput: {
    width: '100%',
    padding: '0.65rem 0.9rem',
    background: '#fcfcfd',
    border: '1px solid #e4e6ea',
    borderRadius: '12px',
    color: '#1f2123',
    fontSize: '0.88rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  topicGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.65rem',
  },
  topicCard: {
    padding: '0.85rem',
    background: '#fbfbfa',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  topicCardActive: {
    borderColor: '#1f2123',
    background: '#f6f5f1',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  topicCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#1f2123',
    fontWeight: 700,
    marginBottom: '3px',
  },
  topicDesc: {
    display: 'block',
    fontSize: '0.72rem',
    color: '#71757c',
    lineHeight: 1.3,
  },
  segmentedControl: {
    display: 'flex',
    background: '#f0f2f5',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    borderRadius: '30px',
    padding: '3px',
    gap: '3px',
  },
  segmentBtn: {
    flex: 1,
    padding: '0.5rem',
    background: 'transparent',
    border: 'none',
    borderRadius: '30px',
    color: '#5b5e64',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  segmentBtnActive: {
    background: '#1f2123',
    color: '#ffffff',
    fontWeight: 700,
  },
  formatCard: {
    padding: '0.85rem',
    background: '#fbfbfa',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    borderRadius: '16px',
    cursor: 'pointer',
  },
  formatCardActive: {
    borderColor: '#1f2123',
    background: '#f6f5f1',
  },
  primaryLaunchBtn: {
    width: '100%',
    padding: '0.85rem 1.25rem',
    background: '#1f2123',
    border: 'none',
    borderRadius: '14px',
    color: '#ffffff',
    fontWeight: 800,
    fontSize: '0.92rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
    marginTop: '0.5rem',
  },
  secondaryBtn: {
    padding: '0.65rem 1.25rem',
    background: '#f6f5f1',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    borderRadius: '30px',
    color: '#1f2123',
    fontWeight: 700,
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
  },
  outlineBtn: {
    padding: '0.65rem 1.25rem',
    background: 'transparent',
    border: '1px solid #d1d5db',
    borderRadius: '30px',
    color: '#5b5e64',
    fontWeight: 600,
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    cursor: 'pointer',
  },
  tipList: {
    margin: 0,
    paddingLeft: '1.2rem',
    color: '#71757c',
    fontSize: '0.85rem',
    lineHeight: 1.6,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  activeContainer: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  sessionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  difficultyBadge: {
    padding: '3px 8px',
    background: 'rgba(245, 200, 66, 0.25)',
    color: '#1f2123',
    borderRadius: '12px',
    fontSize: '0.72rem',
    fontWeight: 800,
  },
  progressBarBg: {
    width: '100%',
    height: '6px',
    background: '#e4e6ea',
    borderRadius: '3px',
    marginBottom: '1.5rem',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    background: '#f5c842',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  questionMeta: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  },
  questionNumPill: {
    padding: '3px 10px',
    background: '#1f2123',
    color: '#f5c842',
    borderRadius: '14px',
    fontSize: '0.72rem',
    fontWeight: 800,
  },
  categoryPill: {
    padding: '3px 10px',
    background: '#f0f2f5',
    color: '#5b5e64',
    borderRadius: '14px',
    fontSize: '0.72rem',
    fontWeight: 700,
  },
  questionText: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#1f2123',
    lineHeight: 1.5,
    margin: '0 0 1rem 0',
  },
  answerTextarea: {
    width: '100%',
    padding: '1rem',
    background: '#fcfcfd',
    border: '1px solid #e4e6ea',
    borderRadius: '14px',
    color: '#1f2123',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
    fontSize: '0.88rem',
    lineHeight: 1.5,
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
  },
  evaluationBox: {
    marginTop: '1.5rem',
    borderTop: '1px solid #f0f2f5',
    paddingTop: '1.5rem',
  },
  evalScoreHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  scoreBadge: {
    padding: '0.5rem 1.25rem',
    borderRadius: '14px',
    border: '2px solid',
    fontWeight: 900,
    fontSize: '1.2rem',
  },
  evalSection: {
    marginBottom: '1rem',
  },
  evalLabel: {
    fontSize: '0.78rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#5b5e64',
    marginBottom: '0.4rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  evalSubCard: {
    padding: '1rem',
    background: '#f6f5f1',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    borderRadius: '14px',
  },
  evalList: {
    margin: 0,
    paddingLeft: '1.2rem',
    fontSize: '0.85rem',
    color: '#1f2123',
    lineHeight: 1.5,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  idealAnswerBox: {
    padding: '1rem',
    background: '#f6f5f1',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    borderRadius: '14px',
    color: '#1f2123',
    fontSize: '0.88rem',
    lineHeight: 1.6,
  },
  followUpCard: {
    padding: '0.85rem 1.25rem',
    background: 'rgba(245, 200, 66, 0.2)',
    border: '1px solid rgba(245, 200, 66, 0.4)',
    borderRadius: '14px',
    marginTop: '0.75rem',
  },
  mockChatWindow: {
    height: '450px',
    overflowY: 'auto',
    background: '#fbfbfa',
    border: '1px solid #e4e6ea',
    borderRadius: '18px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1rem',
  },
  chatBubbleRow: {
    display: 'flex',
    width: '100%',
  },
  chatBubble: {
    maxWidth: '75%',
    padding: '0.85rem 1.1rem',
    borderRadius: '16px',
  },
  chatBubbleAi: {
    background: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    color: '#1f2123',
    borderBottomLeftRadius: '2px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
  },
  chatBubbleUser: {
    background: '#1f2123',
    color: '#ffffff',
    borderBottomRightRadius: '2px',
  },
  chatSpeakerName: {
    fontSize: '0.72rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '4px',
    opacity: 0.8,
  },
  livePulseDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#22c55e',
    boxShadow: '0 0 10px #22c55e',
    display: 'inline-block',
  },
  mockInputRow: {
    display: 'flex',
    gap: '0.75rem',
  },
  mockInputField: {
    flex: 1,
    padding: '0.85rem 1rem',
    background: '#ffffff',
    border: '1px solid #e4e6ea',
    borderRadius: '12px',
    color: '#1f2123',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  mockSendBtn: {
    padding: '0 1.5rem',
    background: '#1f2123',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scorecardContainer: {
    maxWidth: '850px',
    margin: '0 auto',
  },
  scorecardHero: {
    textAlign: 'center',
    padding: '2rem',
    background: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    borderRadius: '24px',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
  },
  bigScoreBox: {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: '0.4rem',
    marginTop: '1rem',
    padding: '0.65rem 1.75rem',
    background: '#1f2123',
    borderRadius: '18px',
    color: '#f5c842',
  },
  bigScoreNumber: {
    fontSize: '3rem',
    fontWeight: 900,
    color: '#f5c842',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  bigScoreTotal: {
    fontSize: '1.2rem',
    color: '#cbd5e1',
    fontWeight: 600,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  metricCard: {
    background: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    borderRadius: '18px',
    padding: '1.25rem 1rem',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
  },
  metricLabel: {
    fontSize: '0.75rem',
    color: '#71757c',
    fontWeight: 600,
    marginBottom: '4px',
  },
  metricValue: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#1f2123',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  historyDrawer: {
    width: '420px',
    maxWidth: '90vw',
    height: '100vh',
    background: '#ffffff',
    borderLeft: '1px solid #e4e6ea',
    padding: '1.75rem',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-4px 0 25px rgba(0, 0, 0, 0.08)',
  },
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '1rem',
    borderBottom: '1px solid #f0f2f5',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#71757c',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  historyListContainer: {
    flex: 1,
    overflowY: 'auto',
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  historyItemCard: {
    padding: '1rem',
    background: '#f6f5f1',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'border-color 0.15s ease',
  },
  historyScorePill: {
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 800,
  }
};
