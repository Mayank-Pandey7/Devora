import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUser, useClerk } from '@clerk/clerk-react';

const AuthContext = createContext();
const rawApiUrl = process.env.REACT_APP_API_URL;
const API_BASE = rawApiUrl
  ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/+$/, '')}/api`)
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:5000/api'
      : '/api');
const API = axios.create({ baseURL: API_BASE });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('devora_user');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Clerk hook integration
  let clerkUser = null;
  let isClerkLoaded = true;
  let isSignedIn = false;
  let clerk = null;

  try {
    const clerkUserObj = useUser();
    clerkUser = clerkUserObj?.user;
    isClerkLoaded = clerkUserObj?.isLoaded ?? true;
    isSignedIn = clerkUserObj?.isSignedIn ?? false;
    clerk = useClerk();
  } catch (e) {
    // Fallback if rendered outside ClerkProvider
  }

  // Unified authentication state synchronizer
  useEffect(() => {
    let isMounted = true;

    async function syncAuth() {
      const token = localStorage.getItem('token');

      // 1. If we have a local JWT token and no active user yet
      if (token && !user) {
        try {
          const res = await API.get('/auth/me');
          if (isMounted && res.data?.user) {
            localStorage.setItem('devora_user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            setLoading(false);
            return;
          }
        } catch (e) {
          localStorage.removeItem('token');
          localStorage.removeItem('devora_user');
        }
      }

      // 2. If Clerk is loaded and signed in
      if (isClerkLoaded && isSignedIn && clerkUser) {
        const email = clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress;
        if (email) {
          const cachedUserStr = localStorage.getItem('devora_user');
          let cached = null;
          try {
            if (cachedUserStr) cached = JSON.parse(cachedUserStr);
          } catch (e) {}

          const optimisticUser = {
            _id: cached?._id || clerkUser.id,
            id: cached?.id || clerkUser.id,
            clerkUserId: clerkUser.id,
            name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || email.split('@')[0],
            email,
            avatar: clerkUser.imageUrl || cached?.avatar,
            targetRole: cached?.targetRole || 'Full Stack Developer',
            experienceLevel: cached?.experienceLevel || 'Mid-Level',
            skills: cached?.skills || [],
            careerScore: cached?.careerScore || 0,
            interviewScore: cached?.interviewScore || 0,
            resumeScore: cached?.resumeScore || 0,
          };

          if (isMounted) {
            localStorage.setItem('devora_user', JSON.stringify(optimisticUser));
            setUser((prev) => (prev && prev.clerkUserId === clerkUser.id ? prev : optimisticUser));
            setLoading(false);
          }

          // In parallel, persist and sync with MongoDB backend
          try {
            const res = await API.post('/auth/clerk', {
              clerkUserId: clerkUser.id,
              email,
              name: optimisticUser.name,
              avatar: clerkUser.imageUrl,
            });
            if (isMounted && res.data?.token) {
              localStorage.setItem('token', res.data.token);
              if (res.data.user) {
                localStorage.setItem('devora_user', JSON.stringify(res.data.user));
                setUser(res.data.user);
              }
            }
          } catch (err) {
            console.warn('Backend Clerk sync notice (continuing on active session):', err.message);
          }
          return;
        }
      }

      // 3. If neither token nor Clerk is signed in, clear any stale cached session
      if (!token && isClerkLoaded && !isSignedIn) {
        localStorage.removeItem('token');
        localStorage.removeItem('devora_user');
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      // 4. If Clerk is still initializing, keep loading true
      if (!isClerkLoaded) {
        return;
      }

      if (isMounted) {
        setLoading(false);
      }
    }

    syncAuth();

    return () => {
      isMounted = false;
    };
  }, [isClerkLoaded, isSignedIn, clerkUser?.id]);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('devora_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const googleLogin = async (payload) => {
    const res = await API.post('/auth/google', payload);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('devora_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const clerkLogin = async (clerkUserData) => {
    const res = await API.post('/auth/clerk', clerkUserData);
    localStorage.setItem('token', res.data.token);
    if (res.data.user) {
      localStorage.setItem('devora_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    }
    return res.data;
  };

  const sendOtp = async (email) => {
    const res = await API.post('/auth/send-otp', { email });
    return res.data;
  };

  const verifyOtp = async (email, otp) => {
    const res = await API.post('/auth/verify-otp', { email, otp });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('devora_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password, targetRole = 'Full Stack Developer') => {
    const res = await API.post('/auth/register', { name, email, password, targetRole });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('devora_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('devora_user');
    setUser(null);
    setLoading(false);
    if (clerk && typeof clerk.signOut === 'function') {
      try {
        await clerk.signOut({ redirectUrl: '/' });
      } catch (e) {
        console.warn('Clerk sign out notice:', e.message);
      }
    }
  };

  const updateProfile = async (data) => {
    const res = await API.put('/auth/update', data);
    setUser(res.data.user);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        googleLogin,
        clerkLogin,
        sendOtp,
        verifyOtp,
        register,
        logout,
        updateProfile,
        API,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { API };