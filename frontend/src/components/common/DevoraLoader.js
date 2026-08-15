import React from 'react';

export default function DevoraLoader({ message = 'Loading Devora...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        background: '#090d16',
        backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(245, 200, 66, 0.09) 0%, rgba(9, 13, 22, 1) 75%)',
        color: '#f8fafc',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
      }}
    >
      {/* Devora Logo with Breathing Glow */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.75rem' }}>
        {/* Ambient Glow Aura */}
        <div
          style={{
            position: 'absolute',
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 200, 66, 0.35) 0%, rgba(245, 200, 66, 0) 70%)',
            animation: 'devoraGlowAura 2s ease-in-out infinite alternate',
          }}
        />

        {/* Logo */}
        <img
          src="/logo.png"
          alt="Devora"
          style={{
            width: '56px',
            height: '56px',
            objectFit: 'contain',
            position: 'relative',
            zIndex: 2,
            filter: 'drop-shadow(0 8px 24px rgba(245, 200, 66, 0.25))',
            animation: 'devoraLogoPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate',
          }}
        />
      </div>

      {/* Brand & Loading Status */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '0.12em',
            color: '#ffffff',
          }}
        >
          DEVORA
        </span>
        <span
          style={{
            fontSize: '0.86rem',
            fontWeight: 600,
            color: '#94a3b8',
            letterSpacing: '0.01em',
          }}
        >
          {message}
        </span>
      </div>

      {/* Sleek Line Progress Bar */}
      <div
        style={{
          width: '130px',
          height: '3px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '999px',
          marginTop: '1.5rem',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '45%',
            background: 'linear-gradient(90deg, #f5c842, #e5a820)',
            borderRadius: '999px',
            animation: 'devoraProgressSlide 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          }}
        />
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes devoraLogoPulse {
          0% {
            transform: scale(0.95);
            opacity: 0.88;
          }
          100% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
        @keyframes devoraGlowAura {
          0% {
            transform: scale(0.85);
            opacity: 0.4;
          }
          100% {
            transform: scale(1.35);
            opacity: 0.9;
          }
        }
        @keyframes devoraProgressSlide {
          0% {
            left: -45%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
}
