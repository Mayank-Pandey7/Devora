import React, { useState, useEffect, useRef } from 'react';
import { useAuth, API } from '../context/AuthContext';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Briefcase,
  History,
  ArrowRight,
  RefreshCw,
  Search,
  Check,
  X,
  Layers,
  Award,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResumeAnalyzer() {
  const { user } = useAuth();

  // Active Tab: 'upload' | 'results' | 'job-match'
  const [activeTab, setActiveTab] = useState('upload');
  const [loading, setLoading] = useState(false);
  const [matchingJob, setMatchingJob] = useState(false);

  // Upload Inputs
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' | 'text'
  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Full Stack Developer');
  const fileInputRef = useRef(null);

  // Active Analysis State
  const [analysis, setAnalysis] = useState(null);

  // Job Match State
  const [jobDescription, setJobDescription] = useState('');
  const [jobMatchResult, setJobMatchResult] = useState(null);

  // History State
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get('/resumes');
      if (res.data.success) {
        setHistoryList(res.data.history);
      }
    } catch (err) {
      console.warn('Failed to fetch resume history');
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf') || file.type === 'text/plain') {
        setSelectedFile(file);
      } else {
        toast.error('Please upload a PDF or text file.');
      }
    }
  };

  const handleAnalyzeResume = async (e) => {
    e?.preventDefault();

    if (uploadMethod === 'file' && !selectedFile) {
      return toast.error('Please select a PDF resume file.');
    }
    if (uploadMethod === 'text' && pastedText.trim().length < 50) {
      return toast.error('Please paste sufficient resume text (at least 50 characters).');
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('targetRole', targetRole);

      if (uploadMethod === 'file') {
        formData.append('resumeFile', selectedFile);
      } else {
        formData.append('resumeText', pastedText);
        formData.append('fileName', 'Pasted-Resume.txt');
      }

      const res = await API.post('/resumes/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setAnalysis(res.data.analysis);
        setJobMatchResult(null);
        setActiveTab('results');
        toast.success('Resume analyzed successfully!');
        fetchHistory();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchJob = async (e) => {
    e?.preventDefault();
    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      return toast.error('Please paste a full job description.');
    }

    setMatchingJob(true);
    try {
      const res = await API.post('/resumes/match-job', {
        resumeId: analysis?._id,
        resumeText: analysis?.resumeText,
        jobDescription
      });

      if (res.data.success) {
        setJobMatchResult(res.data.jobMatch);
        toast.success(`Job Match Score: ${res.data.jobMatch.jobMatchScore}%`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to match with job description.');
    } finally {
      setMatchingJob(false);
    }
  };

  const handleLoadPastAnalysis = async (id) => {
    setLoading(true);
    try {
      const res = await API.get(`/resumes/${id}`);
      if (res.data.success) {
        setAnalysis(res.data.analysis);
        setJobMatchResult(res.data.analysis.jobMatchAnalysis?.matchedSkills ? res.data.analysis.jobMatchAnalysis : null);
        setActiveTab('results');
        setHistoryOpen(false);
      }
    } catch (err) {
      toast.error('Failed to load past analysis');
    } finally {
      setLoading(false);
    }
  };

  const latestAts = historyList.length > 0 && historyList[0].atsScore ? historyList[0].atsScore : 0;
  const bestAts = historyList.length > 0 ? Math.max(...historyList.map(h => h.atsScore || 0)) : 0;

  return (
    <div style={styles.resumeContainer}>
      {/* ── HERO GREETING & METRIC PILL ROW (Dashboard text layout) ── */}
        <section style={styles.heroSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 style={styles.greetingTitle}>Resume ATS Audit</h1>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setHistoryOpen(true)}
                style={styles.secondaryBtn}
              >
                <History size={15} /> Past Audits ({historyList.length})
              </button>
              {analysis && (
                <button
                  onClick={() => {
                    setActiveTab('upload');
                    setAnalysis(null);
                    setSelectedFile(null);
                  }}
                  style={styles.outlineBtn}
                >
                  <UploadCloud size={15} /> New Resume
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
                  <span>{targetRole || 'Full Stack'}</span>
                </div>
              </div>

              <div style={styles.segmentColumn}>
                <span style={styles.segmentLabel}>Latest ATS</span>
                <div style={styles.segmentPillYellow}>
                  <span>{latestAts > 0 ? `${latestAts}%` : 'Unscanned'}</span>
                </div>
              </div>

              <div style={styles.segmentColumnWide}>
                <span style={styles.segmentLabel}>Audit Status</span>
                <div style={styles.diagonalPatternBar}>
                  <span style={styles.patternBarText}>
                    {analysis ? `${analysis.fileName || 'Active Analysis'}` : 'Ready To Scan'}
                  </span>
                </div>
              </div>

              <div style={styles.segmentColumn}>
                <span style={styles.segmentLabel}>Best ATS</span>
                <div style={styles.segmentPillOutlined}>
                  <span>{bestAts > 0 ? `${bestAts}%` : '—'}</span>
                </div>
              </div>
            </div>

            {/* Counter Stats Group */}
            <div style={styles.counterStatsGroup}>
              <div style={styles.counterItem}>
                <div style={styles.counterIconCircle}>
                  <FileText size={13} color="#1f2123" />
                </div>
                <div style={styles.counterNumber}>{historyList.length}</div>
                <div style={styles.counterLabel}>Scans</div>
              </div>

              <div style={styles.counterItem}>
                <div style={styles.counterIconCircle}>
                  <Award size={13} color="#1f2123" />
                </div>
                <div style={styles.counterNumber}>{bestAts > 0 ? `${bestAts}%` : '—'}</div>
                <div style={styles.counterLabel}>High Score</div>
              </div>

              <div style={styles.counterItem}>
                <div style={styles.counterIconCircle}>
                  <CheckCircle2 size={13} color="#1f2123" />
                </div>
                <div style={styles.counterNumber}>100%</div>
                <div style={styles.counterLabel}>Parsed</div>
              </div>
            </div>
          </div>
        </section>

      {/* ── Sub Navigation Tabs ── */}
      {analysis && (
        <div style={styles.tabBar}>
          <button
            onClick={() => setActiveTab('results')}
            style={{
              ...styles.tabItem,
              ...(activeTab === 'results' ? styles.tabItemActive : {})
            }}
          >
            <Award size={16} /> ATS Analysis & Score
          </button>
          <button
            onClick={() => setActiveTab('job-match')}
            style={{
              ...styles.tabItem,
              ...(activeTab === 'job-match' ? styles.tabItemActive : {})
            }}
          >
            <Briefcase size={16} /> Job Description Matcher
          </button>
        </div>
      )}

      {/* ── 1. UPLOAD VIEW ── */}
      {activeTab === 'upload' && (
        <div style={styles.uploadGrid}>
          {/* Left: Upload Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <UploadCloud size={18} color="#6366f1" /> Submit Resume for ATS Audit
            </h2>

            {/* Target Role */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Target Engineering Role</label>
              <input
                type="text"
                style={styles.textInput}
                placeholder="e.g. Full Stack Developer, React Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>

            {/* Upload Method Switch */}
            <div style={styles.segmentedControl}>
              <button
                type="button"
                onClick={() => setUploadMethod('file')}
                style={{
                  ...styles.segmentBtn,
                  ...(uploadMethod === 'file' ? styles.segmentBtnActive : {})
                }}
              >
                📄 Upload PDF
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod('text')}
                style={{
                  ...styles.segmentBtn,
                  ...(uploadMethod === 'text' ? styles.segmentBtnActive : {})
                }}
              >
                ✍️ Paste Text
              </button>
            </div>

            {/* File Dropzone */}
            {uploadMethod === 'file' ? (
              <div
                style={styles.dropzone}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept=".pdf,application/pdf,.txt"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
                  }}
                />
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <UploadCloud size={24} color="#6366f1" />
                </div>
                {selectedFile ? (
                  <div>
                    <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
                      {selectedFile.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                      {(selectedFile.size / 1024).toFixed(1)} KB • Ready to analyze
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.95rem' }}>
                      Click to upload or drag & drop your PDF resume
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                      Supports standard PDF & Text documents (Max 6MB)
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.formGroup}>
                <textarea
                  style={styles.textarea}
                  rows={9}
                  placeholder="Paste your full resume text here (Experience, Skills, Education, Projects)..."
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                />
              </div>
            )}

            <button
              onClick={handleAnalyzeResume}
              disabled={loading}
              style={styles.primaryLaunchBtn}
            >
              {loading ? (
                <span>Extracting & Auditing Resume...</span>
              ) : (
                <>
                  <Sparkles size={18} /> Analyze Resume with Devora AI
                </>
              )}
            </button>
          </div>

          {/* Right: ATS Checklist Guide */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={styles.card}>
              <h3 style={styles.cardSubTitle}>🎯 What ATS Scanners Look For</h3>
              <ul style={styles.tipList}>
                <li><strong>Clear standard section headings:</strong> Experience, Education, Skills, Projects.</li>
                <li><strong>Skill density:</strong> Explicit mentions of target frameworks, databases, and tools.</li>
                <li><strong>Quantified impact:</strong> Bullet points featuring metrics, percentages, and business outcomes.</li>
                <li><strong>Clean text hierarchy:</strong> Machine-readable layout without complex multi-column tables.</li>
              </ul>
            </div>

            <div style={{ ...styles.card, background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <TrendingUp size={18} color="#6366f1" />
                <span style={{ fontWeight: 700, color: '#f8fafc' }}>High-Impact Keywords</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Top tech recruiters filter resumes by specific technology tags. Devora cross-checks your resume against thousands of active job postings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. RESULTS VIEW ── */}
      {activeTab === 'results' && analysis && (
        <div style={styles.resultsContainer}>
          {/* Top Score Banner */}
          <div style={styles.scoreHero}>
            <div style={styles.scoreHeroLeft}>
              <div
                style={{
                  ...styles.scoreBadgeBig,
                  color: analysis.atsScore >= 80 ? '#4ade80' : '#facc15',
                  borderColor: analysis.atsScore >= 80 ? 'rgba(34, 197, 94, 0.4)' : 'rgba(234, 179, 8, 0.4)'
                }}
              >
                {analysis.atsScore}
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1f2123', margin: 0 }}>
                  ATS Compatibility Score
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#5b5e64', margin: '4px 0 0' }}>
                  {analysis.fileName} • Target: {targetRole}
                </p>
              </div>
            </div>

            <div style={styles.scoreHeroMetrics}>
              <div style={styles.scoreMiniPill}>
                <span style={{ color: '#5b5e64', fontSize: '0.75rem' }}>Structure</span>
                <span style={{ fontWeight: 700, color: '#1f2123' }}>{analysis.structureScore || 85}%</span>
              </div>
              <div style={styles.scoreMiniPill}>
                <span style={{ color: '#5b5e64', fontSize: '0.75rem' }}>Readability</span>
                <span style={{ fontWeight: 700, color: '#1f2123' }}>{analysis.readabilityScore || 88}%</span>
              </div>
            </div>
          </div>

          {/* Categorized Skills Breakdown */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>
              <Layers size={18} color="#6366f1" /> Detected Technical Stack & Skills
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Technical & Languages */}
              <div>
                <div style={styles.skillCategoryTitle}>Core Languages & Technologies</div>
                <div style={styles.tagWrap}>
                  {analysis.skillsDetected?.technical?.map((s, i) => (
                    <span key={i} style={styles.skillTagTech}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Frameworks */}
              {analysis.skillsDetected?.frameworks?.length > 0 && (
                <div>
                  <div style={styles.skillCategoryTitle}>Frameworks & Libraries</div>
                  <div style={styles.tagWrap}>
                    {analysis.skillsDetected.frameworks.map((s, i) => (
                      <span key={i} style={styles.skillTagFramework}>{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills (Crucial) */}
              {analysis.missingSkills?.length > 0 && (
                <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #e4e6ea' }}>
                  <div style={{ ...styles.skillCategoryTitle, color: '#dc2626' }}>
                    <AlertTriangle size={14} /> Recommended Skills To Add (Keyword Gap)
                  </div>
                  <div style={styles.tagWrap}>
                    {analysis.missingSkills.map((s, i) => (
                      <span key={i} style={styles.skillTagMissing}>+ {s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Strengths & Weaknesses 2-Column */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={styles.card}>
              <h3 style={{ ...styles.cardSubTitle, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} /> Key Resume Strengths
              </h3>
              <ul style={styles.evalList}>
                {analysis.strengths?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div style={styles.card}>
              <h3 style={{ ...styles.cardSubTitle, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} /> Critical Areas To Improve
              </h3>
              <ul style={styles.evalList}>
                {analysis.weaknesses?.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Suggestions */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>
              <Sparkles size={18} color="#6366f1" /> Actionable Step-by-Step Improvements
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {analysis.suggestions?.map((s, i) => (
                <div key={i} style={styles.suggestionItem}>
                  <div style={styles.suggestionNum}>{i + 1}</div>
                  <div style={{ fontSize: '0.92rem', color: '#1f2123', lineHeight: 1.5, fontWeight: 500 }}>{s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section-by-Section Audit */}
          {analysis.sectionAnalysis && Object.keys(analysis.sectionAnalysis).length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Section-by-Section Health Audit</h3>
              <div style={styles.sectionAuditGrid}>
                {Object.entries(analysis.sectionAnalysis).map(([key, val]) => {
                  const labelMap = {
                    contactInfo: 'Contact Information',
                    professionalSummary: 'Professional Summary',
                    workExperience: 'Work Experience',
                    education: 'Education',
                    skillsSection: 'Skills & Tools',
                    projects: 'Projects'
                  };
                  return (
                    <div key={key} style={styles.auditCard}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1f2123' }}>
                          {labelMap[key] || key}
                        </span>
                        <span
                          style={{
                            ...styles.statusPill,
                            background: val.status === 'good' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                            color: val.status === 'good' ? '#15803d' : '#b45309'
                          }}
                        >
                          {val.score}%
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#5b5e64', margin: 0, lineHeight: 1.45 }}>
                        {val.feedback}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA to Job Matcher */}
          <div style={{ ...styles.card, background: 'rgba(99, 102, 241, 0.08)', borderColor: 'rgba(99, 102, 241, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', fontWeight: 700 }}>
                Compare this resume against a specific Job Description
              </h4>
              <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                Find missing keywords and skill match percentage for your dream job.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('job-match')}
              style={styles.primaryLaunchBtn}
            >
              Match Job Description <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}

      {/* ── 3. JOB MATCH VIEW ── */}
      {activeTab === 'job-match' && (
        <div style={styles.jobMatchContainer}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <Briefcase size={18} color="#6366f1" /> Compare Resume vs Job Description
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '-0.5rem', marginBottom: '1.25rem' }}>
              Paste the requirements or description from a job posting (LinkedIn, Indeed, Company Careers).
            </p>

            <form onSubmit={handleMatchJob}>
              <textarea
                style={styles.textarea}
                rows={8}
                placeholder="Paste job posting description, responsibilities, and requirements here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={matchingJob}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                  type="submit"
                  disabled={matchingJob || !jobDescription.trim()}
                  style={styles.primaryLaunchBtn}
                >
                  {matchingJob ? (
                    <span>Matching against requirements...</span>
                  ) : (
                    <>
                      <Sparkles size={16} /> Analyze Job Match %
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Match Results */}
          {jobMatchResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
              {/* Score Header */}
              <div style={styles.scoreHero}>
                <div style={styles.scoreHeroLeft}>
                  <div
                    style={{
                      ...styles.scoreBadgeBig,
                      color: jobMatchResult.jobMatchScore >= 80 ? '#4ade80' : '#facc15',
                      borderColor: jobMatchResult.jobMatchScore >= 80 ? 'rgba(34, 197, 94, 0.4)' : 'rgba(234, 179, 8, 0.4)'
                    }}
                  >
                    {jobMatchResult.jobMatchScore}%
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1f2123', margin: 0 }}>
                      Job Match Alignment Score
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#5b5e64', margin: '4px 0 0' }}>
                      {jobMatchResult.jobMatchScore >= 80 ? 'High probability of interview callback' : 'Moderate alignment — add missing keywords'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Matched vs Missing Skills */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={styles.card}>
                  <h4 style={{ ...styles.cardSubTitle, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} /> Matched Skills In Your Resume
                  </h4>
                  <div style={styles.tagWrap}>
                    {jobMatchResult.matchedSkills?.map((s, i) => (
                      <span key={i} style={styles.skillTagTech}>✓ {s}</span>
                    ))}
                  </div>
                </div>

                <div style={styles.card}>
                  <h4 style={{ ...styles.cardSubTitle, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={16} /> Missing Skills In Job Posting
                  </h4>
                  <div style={styles.tagWrap}>
                    {jobMatchResult.missingSkills?.map((s, i) => (
                      <span key={i} style={styles.skillTagMissing}>+ {s}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div style={styles.card}>
                <h4 style={styles.cardTitle}>Tailoring Recommendations</h4>
                <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {jobMatchResult.experienceMatch}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {jobMatchResult.recommendations?.map((r, i) => (
                    <div key={i} style={styles.suggestionItem}>
                      <div style={styles.suggestionNum}>•</div>
                      <div style={{ fontSize: '0.9rem', color: '#1f2123', fontWeight: 500 }}>{r}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 4. HISTORY DRAWER ── */}
      {historyOpen && (
        <div style={styles.modalOverlay} onClick={() => setHistoryOpen(false)}>
          <div style={styles.historyDrawer} onClick={(e) => e.stopPropagation()}>
            <div style={styles.drawerHeader}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2123' }}>
                Saved Resume Analyses
              </h3>
              <button onClick={() => setHistoryOpen(false)} style={styles.closeBtn}>×</button>
            </div>

            <div style={styles.historyListContainer}>
              {historyList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No resumes analyzed yet. Upload your first resume!
                </div>
              ) : (
                historyList.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleLoadPastAnalysis(item._id)}
                    style={styles.historyItemCard}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#1f2123', fontSize: '0.92rem' }}>
                          {item.fileName}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#5b5e64', marginTop: '2px' }}>
                          {item.skillsDetected?.technical?.length || 0} skills extracted
                        </div>
                      </div>
                      <div
                        style={{
                          ...styles.historyScorePill,
                          background: item.atsScore >= 80 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                          color: item.atsScore >= 80 ? '#15803d' : '#4338ca'
                        }}
                      >
                        ATS {item.atsScore}%
                      </div>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '8px' }}>
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
  resumeContainer: {
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
    minWidth: '150px',
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
  tabBar: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.75rem',
    borderBottom: '1px solid #e4e6ea',
    paddingBottom: '0.75rem',
  },
  tabItem: {
    padding: '0.55rem 1.25rem',
    background: 'transparent',
    border: 'none',
    borderRadius: '30px',
    color: '#5b5e64',
    fontSize: '0.85rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  tabItemActive: {
    background: '#1f2123',
    color: '#ffffff',
    fontWeight: 700,
  },
  uploadGrid: {
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
  },
  textInput: {
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
  segmentedControl: {
    display: 'flex',
    background: '#f0f2f5',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    borderRadius: '30px',
    padding: '3px',
    gap: '3px',
    marginBottom: '1.25rem',
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
  },
  segmentBtnActive: {
    background: '#1f2123',
    color: '#ffffff',
    fontWeight: 700,
  },
  dropzone: {
    border: '2px dashed #cbd5e1',
    borderRadius: '18px',
    padding: '2.5rem 1.5rem',
    textAlign: 'center',
    cursor: 'pointer',
    background: '#fbfbfa',
    transition: 'all 0.15s ease',
    marginBottom: '1.25rem',
  },
  textarea: {
    width: '100%',
    padding: '1rem',
    background: '#fcfcfd',
    border: '1px solid #e4e6ea',
    borderRadius: '14px',
    color: '#1f2123',
    fontFamily: "'JetBrains Mono', monospace, sans-serif",
    fontSize: '0.85rem',
    lineHeight: 1.5,
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
  },
  primaryLaunchBtn: {
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
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  scoreHero: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#ffffff',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    borderRadius: '24px',
    padding: '1.75rem 2rem',
    flexWrap: 'wrap',
    gap: '1rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
  },
  scoreHeroLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  scoreBadgeBig: {
    width: '76px',
    height: '76px',
    borderRadius: '18px',
    border: '2px solid',
    background: '#1f2123',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 900,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  scoreHeroMetrics: {
    display: 'flex',
    gap: '0.75rem',
  },
  scoreMiniPill: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0.65rem 1.25rem',
    background: '#f6f5f1',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    borderRadius: '16px',
  },
  skillCategoryTitle: {
    fontSize: '0.78rem',
    fontWeight: 800,
    color: '#5b5e64',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '0.65rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  tagWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.45rem',
  },
  skillTagTech: {
    padding: '4px 10px',
    background: '#f6f5f1',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    borderRadius: '14px',
    color: '#1f2123',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  skillTagFramework: {
    padding: '4px 10px',
    background: 'rgba(245, 200, 66, 0.2)',
    border: '1px solid rgba(245, 200, 66, 0.4)',
    borderRadius: '14px',
    color: '#1f2123',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  skillTagMissing: {
    padding: '4px 10px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    borderRadius: '14px',
    color: '#b91c1c',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
  evalList: {
    margin: 0,
    paddingLeft: '1.2rem',
    fontSize: '0.88rem',
    color: '#1f2123',
    lineHeight: 1.6,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  suggestionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.85rem',
    background: '#f6f5f1',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    borderRadius: '14px',
  },
  suggestionNum: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#1f2123',
    color: '#f5c842',
    fontSize: '0.75rem',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sectionAuditGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem',
  },
  auditCard: {
    padding: '1rem',
    background: '#f6f5f1',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    borderRadius: '14px',
  },
  statusPill: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.72rem',
    fontWeight: 800,
  },
  jobMatchContainer: {
    maxWidth: '900px',
    margin: '0 auto',
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
