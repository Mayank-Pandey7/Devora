import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignIn, useUser } from "@clerk/clerk-react";
import { useAuth } from "../context/AuthContext";
import DevoraLoader from "../components/common/DevoraLoader";
import "./AuthPages.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if ((isLoaded && isSignedIn) || user) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  if ((isLoaded && isSignedIn) || user) {
    return <DevoraLoader message="Entering your Devora workspace..." />;
  }

  return (
    <div className="auth-page-root" onClick={() => navigate("/")}>
      {/* Single Unified Clerk Sign-In Card */}
      <div
        className="auth-single-card-wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        <SignIn
          routing="hash"
          forceRedirectUrl="/dashboard"
          fallbackRedirectUrl="/dashboard"
          signUpForceRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
          signUpUrl="/register"
          appearance={{
            layout: {
              socialButtonsPlacement: "top",
              showOptionalFields: false,
            },
            variables: {
              colorPrimary: "#1f2123",
              colorText: "#1f2123",
              colorBackground: "#ffffff",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              borderRadius: "14px",
            },
            elements: {
              rootBox: {
                width: "100%",
                maxWidth: "440px",
              },
              cardBox: {
                borderRadius: "26px",
                overflow: "hidden",
                boxShadow: "0 30px 80px -15px rgba(0, 0, 0, 0.35)",
                background: "#ffffff",
              },
              card: {
                borderRadius: "0",
                border: "none",
                boxShadow: "none",
                width: "100%",
                background: "transparent",
              },
              main: {
                background: "transparent",
              },
              headerTitle: {
                fontFamily: "'Libre Caslon Text', Georgia, serif",
                fontSize: "1.85rem",
                fontWeight: 700,
                color: "#1f2123",
              },
              headerSubtitle: {
                color: "#71757c",
                fontSize: "0.9rem",
              },
              socialButtonsBlockButton: {
                height: "48px",
                borderRadius: "14px",
                borderColor: "#e2e4e9",
                fontWeight: 700,
                fontSize: "0.92rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                "&:hover": {
                  backgroundColor: "#fafaf9",
                  borderColor: "#cbd0d8",
                  transform: "translateY(-1px)",
                },
              },
              formButtonPrimary: {
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#1f2123",
                fontSize: "0.95rem",
                fontWeight: 800,
                "&:hover": {
                  backgroundColor: "#000000",
                  transform: "translateY(-1px)",
                },
              },
              formFieldInput: {
                height: "46px",
                borderRadius: "14px",
                borderColor: "#e4e6ea",
                backgroundColor: "#fafaf9",
                fontSize: "0.94rem",
                "&:focus": {
                  borderColor: "#1f2123",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 0 0 3px rgba(31, 33, 35, 0.08)",
                },
              },
              footer: {
                background: "#fafaf9",
                borderTop: "1px solid #f0eee8",
                margin: "0",
                borderBottomLeftRadius: "26px",
                borderBottomRightRadius: "26px",
              },
              footerAction: {
                color: "#71757c",
                fontSize: "0.88rem",
              },
              footerActionLink: {
                color: "#1f2123",
                fontWeight: 800,
                "&:hover": {
                  textDecoration: "underline",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}