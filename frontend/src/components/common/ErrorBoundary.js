import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Devora Runtime Catch:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#090d16', color: '#f8fafc', padding: '2rem', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <img src="/logo.png" alt="Devora" style={{ width: '48px', height: '48px', marginBottom: '1.5rem', objectFit: 'contain' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', fontFamily: "'Space Grotesk', sans-serif" }}>Something went wrong loading this view</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '420px', marginBottom: '1.75rem', lineHeight: 1.5 }}>
            {this.state.error?.message || 'An unexpected error occurred while rendering.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = '/';
            }}
            style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '14px',
              background: '#f5c842',
              color: '#090d16',
              border: 'none',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Return to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
