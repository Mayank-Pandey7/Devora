import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import HomePage        from './pages/HomePage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import Dashboard       from './pages/Dashboard';
import InterviewPrep   from './pages/InterviewPrep';
import ResumeAnalyzer  from './pages/ResumeAnalyzer';
import Profile         from './pages/Profile';
import Layout          from './components/Layout/Layout';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#090d16', color: '#fff' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Loading Devora...</span>
        </div>
      </div>
    );
  }
  return user ? <Layout /> : <Navigate to="/" replace />;
};

function AppRoutes() {
  const { user } = useAuth();
  const location = useLocation();

  // Modal routes overlay on top of HomePage for unauthenticated users
  const isAuthModal = location.pathname === '/login' || location.pathname === '/register';

  if (user) {
    return (
      <Routes>
        <Route element={<ProtectedLayout />}>
          <Route path="dashboard"        element={<Dashboard />} />
          <Route path="interview"        element={<InterviewPrep />} />
          <Route path="resume-analyzer"  element={<ResumeAnalyzer />} />
          <Route path="profile"          element={<Profile />} />
          
          {/* Legacy route redirects */}
          <Route path="generator"        element={<Navigate to="/interview" replace />} />
          <Route path="analyzer"         element={<Navigate to="/resume-analyzer" replace />} />
          <Route path="trending"         element={<Navigate to="/dashboard" replace />} />
          <Route path="scheduler"        element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <HomePage />

      {isAuthModal && (
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #1e293b',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }
            }}
          />
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}