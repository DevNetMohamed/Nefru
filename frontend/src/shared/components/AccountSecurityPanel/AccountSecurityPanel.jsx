import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiCheckCircle, FiLink, FiLock, FiShield } from "react-icons/fi";

import GoogleAuthButton from "../../../pages/Auth/components/GoogleAuthButton/GoogleAuthButton";
import { apiRequest } from "../../../services/api";
import { updateProfile } from "../../../store/slices/authSlice";
import styles from "./AccountSecurityPanel.module.css";

const EMPTY_PASSWORDS = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export default function AccountSecurityPanel({ showHeading = true }) {
  const dispatch = useDispatch();
  const { user, profile } = useSelector((state) => state.auth);
  const [passwords, setPasswords] = useState(EMPTY_PASSWORDS);
  const [savingPassword, setSavingPassword] = useState(false);
  const [providerBusy, setProviderBusy] = useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [providerError, setProviderError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const providers = user?.authProviders || [];
  const hasPassword =
    user?.hasPassword ?? providers.includes("local");
  const googleLinked =
    user?.googleLinked ?? providers.includes("google");

  const syncAuth = useCallback(
    (response) => {
      if (!response?.data?.user) return;
      dispatch(
        updateProfile({
          user: response.data.user,
          profile: response.data.profile ?? profile,
        }),
      );
    },
    [dispatch, profile],
  );

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswords((current) => ({ ...current, [name]: value }));
    setPasswordError("");
    setSuccessMessage("");
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordError("");
    setSuccessMessage("");

    if (hasPassword && !passwords.currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }
    if (passwords.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      const response = await apiRequest("/auth/change-password", {
        method: "PATCH",
        body: JSON.stringify(passwords),
      });
      syncAuth(response);
      setPasswords(EMPTY_PASSWORDS);
      setSuccessMessage(response.message || "Password updated successfully.");
    } catch (error) {
      setPasswordError(error.message || "Unable to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleGoogleCredential = useCallback(
    async (credential) => {
      setProviderBusy(true);
      setProviderError("");
      setSuccessMessage("");
      try {
        const response = await apiRequest("/auth/google/connect", {
          method: "POST",
          body: JSON.stringify({ credential }),
        });
        syncAuth(response);
        setSuccessMessage(response.message || "Google connected successfully.");
      } catch (error) {
        setProviderError(error.message || "Unable to connect Google.");
        throw error;
      } finally {
        setProviderBusy(false);
      }
    },
    [syncAuth],
  );

  const handleDisconnectGoogle = async () => {
    if (!confirmDisconnect) {
      setConfirmDisconnect(true);
      return;
    }

    setProviderBusy(true);
    setProviderError("");
    setSuccessMessage("");
    try {
      const response = await apiRequest("/auth/google/connect", {
        method: "DELETE",
      });
      syncAuth(response);
      setConfirmDisconnect(false);
      setSuccessMessage(response.message || "Google disconnected successfully.");
    } catch (error) {
      setProviderError(error.message || "Unable to disconnect Google.");
    } finally {
      setProviderBusy(false);
    }
  };

  return (
    <section className={styles.section} aria-labelledby="account-security-title">
      {showHeading && (
        <header className={styles.heading}>
          <span><FiShield /></span>
          <div>
            <h2 id="account-security-title">Sign-in &amp; security</h2>
            <p>Manage your password and connect one Google identity to this account.</p>
          </div>
        </header>
      )}

      {successMessage && (
        <p className={styles.successMessage} role="status">
          <FiCheckCircle /> {successMessage}
        </p>
      )}

      <div className={styles.grid}>
        <form className={styles.card} onSubmit={handlePasswordSubmit}>
          <div className={styles.cardTitle}>
            <FiLock />
            <div>
              <h3>{hasPassword ? "Change password" : "Create a password"}</h3>
              <p>
                {hasPassword
                  ? "Changing it signs out your other sessions."
                  : "Add a password so Google is not your only sign-in method."}
              </p>
            </div>
          </div>

          {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}

          <div className={styles.fields}>
            {hasPassword && (
              <label>
                <span>Current password</span>
                <input
                  name="currentPassword"
                  type="password"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                />
              </label>
            )}
            <label>
              <span>New password</span>
              <input
                name="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                autoComplete="new-password"
              />
            </label>
            <label>
              <span>Confirm new password</span>
              <input
                name="confirmNewPassword"
                type="password"
                value={passwords.confirmNewPassword}
                onChange={handlePasswordChange}
                autoComplete="new-password"
              />
            </label>
          </div>

          <button type="submit" className={styles.primaryButton} disabled={savingPassword}>
            {savingPassword
              ? "Saving…"
              : hasPassword
                ? "Update password"
                : "Create password"}
          </button>
        </form>

        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <FiLink />
            <div>
              <h3>Google account</h3>
              <p>
                {googleLinked
                  ? "Google sign-in is connected to this Nefru account."
                  : "Connect Google to prevent duplicate accounts and sign in faster."}
              </p>
            </div>
          </div>

          <div className={styles.providerStatus} data-linked={googleLinked || undefined}>
            <span>Google</span>
            <strong>{googleLinked ? "Connected" : "Not connected"}</strong>
          </div>

          {providerError && <p className={styles.errorMessage}>{providerError}</p>}

          {googleLinked ? (
            <>
              <button
                type="button"
                className={confirmDisconnect ? styles.dangerButton : styles.secondaryButton}
                onClick={handleDisconnectGoogle}
                disabled={providerBusy || !hasPassword}
              >
                {providerBusy
                  ? "Disconnecting…"
                  : confirmDisconnect
                    ? "Confirm disconnect"
                    : "Disconnect Google"}
              </button>
              {!hasPassword && (
                <p className={styles.hint}>Create a password before disconnecting Google.</p>
              )}
              {confirmDisconnect && (
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setConfirmDisconnect(false)}
                >
                  Keep Google connected
                </button>
              )}
            </>
          ) : (
            <div className={styles.googleButtonWrap} aria-busy={providerBusy}>
              <GoogleAuthButton
                onCredential={handleGoogleCredential}
                onError={setProviderError}
                loadingLabel="Connecting Google…"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
