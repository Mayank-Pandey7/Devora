import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out from Devora');
    navigate('/', { replace: true });
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
          <button onClick={handleLogout} style={styles.pillLogoutBtn} title="Sign Out">
            <LogOut size={15} color="#1f2123" />
          </button>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main style={styles.mainViewport}>
        <Outlet />
      </main>
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
};