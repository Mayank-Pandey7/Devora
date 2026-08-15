import React, { useState, useEffect, useRef } from 'react';
import { useAuth, API } from '../context/AuthContext';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
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
  RotateCcw,
  Code,
  List,
  Flame,
  CheckSquare
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

  // Voice Recognition & Audio Features
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  // Answer Timer / Pace Tracker
  const [answerSeconds, setAnswerSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  // Timer logic for active Q&A
  useEffect(() => {
    if (viewState === 'active-qa' && !latestEvaluation) {
      setAnswerSeconds(0);
      timerRef.current = setInterval(() => {
        setAnswerSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [viewState, session?.currentQuestionIndex, latestEvaluation]);

  // Web Speech API Voice-to-Text Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (viewState === 'active-mock') {
          setMockInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        } else {
          setCurrentAnswerText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition notice:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [viewState]);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      return toast.error('Speech recognition is not supported in this browser. Try Chrome or Edge.');
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast.success('Voice dictation stopped');
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.success('Listening... Speak your answer out loud!');
      } catch (err) {
        setIsRecording(false);
      }
    }
  };

  const handleSpeakQuestion = (text) => {
    if (!('speechSynthesis' in window)) {
      return toast.error('Speech synthesis not supported in this browser.');
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

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

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
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
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleEndSession = () => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }

    setSession(null);
    setCurrentAnswerText('');
    setLatestEvaluation(null);
    setMockMessages([]);
    setMockInput('');
    setAnswerSeconds(0);
    setViewState('config');
    toast.success('Interview session ended. All session data cleared.');
    fetchHistory();
  };

  const handleInsertSTAR = (part) => {
    const templates = {
      S: '\n**Situation:** When working on [project/feature]...',
      T: '\n**Task:** My objective was to [solve problem / improve metric]...',
      A: '\n**Action:** I implemented [architecture / algorithm / solution] by...',
      R: '\n**Result:** This improved [latency / throughput / reliability] by [X%]...'
    };
    setCurrentAnswerText((prev) => prev + (templates[part] || ''));
  };

  const handleInsertCodeBlock = () => {
    setCurrentAnswerText((prev) => prev + '\n```javascript\n// Write your code implementation here\n\n```\n');
  };

  const handleSendMockMessage = async (e) => {
    e?.preventDefault();
    if (!mockInput.trim()) return;

    const userText = mockInput;
    setMockInput('');

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

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
          toast.success('Mock interview finished! Generating scorecard...');
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

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedCount = historyList.filter((h) => h.status === 'completed').length;
  const avgScore =
    historyList.length > 0
      ? Math.round(
          historyList.filter((h) => h.overallScore).reduce((acc, h) => acc + h.overallScore, 0) /
            (historyList.filter((h) => h.overallScore).length || 1)
        )
      : 0;

  return (
    <div style={styles.interviewContainer}>
      {/* ── HERO GREETING & METRIC PILL ROW ── */}
      <section style={styles.heroSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={styles.greetingTitle}>AI Interview Practice</h1>
            <p style={{ fontSize: '0.88rem', color: '#5b5e64', margin: '4px 0 0' }}>
              Real-time speech-to-text dictation, live audio questions, and automated STAR evaluations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setHistoryOpen(true)} style={styles.secondaryBtn}>
              <History size={15} /> Past Sessions ({historyList.length})
            </button>
            {viewState !== 'config' && (
              <button
                onClick={handleEndSession}
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
              <Zap size={18} color="#f5c842" /> Configure AI Interview Session
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
              <label style={styles.label}>Interview Domain & Technology Stack</label>
              <div style={styles.topicGrid}>
                {TOPICS.map((t) => {
                  const isSelected = interviewType === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setInterviewType(t.id)}
                      style={{
                        ...styles.topicCard,
                        ...(isSelected ? styles.topicCardActive : {})
                      }}
                    >
                      <div style={styles.topicCardHeader}>
                        <span style={{ fontWeight: 800, fontSize: '0.92rem', color: isSelected ? '#ffffff' : '#1f2123' }}>
                          {t.label}
                        </span>
                        {isSelected ? (
                          <div style={styles.activeCheckPill}>
                            <Check size={12} color="#1f2123" strokeWidth={3} />
                          </div>
                        ) : (
                          <div style={styles.inactiveCircle} />
                        )}
                      </div>
                      <span style={{ ...styles.topicDesc, color: isSelected ? '#f5c842' : '#71757c' }}>
                        {t.desc}
                      </span>
                    </div>
                  );
                })}
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
                  <option value={10}>10 Questions (Comprehensive Mock)</option>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.92rem', color: mode === 'question-by-question' ? '#ffffff' : '#1f2123' }}>
                      📝 Question by Question
                    </span>
                    {mode === 'question-by-question' ? (
                      <div style={styles.activeCheckPill}>
                        <Check size={12} color="#1f2123" strokeWidth={3} />
                      </div>
                    ) : (
                      <div style={styles.inactiveCircle} />
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: mode === 'question-by-question' ? '#cbd5e1' : '#71757c', lineHeight: 1.4 }}>
                    Step-by-step answering with voice dictation and instant STAR scorecards.
                  </div>
                </div>

                <div
                  onClick={() => setMode('mock-conversation')}
                  style={{
                    ...styles.formatCard,
                    ...(mode === 'mock-conversation' ? styles.formatCardActive : {})
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.92rem', color: mode === 'mock-conversation' ? '#ffffff' : '#1f2123' }}>
                      🎙️ Live Interactive Mock
                    </span>
                    {mode === 'mock-conversation' ? (
                      <div style={styles.activeCheckPill}>
                        <Check size={12} color="#1f2123" strokeWidth={3} />
                      </div>
                    ) : (
                      <div style={styles.inactiveCircle} />
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: mode === 'mock-conversation' ? '#cbd5e1' : '#71757c', lineHeight: 1.4 }}>
                    Real-time conversational flow with AI hiring lead asking dynamic follow-ups.
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
              <h3 style={styles.cardSubTitle}>💡 Interview Success Strategies</h3>
              <ul style={styles.tipList}>
                <li><strong>Use Voice Dictation:</strong> Click 🎙️ Speak Answer to practice pacing and spoken articulation.</li>
                <li><strong>Structure with STAR:</strong> Situation, Task, Action, Result guarantees high behavioral scoring.</li>
                <li><strong>Discuss Trade-offs:</strong> High-scoring technical answers discuss time vs space complexity.</li>
                <li><strong>Review Ideal Answers:</strong> Compare your submission with gold-standard industry solutions.</li>
              </ul>
            </div>

            <div style={{ ...styles.card, background: '#f6f5f1', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <Sparkles size={18} color="#1f2123" />
                <span style={{ fontWeight: 800, color: '#1f2123', fontSize: '0.92rem' }}>AI Evaluation Criteria</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#5b5e64', lineHeight: 1.5, margin: 0 }}>
                Your responses are analyzed for technical depth, structural completeness, handling of edge cases, architectural trade-offs, and communication clarity.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. ACTIVE QUESTION-BY-QUESTION MODE ── */}
      {viewState === 'active-qa' && session && (
        <div style={styles.activeContainer}>
          {/* Progress & Live Stopwatch Header */}
          <div style={styles.sessionHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={styles.difficultyBadge}>{session.difficulty}</span>
              <span style={{ fontWeight: 700, color: '#1f2123', fontSize: '0.95rem' }}>
                {session.role} — {session.interviewType}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {!latestEvaluation && (
                <div style={styles.liveTimerPill}>
                  <Clock size={13} color="#1f2123" />
                  <span>Pace: {formatTimer(answerSeconds)}</span>
                </div>
              )}
              <div style={{ fontSize: '0.85rem', color: '#5b5e64', fontWeight: 600 }}>
                Question <strong>{Math.min(session.currentQuestionIndex + 1, session.totalQuestions)}</strong> of <strong>{session.totalQuestions}</strong>
              </div>
              <button
                type="button"
                onClick={handleEndSession}
                style={styles.endSessionBtn}
                title="End interview session and clear data"
              >
                End Session
              </button>
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

                {/* Text-to-Speech Button */}
                <button
                  type="button"
                  onClick={() => handleSpeakQuestion(session.questions[session.currentQuestionIndex].question)}
                  style={styles.listenAudioBtn}
                  title="Read question out loud"
                >
                  {isSpeaking ? <VolumeX size={14} color="#dc2626" /> : <Volume2 size={14} color="#1f2123" />}
                  <span>{isSpeaking ? 'Mute' : 'Listen'}</span>
                </button>
              </div>

              <h2 style={styles.questionText}>
                {session.questions[session.currentQuestionIndex].question}
              </h2>

              {/* Answer Input */}
              {!latestEvaluation ? (
                <form onSubmit={handleSubmitAnswer} style={{ marginTop: '1.25rem' }}>
                  {/* Formatting & Voice Toolbar */}
                  <div style={styles.answerToolbar}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5b5e64', alignSelf: 'center', marginRight: '4px' }}>
                        STAR Helpers:
                      </span>
                      <button type="button" onClick={() => handleInsertSTAR('S')} style={styles.starHelperChip}>+ Situation</button>
                      <button type="button" onClick={() => handleInsertSTAR('T')} style={styles.starHelperChip}>+ Task</button>
                      <button type="button" onClick={() => handleInsertSTAR('A')} style={styles.starHelperChip}>+ Action</button>
                      <button type="button" onClick={() => handleInsertSTAR('R')} style={styles.starHelperChip}>+ Result</button>
                      <button type="button" onClick={handleInsertCodeBlock} style={styles.codeSnippetChip}>
                        <Code size={12} /> Code Block
                      </button>
                    </div>

                    {/* Microphone Dictation Button */}
                    <button
                      type="button"
                      onClick={toggleVoiceRecording}
                      style={{
                        ...styles.micDictationBtn,
                        ...(isRecording ? styles.micDictationBtnActive : {})
                      }}
                    >
                      {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                      <span>{isRecording ? 'Listening (Click to Stop)' : 'Dictate Answer'}</span>
                    </button>
                  </div>

                  <textarea
                    style={styles.answerTextarea}
                    rows={8}
                    placeholder="Provide your comprehensive explanation, code snippets, or architectural trade-offs (type or click 'Dictate Answer' above)..."
                    value={currentAnswerText}
                    onChange={(e) => setCurrentAnswerText(e.target.value)}
                    disabled={submittingAnswer}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={handleEndSession}
                      style={styles.outlineBtnSmall}
                    >
                      Exit / End Session
                    </button>
                    <button
                      type="submit"
                      disabled={submittingAnswer || !currentAnswerText.trim()}
                      style={styles.primaryLaunchBtnInline}
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
                          color: latestEvaluation.score >= 80 ? '#15803d' : '#b45309',
                          borderColor: latestEvaluation.score >= 80 ? 'rgba(34, 197, 94, 0.4)' : 'rgba(234, 179, 8, 0.4)'
                        }}
                      >
                        {latestEvaluation.score} / 100
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1f2123' }}>
                          {latestEvaluation.score >= 80 ? 'Exceptional Response' : 'Solid Foundation'}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#5b5e64' }}>AI Evaluation Score</div>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <div style={styles.evalSection}>
                    <div style={styles.evalLabel}>AI Technical Feedback</div>
                    <p style={{ fontSize: '0.92rem', color: '#1f2123', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                      {latestEvaluation.feedback}
                    </p>
                  </div>

                  {/* Strengths & Missed Points */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div style={styles.evalSubCard}>
                      <div style={{ ...styles.evalLabel, color: '#16a34a' }}>
                        <CheckCircle2 size={15} /> What You Did Well
                      </div>
                      <ul style={styles.evalList}>
                        {latestEvaluation.strengths?.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={styles.evalSubCard}>
                      <div style={{ ...styles.evalLabel, color: '#dc2626' }}>
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
                      <div style={{ ...styles.evalLabel, color: '#4338ca' }}>
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
                      <span style={{ fontWeight: 700, color: '#1f2123', fontSize: '0.88rem' }}>
                        💡 Interviewer Follow-Up Probe: {latestEvaluation.followUpQuestion}
                      </span>
                    </div>
                  )}

                  {/* Next Question / Finish Action */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
                    <button
                      type="button"
                      onClick={handleEndSession}
                      style={styles.outlineBtnSmall}
                    >
                      Exit Session
                    </button>
                    {session.currentQuestionIndex < session.totalQuestions - 1 ? (
                      <button onClick={handleNextQuestion} style={styles.primaryLaunchBtnInline}>
                        Next Question <ChevronRight size={17} />
                      </button>
                    ) : (
                      <button onClick={() => setViewState('completed')} style={styles.primaryLaunchBtnInline}>
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
              <span style={{ fontWeight: 700, color: '#1f2123', fontSize: '0.95rem' }}>
                Live Mock Interviewer — {session.role} ({session.interviewType})
              </span>
            </div>
            <button onClick={handleEndSession} style={styles.endSessionBtn}>
              End Session & Clear
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={styles.chatSpeakerName}>
                      {msg.speaker === 'user' ? 'You' : 'AI Technical Hiring Lead'}
                    </div>
                    {msg.speaker !== 'user' && (
                      <button
                        type="button"
                        onClick={() => handleSpeakQuestion(msg.message)}
                        style={styles.bubbleSpeakBtn}
                        title="Read message"
                      >
                        <Volume2 size={12} />
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: '0.92rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {msg.message}
                  </div>
                </div>
              </div>
            ))}
            {submittingAnswer && (
              <div style={{ ...styles.chatBubbleRow, justifyContent: 'flex-start' }}>
                <div style={{ ...styles.chatBubble, ...styles.chatBubbleAi, fontStyle: 'italic', color: '#5b5e64' }}>
                  AI Hiring Lead is formulating response...
                </div>
              </div>
            )}
          </div>

          {/* Input Box with Voice Button */}
          <form onSubmit={handleSendMockMessage} style={styles.mockInputRow}>
            <input
              type="text"
              placeholder="Type your response or use voice dictation..."
              value={mockInput}
              onChange={(e) => setMockInput(e.target.value)}
              disabled={submittingAnswer}
              style={styles.mockInputField}
            />
            <button
              type="button"
              onClick={toggleVoiceRecording}
              style={{
                ...styles.mockMicBtn,
                ...(isRecording ? styles.mockMicBtnActive : {})
              }}
              title="Dictate with voice"
            >
              <Mic size={16} />
            </button>
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
            <div style={styles.scorecardHeroIcon}>
              <Award size={36} color="#f5c842" />
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1f2123', marginBottom: '0.4rem', fontFamily: "'Libre Caslon Text', Georgia, serif" }}>
              Interview Performance Scorecard
            </h2>
            <p style={{ color: '#5b5e64', fontSize: '0.92rem', margin: 0 }}>
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
              <div style={styles.metricLabel}>STAR Structure</div>
              <div style={styles.metricValue}>{session.metrics?.structureScore || 84}%</div>
            </div>
          </div>

          {/* Questions Review List */}
          {session.answers && session.answers.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>
                <CheckSquare size={18} color="#1f2123" /> Question-by-Question Breakdown
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {session.answers.map((ans, idx) => (
                  <div key={idx} style={styles.scorecardAnswerCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1f2123' }}>
                        Q{idx + 1}: {ans.question}
                      </span>
                      <span
                        style={{
                          ...styles.historyScorePill,
                          background: ans.score >= 80 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                          color: ans.score >= 80 ? '#15803d' : '#b45309'
                        }}
                      >
                        {ans.score}%
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#5b5e64', margin: '0 0 0.5rem 0' }}>
                      <strong>Your Answer:</strong> {ans.userAnswer}
                    </p>
                    <p style={{ fontSize: '0.82rem', color: '#1f2123', margin: 0, fontWeight: 500 }}>
                      <strong>Feedback:</strong> {ans.feedback}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              onClick={handleEndSession}
              style={styles.primaryLaunchBtnInline}
            >
              <RotateCcw size={16} /> Start Another Interview
            </button>
          </div>
        </div>
      )}

      {/* ── 5. HISTORY DRAWER ── */}
      {historyOpen && (
        <div style={styles.modalOverlay} onClick={() => setHistoryOpen(false)}>
          <div style={styles.historyDrawer} onClick={(e) => e.stopPropagation()}>
            <div style={styles.drawerHeader}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1f2123', margin: 0 }}>
                Saved Interview Sessions
              </h3>
              <button onClick={() => setHistoryOpen(false)} style={styles.closeBtn}>×</button>
            </div>

            <div style={styles.historyListContainer}>
              {historyList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#71757c' }}>
                  No interview sessions recorded yet. Start your first practice round!
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
                        <div style={{ fontWeight: 800, color: '#1f2123', fontSize: '0.92rem' }}>
                          {item.role} ({item.interviewType})
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#5b5e64', marginTop: '2px' }}>
                          {item.difficulty} • {item.totalQuestions} Questions
                        </div>
                      </div>
                      <div
                        style={{
                          ...styles.historyScorePill,
                          background: (item.overallScore || 0) >= 80 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 200, 66, 0.25)',
                          color: (item.overallScore || 0) >= 80 ? '#15803d' : '#854d0e'
                        }}
                      >
                        {item.overallScore ? `${item.overallScore}%` : 'In Progress'}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#71757c', marginTop: '8px' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
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
    maxWidth: '1280px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  heroSection: {
    marginBottom: '1.75rem',
  },
  greetingTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#1f2123',
    margin: 0,
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: '-0.02em',
  },
  heroMetricsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    borderRadius: '24px',
    padding: '0.85rem 1.25rem',
    marginTop: '1.25rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  segmentedMetricGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  segmentColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  segmentColumnWide: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  segmentLabel: {
    fontSize: '0.7rem',
    color: '#71757c',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
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
    background: '#1f2123',
    padding: '5px 16px',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: 800,
  },
  patternBarText: {
    color: '#ffffff',
    fontWeight: 800,
    letterSpacing: '0.04em',
  },
  segmentPillOutlined: {
    background: '#f6f5f1',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    color: '#1f2123',
    padding: '5px 14px',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: 800,
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
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background: '#f6f5f1',
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
    border: '1px solid rgba(0, 0, 0, 0.05)',
    borderRadius: '24px',
    padding: '1.75rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
  },
  cardTitle: {
    fontSize: '1.15rem',
    fontWeight: 800,
    color: '#1f2123',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: '0 0 1.25rem 0',
  },
  cardSubTitle: {
    fontSize: '1rem',
    fontWeight: 800,
    color: '#1f2123',
    margin: '0 0 0.75rem 0',
  },
  formGroup: {
    marginBottom: '1.25rem',
  },
  label: {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 800,
    color: '#5b5e64',
    marginBottom: '0.45rem',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },
  selectInput: {
    width: '100%',
    padding: '0.65rem 0.9rem',
    background: '#fcfcfd',
    border: '1px solid #e4e6ea',
    borderRadius: '12px',
    color: '#1f2123',
    fontSize: '0.88rem',
    fontWeight: 600,
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
    padding: '0.9rem 1rem',
    background: '#fafaf9',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    borderRadius: '16px',
    cursor: 'pointer',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    transition: 'all 0.15s ease',
    boxShadow: 'none',
  },
  topicCardActive: {
    borderColor: '#1f2123',
    background: '#1f2123',
    border: '1px solid #1f2123',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-1px)',
  },
  topicCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  activeCheckPill: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#f5c842',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  inactiveCircle: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '1px solid #d1d5db',
    background: '#f6f5f1',
    flexShrink: 0,
  },
  topicDesc: {
    display: 'block',
    fontSize: '0.74rem',
    lineHeight: 1.35,
    fontWeight: 500,
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
    fontWeight: 700,
    cursor: 'pointer',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    transition: 'all 0.15s ease',
  },
  segmentBtnActive: {
    background: '#1f2123',
    color: '#ffffff',
  },
  formatCard: {
    padding: '0.95rem 1rem',
    background: '#fafaf9',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    borderRadius: '16px',
    cursor: 'pointer',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    transition: 'all 0.15s ease',
    boxShadow: 'none',
  },
  formatCardActive: {
    borderColor: '#1f2123',
    background: '#1f2123',
    border: '1px solid #1f2123',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-1px)',
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
  primaryLaunchBtnInline: {
    padding: '0.75rem 1.5rem',
    background: '#1f2123',
    border: 'none',
    borderRadius: '14px',
    color: '#ffffff',
    fontWeight: 800,
    fontSize: '0.88rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
  },
  secondaryBtn: {
    padding: '0.65rem 1.25rem',
    background: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    borderRadius: '30px',
    color: '#1f2123',
    fontWeight: 700,
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
  },
  outlineBtn: {
    padding: '0.65rem 1.25rem',
    background: 'transparent',
    border: '1px solid #d1d5db',
    borderRadius: '30px',
    color: '#5b5e64',
    fontWeight: 700,
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    cursor: 'pointer',
  },
  outlineBtnSmall: {
    padding: '0.65rem 1.1rem',
    background: 'transparent',
    border: '1px solid #d1d5db',
    borderRadius: '12px',
    color: '#71757c',
    fontWeight: 700,
    fontSize: '0.82rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  endSessionBtn: {
    padding: '0.4rem 0.9rem',
    background: '#ffffff',
    border: '1px solid rgba(220, 38, 38, 0.25)',
    borderRadius: '20px',
    color: '#dc2626',
    fontWeight: 800,
    fontSize: '0.76rem',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    transition: 'all 0.15s ease',
  },
  tipList: {
    margin: 0,
    paddingLeft: '1.2rem',
    color: '#5b5e64',
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
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  difficultyBadge: {
    padding: '4px 10px',
    background: 'rgba(245, 200, 66, 0.3)',
    color: '#1f2123',
    borderRadius: '12px',
    fontSize: '0.72rem',
    fontWeight: 800,
  },
  liveTimerPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '4px 10px',
    background: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    borderRadius: '14px',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#1f2123',
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
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem',
    flexWrap: 'wrap',
  },
  questionNumPill: {
    padding: '4px 12px',
    background: '#1f2123',
    color: '#f5c842',
    borderRadius: '14px',
    fontSize: '0.75rem',
    fontWeight: 800,
  },
  categoryPill: {
    padding: '4px 12px',
    background: '#f0f2f5',
    color: '#5b5e64',
    borderRadius: '14px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  listenAudioBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '4px 10px',
    background: '#f6f5f1',
    border: '1px solid rgba(0,0,0,0.06)',
    borderRadius: '14px',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#1f2123',
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  questionText: {
    fontSize: '1.3rem',
    fontWeight: 800,
    color: '#1f2123',
    lineHeight: 1.5,
    margin: '0 0 1.25rem 0',
  },
  answerToolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.65rem',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  starHelperChip: {
    padding: '3px 8px',
    background: '#f6f5f1',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    borderRadius: '10px',
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#1f2123',
    cursor: 'pointer',
  },
  codeSnippetChip: {
    padding: '3px 8px',
    background: '#1f2123',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#f5c842',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
  },
  micDictationBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '5px 12px',
    background: '#f6f5f1',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#1f2123',
    cursor: 'pointer',
  },
  micDictationBtnActive: {
    background: '#ef4444',
    color: '#ffffff',
    borderColor: '#dc2626',
    animation: 'pulse 1.5s infinite',
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
    lineHeight: 1.6,
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
    fontFamily: "'Space Grotesk', sans-serif",
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
    fontWeight: 500,
  },
  idealAnswerBox: {
    padding: '1rem',
    background: '#f6f5f1',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    borderRadius: '14px',
    color: '#1f2123',
    fontSize: '0.88rem',
    lineHeight: 1.6,
    fontWeight: 500,
  },
  followUpCard: {
    padding: '0.85rem 1.25rem',
    background: 'rgba(245, 200, 66, 0.25)',
    border: '1px solid rgba(245, 200, 66, 0.5)',
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
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: '#71757c',
  },
  bubbleSpeakBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#71757c',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
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
    gap: '0.5rem',
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
    fontWeight: 500,
  },
  mockMicBtn: {
    padding: '0 1rem',
    background: '#f6f5f1',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: '12px',
    color: '#1f2123',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockMicBtnActive: {
    background: '#ef4444',
    color: '#ffffff',
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
    padding: '2.25rem 2rem',
    background: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    borderRadius: '24px',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
  },
  scorecardHeroIcon: {
    width: '76px',
    height: '76px',
    borderRadius: '50%',
    background: '#1f2123',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.25rem',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  },
  bigScoreBox: {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: '0.4rem',
    marginTop: '1.25rem',
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
    color: '#94a3b8',
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
    border: '1px solid rgba(0, 0, 0, 0.05)',
    borderRadius: '18px',
    padding: '1.25rem 1rem',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
  },
  metricLabel: {
    fontSize: '0.75rem',
    color: '#71757c',
    fontWeight: 700,
    marginBottom: '4px',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#1f2123',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  scorecardAnswerCard: {
    padding: '1rem',
    background: '#f6f5f1',
    border: '1px solid rgba(0,0,0,0.06)',
    borderRadius: '14px',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
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
