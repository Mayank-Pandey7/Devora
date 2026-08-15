import React, { useEffect } from 'react';
import { ClerkProvider, AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DevoraLoader from '../common/DevoraLoader';

const CLERK_PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

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
  if (!CLERK_PUBLISHABLE_KEY) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
}
