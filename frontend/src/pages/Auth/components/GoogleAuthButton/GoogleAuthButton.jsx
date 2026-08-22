import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { apiRequest } from "../../../../services/api";
import { loginSuccess } from "../../../../store/slices/authSlice";
import { getPostAuthPath } from "../../utils/authNavigation";
import styles from "./GoogleAuthButton.module.css";

const GOOGLE_SCRIPT_ID = "google-identity-services";

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve(window.google);
      return;
    }

    const existing = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google), {
        once: true,
      });
      existing.addEventListener(
        "error",
        () => reject(new Error("Unable to load Google sign-in")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error("Unable to load Google sign-in"));
    document.head.appendChild(script);
  });
}

export default function GoogleAuthButton({
  role,
  rememberMe = false,
  onError,
  onCredential,
  text = "continue_with",
  loadingLabel = "Signing in…",
}) {
  const buttonRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const busyRef = useRef(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    let cancelled = false;

    if (!clientId || !buttonRef.current) return undefined;

    loadGoogleScript()
      .then((google) => {
        if (cancelled || !buttonRef.current) return;

        buttonRef.current.innerHTML = "";
        google.accounts.id.initialize({
          client_id: clientId,
          ux_mode: "popup",
          callback: async ({ credential }) => {
            if (!credential || busyRef.current) return;

            busyRef.current = true;
            setLoading(true);
            onError?.("");

            try {
              if (onCredential) {
                await onCredential(credential);
                return;
              }

              const response = await apiRequest("/auth/google", {
                method: "POST",
                body: JSON.stringify({
                  credential,
                  ...(role ? { role } : {}),
                  rememberMe,
                }),
              });

              if (response?.data?.requiresOnboarding) {
                sessionStorage.setItem(
                  "nefru_google_onboarding",
                  JSON.stringify({
                    onboardingToken: response.data.onboardingToken,
                    googleProfile: response.data.googleProfile,
                    rememberMe,
                  }),
                );
                navigate("/auth/choose-role");
                return;
              }

              if (response?.data?.requiresAccountLink) {
                sessionStorage.setItem(
                  "nefru_google_link",
                  JSON.stringify({
                    linkingToken: response.data.linkingToken,
                    email: response.data.email,
                    existingRole: response.data.existingRole,
                    googleRole: response.data.googleRole,
                    rememberMe,
                  }),
                );
                navigate("/auth/link-google");
                return;
              }

              const user = response?.data?.user;
              const profile = response?.data?.profile;

              if (!user) throw new Error("Google sign-in returned an invalid response");

              dispatch(
                loginSuccess({
                  token: response?.meta?.token || null,
                  user,
                  profile,
                }),
              );
              navigate(getPostAuthPath(user, profile), { replace: true });
            } catch (error) {
              onError?.(error.message || "Google sign-in failed. Please try again.");
            } finally {
              busyRef.current = false;
              setLoading(false);
            }
          },
        });

        google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text,
          shape: "rectangular",
          logo_alignment: "left",
          width: Math.min(360, buttonRef.current.clientWidth || 360),
        });
      })
      .catch((error) => onError?.(error.message));

    return () => {
      cancelled = true;
    };
  }, [
    clientId,
    dispatch,
    navigate,
    onCredential,
    onError,
    rememberMe,
    role,
    text,
  ]);

  if (!clientId) {
    return (
      <div className={styles.notConfigured} role="status">
        Add <code>VITE_GOOGLE_CLIENT_ID</code> to enable Google sign-in.
      </div>
    );
  }

  return (
    <div className={styles.wrapper} aria-busy={loading}>
      <div ref={buttonRef} className={styles.googleButton} />
      {loading && <span className={styles.loadingText}>{loadingLabel}</span>}
    </div>
  );
}
