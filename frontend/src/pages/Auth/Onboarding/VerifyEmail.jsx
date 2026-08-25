import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import LogoLight from "../../../assets/images/Logo_Light.png";
import { apiRequest } from "../../../services/api";
import { loginSuccess } from "../../../store/slices/authSlice";
import { getPostAuthPath } from "../utils/authNavigation";
import styles from "./AuthFlow.module.css";

export default function VerifyEmail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verify = async () => {
    if (!token) {
      setError("Verification token is missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiRequest("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token }),
      });

      const user = response?.data?.user;
      const profile = response?.data?.profile;
      if (!user) throw new Error("Unable to verify this email");

      dispatch(
        loginSuccess({
          token: response?.meta?.token || null,
          user,
          profile,
        }),
      );
      navigate(getPostAuthPath(user, profile), { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Unable to verify this email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <img src={LogoLight} alt="Nefru" className={styles.logo} />
        <p className={styles.eyebrow}>Email verification</p>
        <h1 className={styles.title}>Finish creating your Nefru account</h1>
        <p className={styles.text}>
          Confirm this verification link, then we’ll sign you in securely and
          continue your onboarding.
        </p>

        {error && <p className={styles.error}>{error}</p>}

        {error && (
          <p className={styles.recoveryHint}>
            If the link expired, go back to login, enter your details, and use
            <strong> Resend verification email</strong>.
          </p>
        )}

        <button
          className={styles.primary}
          type="button"
          onClick={verify}
          disabled={loading || !token}
        >
          {loading ? "Verifying…" : "Verify my email"}
        </button>
        <button
          className={styles.secondary}
          type="button"
          onClick={() => navigate("/auth/login")}
        >
          Back to login
        </button>
      </section>
    </main>
  );
}
