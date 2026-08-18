import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showLogoutModal && !isLoggingOut) {
        setShowLogoutModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLogoutModal, isLoggingOut]);

  const handleOpenLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    if (!isLoggingOut) {
      setShowLogoutModal(false);
    }
  };

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Navigate to homepage first to avoid any protected route redirect flashes
      navigate('/', { replace: true });
      await logout();
      toast.success('Logged out from Devora');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to sign out');
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'D';
  const firstName = user?.name ? user.name.split(' ')[0] : 'Profile';

  return (
    <div style={styles.wrapper}>
      {/* Universal Floating Top Navigation Header across ALL authenticated pages */}
      <header style={styles.globalTopNav}>
        {/* Brand Island */}
        <div style={styles.brandPill} onClick={() => navigate('/dashboard')} title="Devora Dashboard">
          <img src="/logo.png" alt="Devora Logo" style={styles.brandLogo} />
          <span style={styles.brandText}>Devora</span>
        </div>

        {/* Center Navigation Capsule */}
        <nav style={styles.centerNav}>
          <NavLink
            to="/dashboard"
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {})
            })}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/interview"
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {})
            })}
          >
            Interviews
          </NavLink>
          <NavLink
            to="/resume-analyzer"
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {})
            })}
          >
            Resume ATS
          </NavLink>
          <NavLink
            to="/notes"
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {})
            })}
          >
            Notes
          </NavLink>
        </nav>

        {/* Unified Profile Pill + Logout Button */}
        <div style={styles.topRightActions}>
          <button style={styles.userProfilePill} onClick={() => navigate('/profile')} title="View Profile">
            <div style={styles.avatarCircleSmall}>
              {user?.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('data:')) ? (
                <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : user?.avatar ? (
                <span style={{ fontSize: '1rem' }}>{user.avatar}</span>
              ) : (
                <span>{userInitial}</span>
              )}
            </div>
            <span style={styles.profilePillText}>{firstName}</span>
          </button>
          <button onClick={handleOpenLogoutModal} style={styles.pillLogoutBtn} title="Sign Out">
            <LogOut size={15} color="#1f2123" />
          </button>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main style={styles.mainViewport}>
        <Outlet />
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          style={styles.modalOverlay}
          onClick={handleCancelLogout}
        >
          <div
            style={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
          >
            <button
              onClick={handleCancelLogout}
              style={styles.modalCloseBtn}
              title="Cancel"
              disabled={isLoggingOut}
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            <div style={styles.modalIconWrapper}>
              <LogOut size={26} color="#ef4444" style={{ transform: 'translateX(2px)' }} />
            </div>

            <h3 id="logout-dialog-title" style={styles.modalTitle}>
              Log out of Devora?
            </h3>

            <p style={styles.modalDescription}>
              Are you sure you want to end your current session? You can sign back in anytime to continue your AI mock interviews and ATS resume reviews.
            </p>

            <div style={styles.modalActions}>
              <button
                type="button"
                onClick={handleCancelLogout}
                style={styles.cancelBtn}
                disabled={isLoggingOut}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmLogout}
                style={styles.confirmLogoutBtn}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Signing Out...' : 'Yes, Log Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(145deg, #eef0f3 0%, #f6f5f1 35%, #faf6e9 70%, #fef3cf 100%)',
    color: '#1a1c1e',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  globalTopNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 2rem 0.5rem 2rem',
    background: 'transparent',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  brandPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.65rem',
    padding: '0.45rem 1.15rem',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(0, 0, 0, 0.07)',
    borderRadius: '30px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.2s ease',
  },
  brandLogo: {
    width: '30px',
    height: '30px',
    objectFit: 'contain',
    display: 'block',
    flexShrink: 0,
  },
  brandText: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#1f2123',
    letterSpacing: '-0.02em',
    fontFamily: "'Space Grotesk', sans-serif",
    lineHeight: 1,
  },
  centerNav: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(0, 0, 0, 0.07)',
    borderRadius: '40px',
    padding: '4px 6px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
  },
  navItem: {
    padding: '0.5rem 1.25rem',
    borderRadius: '30px',
    fontSize: '0.86rem',
    fontWeight: 700,
    color: '#5b5e64',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
  },
  navItemActive: {
    background: '#1f2123',
    color: '#ffffff',
    fontWeight: 700,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
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
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(0, 0, 0, 0.07)',
    borderRadius: '30px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
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
    overflow: 'hidden',
  },
  profilePillText: {
    fontSize: '0.86rem',
    fontWeight: 700,
    color: '#1f2123',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  pillLogoutBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(0, 0, 0, 0.07)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.15s ease',
  },
  mainViewport: {
    flex: 1,
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0.75rem 2rem 4rem 2rem',
    boxSizing: 'border-box',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    background: 'rgba(11, 15, 25, 0.65)',
    backdropFilter: 'blur(14px) saturate(160%)',
    WebkitBackdropFilter: 'blur(14px) saturate(160%)',
  },
  modalCard: {
    position: 'relative',
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(255, 255, 255, 0.94)',
    backdropFilter: 'blur(24px) saturate(190%)',
    WebkitBackdropFilter: 'blur(24px) saturate(190%)',
    borderRadius: '24px',
    padding: '2.25rem 2rem 2rem',
    boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.38), 0 0 0 1px rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  modalCloseBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#f3f4f6',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#6b7280',
    transition: 'all 0.15s ease',
  },
  modalIconWrapper: {
    width: '58px',
    height: '58px',
    borderRadius: '50%',
    background: '#fef2f2',
    border: '1.5px solid #fee2e2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.25rem auto',
    boxShadow: '0 8px 20px rgba(239, 68, 68, 0.15)',
  },
  modalTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '1.45rem',
    fontWeight: 800,
    color: '#1f2123',
    margin: '0 0 0.6rem 0',
    letterSpacing: '-0.02em',
  },
  modalDescription: {
    fontSize: '0.9rem',
    color: '#64748b',
    lineHeight: 1.55,
    margin: '0 0 1.75rem 0',
  },
  modalActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  cancelBtn: {
    flex: 1,
    padding: '0.75rem 1rem',
    borderRadius: '13px',
    background: '#f1f5f9',
    color: '#475569',
    fontWeight: 700,
    fontSize: '0.92rem',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: 'all 0.15s ease',
  },
  confirmLogoutBtn: {
    flex: 1.2,
    padding: '0.75rem 1.2rem',
    borderRadius: '13px',
    background: '#dc2626',
    color: '#ffffff',
    fontWeight: 800,
    fontSize: '0.92rem',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxShadow: '0 4px 14px rgba(220, 38, 38, 0.28)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
  },
};