import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Briefcase,
  Layers,
  FileText,
  Github,
  Linkedin,
  Globe,
  Save,
  Sparkles,
  CheckCircle2,
  X,
  Award,
  Code2,
  Camera,
  Upload,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const EXPERIENCE_LEVELS = [
  'Student',
  'Graduate',
  'Junior',
  'Mid-Level',
  'Senior',
  'Lead'
];

const PRESET_AVATARS = [
  {
    id: 'avatar-alex',
    label: 'Alex',
    role: 'Lead Architect',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4'
  },
  {
    id: 'avatar-aneka',
    label: 'Aneka',
    role: 'Full Stack Engineer',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ffdfbf'
  },
  {
    id: 'avatar-marcus',
    label: 'Marcus',
    role: 'Backend Hacker',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=d1d4f9'
  },
  {
    id: 'avatar-elena',
    label: 'Elena',
    role: 'Frontend Specialist',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=ffd5dc'
  },
  {
    id: 'avatar-leo',
    label: 'Leo',
    role: 'Systems Engineer',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo&backgroundColor=c0aede'
  },
  {
    id: 'avatar-sophia',
    label: 'Sophia',
    role: 'AI / ML Scientist',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia&backgroundColor=d1f4e0'
  },
  {
    id: 'avatar-oliver',
    label: 'Oliver',
    role: 'Cloud / DevOps',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver&backgroundColor=fef3cf'
  },
  {
    id: 'avatar-maya',
    label: 'Maya',
    role: 'Product Engineer',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya&backgroundColor=e2e8f0'
  },
  {
    id: 'avatar-kai',
    label: 'Kai',
    role: 'Algo / Security',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kai&backgroundColor=fde047'
  }
];

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '👨‍💻');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Full Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Student');
  const [bio, setBio] = useState(user?.bio || '');
  const [github, setGithub] = useState(user?.github || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin || '');
  const [portfolio, setPortfolio] = useState(user?.portfolio || '');
  
  // Skills tags
  const [skills, setSkills] = useState(user?.skills || ['JavaScript', 'React', 'Node.js', 'PostgreSQL']);
  const [skillInput, setSkillInput] = useState('');

  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '👨‍💻');
      setTargetRole(user.targetRole || 'Full Stack Developer');
      // Normalize legacy 'Student / Graduate' to 'Student' or 'Graduate'
      if (user.experienceLevel === 'Student / Graduate') {
        setExperienceLevel('Student');
      } else {
        setExperienceLevel(user.experienceLevel || 'Student');
      }
      setBio(user.bio || '');
      setGithub(user.github || '');
      setLinkedin(user.linkedin || '');
      setPortfolio(user.portfolio || '');
      if (user.skills && Array.isArray(user.skills)) {
        setSkills(user.skills);
      }
    }
  }, [user]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error('Photo must be less than 2MB');
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
      setShowAvatarPicker(false);
      toast.success('Custom photo selected!');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = (e) => {
    e.preventDefault();
    if (!customAvatarUrl.trim()) return;
    setAvatar(customAvatarUrl.trim());
    setCustomAvatarUrl('');
    setShowAvatarPicker(false);
    toast.success('Avatar URL applied!');
  };

  const handleAddSkill = (e) => {
    e?.preventDefault();
    if (!skillInput.trim()) return;
    const cleanSkill = skillInput.trim();
    if (!skills.includes(cleanSkill)) {
      setSkills([...skills, cleanSkill]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error('Name is required');
    }

    setSaving(true);
    try {
      await updateProfile({
        name,
        avatar,
        targetRole,
        experienceLevel,
        bio,
        github,
        linkedin,
        portfolio,
        skills
      });
      toast.success('Developer profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const userInitial = name ? name.charAt(0).toUpperCase() : 'M';

  const renderAvatarGraphic = (size = 64) => {
    if (avatar && (avatar.startsWith('http') || avatar.startsWith('data:'))) {
      return (
        <img
          src={avatar}
          alt={name}
          style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', objectFit: 'cover' }}
        />
      );
    }
    if (avatar && avatar.length <= 4) {
      return <span style={{ fontSize: `${size * 0.55}px` }}>{avatar}</span>;
    }
    return <span>{userInitial}</span>;
  };

  return (
    <div style={styles.profileContainer}>
      {/* ─── 1. HERO GREETING ─── */}
      <section style={styles.heroSection}>
        <h1 style={styles.greetingTitle}>Developer Profile & Stack</h1>
      </section>

      {/* ─── 2. REPOSITIONED DEVELOPER IDENTITY PASSPORT CARD (FIRST SECTION, NO ACTIVE BUTTON) ─── */}
      <section style={styles.passportHeroCard}>
        <div style={styles.passportInner}>
          <div style={styles.passportAvatarWrapper} onClick={() => setShowAvatarPicker(true)} title="Change Photo / Avatar">
            <div style={styles.passportAvatarCircle}>
              {renderAvatarGraphic(72)}
            </div>
            <div style={styles.avatarChangeBadge}>
              <Camera size={13} color="#ffffff" />
            </div>
          </div>

          <div style={styles.passportDetails}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h2 style={styles.passportName}>{name || 'Mayank Pandey'}</h2>
              <button
                type="button"
                onClick={() => setShowAvatarPicker(true)}
                style={styles.chooseAvatarBtn}
              >
                <Sparkles size={13} /> Change Avatar
              </button>
            </div>
            
            <div style={styles.passportRoleRow}>
              <span style={styles.passportRolePill}>{targetRole}</span>
              <span style={styles.passportLevelPill}>{experienceLevel}</span>
            </div>

            {bio && <p style={styles.passportBio}>{bio}</p>}

            <div style={styles.socialLinksRow}>
              {github && (
                <a href={github.startsWith('http') ? github : `https://${github}`} target="_blank" rel="noreferrer" style={styles.socialIconLink} title="GitHub Profile">
                  <Github size={14} />
                </a>
              )}
              {linkedin && (
                <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noreferrer" style={styles.socialIconLink} title="LinkedIn Profile">
                  <Linkedin size={14} />
                </a>
              )}
              {portfolio && (
                <a href={portfolio.startsWith('http') ? portfolio : `https://${portfolio}`} target="_blank" rel="noreferrer" style={styles.socialIconLink} title="Portfolio Website">
                  <Globe size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── AVATAR PICKER MODAL (9 PRESETS + UPLOAD PHOTO + CUSTOM URL) ─── */}
      {showAvatarPicker && (
        <div style={styles.modalOverlay} onClick={() => setShowAvatarPicker(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>Choose Developer Avatar</h3>
                <p style={styles.modalSubtitle}>Pick a preset developer persona or upload your own profile photo.</p>
              </div>
              <button style={styles.closeBtn} onClick={() => setShowAvatarPicker(false)}>
                <X size={18} />
              </button>
            </div>

            {/* 9 Illustrated Preset Avatars Grid */}
            <div style={styles.avatarGrid}>
              {PRESET_AVATARS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setAvatar(item.url);
                    setShowAvatarPicker(false);
                    toast.success(`Selected ${item.label} avatar!`);
                  }}
                  style={{
                    ...styles.avatarOptionCard,
                    ...(avatar === item.url ? styles.avatarOptionCardActive : {})
                  }}
                >
                  <img
                    src={item.url}
                    alt="Avatar option"
                    style={styles.avatarIllustratedImg}
                  />
                  {avatar === item.url && (
                    <div style={styles.checkBadge}>
                      <Check size={11} color="#1f2123" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Custom Photo Upload & URL Section */}
            <div style={styles.customPhotoSection}>
              <div style={styles.uploadRow}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={styles.uploadPhotoBtn}
                >
                  <Upload size={15} /> Upload Photo From Device
                </button>
              </div>

              <form onSubmit={handleApplyCustomUrl} style={styles.urlInputRow}>
                <input
                  type="url"
                  placeholder="Or paste image URL (https://...)"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  style={styles.urlInputField}
                />
                <button type="submit" style={styles.urlSubmitBtn}>
                  Apply URL
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. FORM CONFIGURATION GRID ─── */}
      <form onSubmit={handleSubmit} style={styles.formGrid}>
        {/* Left Column: Personal Information & Online Presence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Personal Information Card */}
          <div style={styles.whiteCard}>
            <div style={styles.cardHeaderRow}>
              <div>
                <h3 style={styles.cardTitle}>Personal Information</h3>
                <p style={styles.cardSubtitle}>
                  Your primary identity used across AI interviews, ATS scoring, and recruiter reports.
                </p>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                style={styles.textInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mayank Pandey"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Target Engineering Position</label>
                <input
                  type="text"
                  style={styles.textInput}
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Experience Level</label>
                <select
                  style={styles.selectInput}
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  {EXPERIENCE_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Professional Bio & Summary</label>
              <textarea
                style={styles.textareaInput}
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of your software engineering background, key accomplishments, and architectural focus..."
              />
            </div>
          </div>

          {/* Online Presence Card */}
          <div style={styles.whiteCard}>
            <div style={styles.cardHeaderRow}>
              <div>
                <h3 style={styles.cardTitle}>Online Presence & Portfolio</h3>
                <p style={styles.cardSubtitle}>
                  Verified profiles connected to your Devora career passport.
                </p>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>GitHub Profile URL</label>
              <div style={styles.inputWithIcon}>
                <Github size={16} color="#71757c" />
                <input
                  type="url"
                  style={styles.bareInput}
                  placeholder="https://github.com/yourhandle"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>LinkedIn Profile URL</label>
              <div style={styles.inputWithIcon}>
                <Linkedin size={16} color="#71757c" />
                <input
                  type="url"
                  style={styles.bareInput}
                  placeholder="https://linkedin.com/in/yourhandle"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Personal Website / Portfolio URL</label>
              <div style={styles.inputWithIcon}>
                <Globe size={16} color="#71757c" />
                <input
                  type="url"
                  style={styles.bareInput}
                  placeholder="https://yourportfolio.dev"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Technical Stack & Save Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Technical Stack Card */}
          <div style={styles.whiteCard}>
            <div style={styles.cardHeaderRow}>
              <div>
                <h3 style={styles.cardTitle}>Primary Technical Stack</h3>
                <p style={styles.cardSubtitle}>
                  Technologies and frameworks used to generate mock interview questions and ATS keyword matches.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                style={styles.textInput}
                placeholder="e.g. TypeScript, Docker, Next.js"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                style={styles.addSkillBtn}
              >
                Add
              </button>
            </div>

            <div style={styles.skillsTagWrap}>
              {skills.map((skill, i) => (
                <span key={i} style={styles.skillPill}>
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    style={styles.removeSkillBtn}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Save Profile Button Card */}
          <div style={styles.whiteCard}>
            <button
              type="submit"
              disabled={saving}
              style={styles.saveBtn}
            >
              {saving ? (
                <span>Saving Profile...</span>
              ) : (
                <>
                  <Save size={16} /> Save Developer Profile
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const styles = {
  profileContainer: {
    width: '100%',
    fontFamily: "'Playpen Sans', cursive, sans-serif",
  },
  heroSection: {
    marginTop: '0.5rem',
    marginBottom: '1.75rem',
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
  passportHeroCard: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '1.75rem 2rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    marginBottom: '1.75rem',
  },
  passportInner: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.75rem',
    flexWrap: 'wrap',
  },
  passportAvatarWrapper: {
    position: 'relative',
    cursor: 'pointer',
  },
  passportAvatarCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: '#f5c842',
    color: '#1f2123',
    fontWeight: 900,
    fontSize: '1.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(245, 200, 66, 0.3)',
    overflow: 'hidden',
  },
  avatarChangeBadge: {
    position: 'absolute',
    bottom: '-2px',
    right: '-2px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#1f2123',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #ffffff',
  },
  passportDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    flex: 1,
  },
  passportName: {
    fontSize: '1.45rem',
    fontWeight: 800,
    color: '#1f2123',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  chooseAvatarBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '3px 10px',
    borderRadius: '16px',
    background: '#f6f5f1',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    color: '#1f2123',
    fontSize: '0.72rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  passportRoleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '2px',
  },
  passportRolePill: {
    padding: '3px 10px',
    borderRadius: '14px',
    background: '#1f2123',
    color: '#ffffff',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  passportLevelPill: {
    padding: '3px 10px',
    borderRadius: '14px',
    background: '#f5c842',
    color: '#1f2123',
    fontSize: '0.75rem',
    fontWeight: 800,
  },
  passportBio: {
    fontSize: '0.85rem',
    color: '#71757c',
    margin: '0.25rem 0 0 0',
    lineHeight: 1.4,
    maxWidth: '750px',
  },
  socialLinksRow: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.4rem',
  },
  socialIconLink: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: '#f6f5f1',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1f2123',
    textDecoration: 'none',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: '1.5rem',
    alignItems: 'flex-start',
  },
  whiteCard: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '1.75rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    border: '1px solid rgba(0, 0, 0, 0.04)',
  },
  cardHeaderRow: {
    marginBottom: '1.25rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: '#1f2123',
    margin: '0 0 0.25rem 0',
    letterSpacing: '-0.01em',
  },
  cardSubtitle: {
    fontSize: '0.82rem',
    color: '#71757c',
    margin: 0,
    lineHeight: 1.4,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    marginBottom: '1rem',
  },
  label: {
    fontSize: '0.78rem',
    fontWeight: 800,
    color: '#5b5e64',
  },
  textInput: {
    padding: '0.65rem 0.9rem',
    borderRadius: '14px',
    border: '1px solid #e4e6ea',
    background: '#fcfcfd',
    color: '#1f2123',
    fontSize: '0.88rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  selectInput: {
    padding: '0.65rem 0.9rem',
    borderRadius: '14px',
    border: '1px solid #e4e6ea',
    background: '#fcfcfd',
    color: '#1f2123',
    fontSize: '0.88rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  textareaInput: {
    padding: '0.65rem 0.9rem',
    borderRadius: '14px',
    border: '1px solid #e4e6ea',
    background: '#fcfcfd',
    color: '#1f2123',
    fontSize: '0.88rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    resize: 'vertical',
  },
  inputWithIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.55rem 0.9rem',
    borderRadius: '14px',
    border: '1px solid #e4e6ea',
    background: '#fcfcfd',
  },
  bareInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    color: '#1f2123',
    fontSize: '0.88rem',
    outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  addSkillBtn: {
    padding: '0.65rem 1.25rem',
    background: '#1f2123',
    color: '#ffffff',
    border: 'none',
    borderRadius: '14px',
    fontWeight: 800,
    fontSize: '0.82rem',
    cursor: 'pointer',
  },
  skillsTagWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.45rem',
  },
  skillPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '5px 12px',
    borderRadius: '20px',
    background: '#f6f5f1',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    color: '#1f2123',
    fontSize: '0.78rem',
    fontWeight: 700,
  },
  removeSkillBtn: {
    background: 'none',
    border: 'none',
    color: '#71757c',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },
  saveBtn: {
    width: '100%',
    padding: '0.85rem 1.5rem',
    background: '#1f2123',
    color: '#ffffff',
    border: 'none',
    borderRadius: '14px',
    fontWeight: 800,
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.65)',
    backdropFilter: 'blur(5px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
  },
  modalContent: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '2rem',
    maxWidth: '560px',
    width: '100%',
    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.25)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#1f2123',
    margin: '0 0 0.25rem 0',
  },
  modalSubtitle: {
    fontSize: '0.82rem',
    color: '#71757c',
    margin: 0,
  },
  closeBtn: {
    background: '#f6f5f1',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#71757c',
    cursor: 'pointer',
  },
  avatarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  avatarOptionCard: {
    padding: '0.65rem',
    background: '#fbfbfa',
    border: '2px solid rgba(0, 0, 0, 0.06)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.15s ease',
  },
  avatarOptionCardActive: {
    borderColor: '#1f2123',
    background: '#ffffff',
    boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
    transform: 'scale(1.03)',
  },
  avatarIllustratedImg: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    objectFit: 'cover',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  checkBadge: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: '#f5c842',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customPhotoSection: {
    borderTop: '1px solid #f0f2f5',
    paddingTop: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  uploadRow: {
    display: 'flex',
    justifyContent: 'center',
  },
  uploadPhotoBtn: {
    width: '100%',
    padding: '0.65rem 1rem',
    background: '#f6f5f1',
    border: '1px dashed #cbd5e1',
    borderRadius: '14px',
    color: '#1f2123',
    fontSize: '0.82rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
  },
  urlInputRow: {
    display: 'flex',
    gap: '0.5rem',
  },
  urlInputField: {
    flex: 1,
    padding: '0.55rem 0.85rem',
    borderRadius: '12px',
    border: '1px solid #e4e6ea',
    background: '#fcfcfd',
    fontSize: '0.82rem',
    outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  urlSubmitBtn: {
    padding: '0.55rem 1rem',
    background: '#1f2123',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 700,
    cursor: 'pointer',
  }
};
