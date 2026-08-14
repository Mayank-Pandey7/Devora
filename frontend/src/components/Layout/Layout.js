import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out from Devora');
    navigate('/');
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'M';
  const firstName = user?.name ? user.name.split(' ')[0] : 'Profile';

  return (
    <div style={styles.wrapper}>
      {/* Universal Floating Top Navigation Header across ALL pages */}
      <header style={styles.globalTopNav}>
        <div style={styles.brandPill} onClick={() => navigate('/dashboard')}>
          <img src="/logo.png" alt="Devora" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
          <span style={styles.brandText}>Devora</span>
        </div>

        {/* Center Navigation */}
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
            <LogOut size={14} color="#1f2123" />
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
    fontFamily: "'Playpen Sans', cursive, sans-serif",
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
    padding: '0.5rem 1.4rem',
    background: 'rgba(255, 255, 255, 0.75)',
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
  navItem: {
    padding: '0.5rem 1.25rem',
    borderRadius: '30px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#4b4e54',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
  },
  navItemActive: {
    background: '#1f2123',
    color: '#ffffff',
    fontWeight: 700,
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
  mainViewport: {
    flex: 1,
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0.75rem 2rem 4rem 2rem',
    boxSizing: 'border-box',
  },
};