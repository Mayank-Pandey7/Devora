import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_BASE = process.env.REACT_APP_API_URL || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000/api' : '/api');
const API = axios.create({ baseURL: API_BASE });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.get('/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

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
  };

  const updateProfile = async (data) => {
    const res = await API.put('/auth/update', data);
    setUser(res.data.user);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, googleLogin, sendOtp, verifyOtp, register, logout, updateProfile, API }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { API };