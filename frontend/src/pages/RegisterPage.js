import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, X, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import "./AuthPages.css";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (clientId) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCallback,
          });
        }
      };
      document.body.appendChild(script);
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  const handleGoogleCallback = async (response) => {
    setLoading(true);
    try {
      await googleLogin({ credential: response.credential });
      toast.success("Account created via Google! Welcome 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Google Sign-Up failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (clientId && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      const userEmail = prompt("Enter your Google Account email for Instant Google Registration:", form.email || "creator@gmail.com");
      if (!userEmail) return;
      setLoading(true);
      try {
        await googleLogin({
          googleUser: {
            email: userEmail,
            name: form.name || userEmail.split("@")[0].replace(".", " "),
            avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
          },
        });
        toast.success("Account created via Google! Welcome 🎉");
        navigate("/dashboard");
      } catch (err) {
        toast.error(err.response?.data?.message || "Google Sign-Up failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      return toast.error("Please fill in all fields");
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, "Full Stack Developer");
      toast.success("Account created! Welcome to Devora 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Pure CSS backdrop — real HomePage stays mounted in the router behind us */}
      <div className="auth-landing-bg" />

      {/* Modal Overlay Layer */}
      <div className="auth-modal-overlay">
        <div className="auth-card-container fade-in">
          {/* Close Button to return to Home Page */}
          <button
            className="auth-close-btn"
            title="Back to Home Page"
            onClick={() => navigate("/")}
          >
            <X size={16} />
          </button>

          {/* Card Header */}
          <div className="auth-card-header">
            <div className="auth-brand-row">
              <img src="/logo.png" alt="Devora" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              <span className="auth-brand-title">Devora</span>
            </div>
          </div>

          {/* Title Section */}
          <div className="auth-title-section">
            <h2 className="auth-title">Create your Devora account</h2>
            <p className="auth-subtitle">Build better. Interview smarter. Get hired.</p>
          </div>

          {/* Google Button */}
          <button className="auth-google-btn" type="button" disabled={loading} onClick={handleGoogleClick}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            {loading ? "Connecting..." : "Sign up with Google"}
          </button>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">OR REGISTER WITH EMAIL</span>
            <div className="auth-divider-line" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label className="auth-label">Full Name</label>
              <div className="auth-input-wrapper">
                <User size={18} className="auth-input-icon" />
                <input
                  className="auth-input-field"
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  className="auth-input-field"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  className="auth-input-field"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : <>Create Free Account <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{" "}
            <Link to="/login" className="auth-footer-link">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}