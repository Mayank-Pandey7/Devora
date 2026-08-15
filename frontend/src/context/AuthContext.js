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
  const [user, setUser]       = useState(null);
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
          if (isMounted) {
            setUser(res.data.user);
            setLoading(false);
          }
          return;
        } catch (e) {
          localStorage.removeItem('token');
        }
      }

      // 2. If Clerk is loaded and signed in (e.g. via Google OAuth)
      if (isClerkLoaded && isSignedIn && clerkUser) {
        const email = clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress;
        if (email) {
          try {
            const res = await API.post('/auth/clerk', {
              clerkUserId: clerkUser.id,
              email,
              name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || email.split('@')[0],
              avatar: clerkUser.imageUrl,
            });
            if (isMounted) {
              localStorage.setItem('token', res.data.token);
              setUser(res.data.user);
              setLoading(false);
            }
            return;
          } catch (err) {
            console.error('Failed to sync Clerk user with Devora backend:', err);
          }
        }
      }

      // 3. If Clerk is still initializing, wait before marking loading false
      const hasClerkKey = Boolean(process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
      if (hasClerkKey && !isClerkLoaded) {
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
  }, [isClerkLoaded, isSignedIn, clerkUser, user]);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const googleLogin = async (payload) => {
    const res = await API.post('/auth/google', payload);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const clerkLogin = async (clerkUserData) => {
    const res = await API.post('/auth/clerk', clerkUserData);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const sendOtp = async (email) => {
    const res = await API.post('/auth/send-otp', { email });
    return res.data;
  };

  const verifyOtp = async (email, otp) => {
    const res = await API.post('/auth/verify-otp', { email, otp });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password, targetRole = 'Full Stack Developer') => {
    const res = await API.post('/auth/register', { name, email, password, targetRole });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    if (clerk && typeof clerk.signOut === 'function') {
      try {
        clerk.signOut();
      } catch (e) {}
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