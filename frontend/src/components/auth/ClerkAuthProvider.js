import React, { useEffect } from 'react';
import { ClerkProvider, AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DevoraLoader from '../common/DevoraLoader';

// Fallback to provided project key so Vercel deployment never renders without ClerkProvider
const CLERK_PUBLISHABLE_KEY =
  process.env.REACT_APP_CLERK_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  'pk_test_dGlkeS1yYXZlbi02Ny5jbGVyay5hY2NvdW50cy5kZXYk';

export function ClerkSSOCallback() {
  const navigate = useNavigate();
  const { user: devoraUser } = useAuth();

  useEffect(() => {
    if (devoraUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [devoraUser, navigate]);

  return (
    <>
      <AuthenticateWithRedirectCallback
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/dashboard"
        redirectUrl="/dashboard"
      />
      <DevoraLoader message="Signing into your Devora dashboard..." />
    </>
  );
}

export function ClerkAuthProviderWrapper({ children }) {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
}
