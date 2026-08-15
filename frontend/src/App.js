import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ClerkAuthProviderWrapper, ClerkSSOCallback } from './components/auth/ClerkAuthProvider';
import DevoraLoader    from './components/common/DevoraLoader';
import HomePage        from './pages/HomePage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import Dashboard       from './pages/Dashboard';
import InterviewPrep   from './pages/InterviewPrep';
import ResumeAnalyzer  from './pages/ResumeAnalyzer';
import Profile         from './pages/Profile';
import Layout          from './components/Layout/Layout';

import ErrorBoundary   from './components/common/ErrorBoundary';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <DevoraLoader message="Loading Devora..." />;
  }

  return user ? <Layout /> : <Navigate to="/login" replace />;
};

function AppRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const isAuthModal = location.pathname === '/login' || location.pathname === '/register';

  if (loading) {
    return <DevoraLoader message="Loading Devora..." />;
  }

  // If user is authenticated and tries to access /login or /register, redirect straight to /dashboard
  if (user && isAuthModal) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Routes>
      {/* Clerk SSO Callback Route */}
      <Route path="/sso-callback" element={<ClerkSSOCallback />} />

      {/* Authenticated Dashboard & Workspace Routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard"        element={<Dashboard />} />
        <Route path="/interview"        element={<InterviewPrep />} />
        <Route path="/resume-analyzer"  element={<ResumeAnalyzer />} />
        <Route path="/profile"          element={<Profile />} />

        {/* Legacy route redirects */}
        <Route path="/generator"        element={<Navigate to="/interview" replace />} />
        <Route path="/analyzer"         element={<Navigate to="/resume-analyzer" replace />} />
        <Route path="/trending"         element={<Navigate to="/dashboard" replace />} />
        <Route path="/scheduler"        element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Public Landing & Modal Overlay Routes */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <>
              <HomePage />
              {isAuthModal && location.pathname === '/login' && <LoginPage />}
              {isAuthModal && location.pathname === '/register' && <RegisterPage />}
            </>
          )
        }
      />
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <>
              <HomePage />
              <LoginPage />
            </>
          )
        }
      />
      <Route
        path="/register"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <>
              <HomePage />
              <RegisterPage />
            </>
          )
        }
      />

      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ClerkAuthProviderWrapper>
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
      </ClerkAuthProviderWrapper>
    </ErrorBoundary>
  );
}