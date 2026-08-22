import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import LogoLight from "../../../assets/images/Logo_Light.png";
import { apiRequest } from "../../../services/api";
import { loginSuccess } from "../../../store/slices/authSlice";
import { getPostAuthPath } from "../utils/authNavigation";
import styles from "./AuthFlow.module.css";

export default function ChooseRole() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const context = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("nefru_google_onboarding") || "null");
    } catch {
      return null;
    }
  }, []);

  const chooseRole = async (role) => {
    if (!context?.onboardingToken) {
      setError("Your Google sign-up session expired. Please start again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiRequest("/auth/google/complete-signup", {
        method: "POST",
        body: JSON.stringify({
          onboardingToken: context.onboardingToken,
          role,
          rememberMe: Boolean(context.rememberMe),
        }),
      });

      const user = response?.data?.user;
      const profile = response?.data?.profile;
      if (!user) throw new Error("Unable to finish Google sign up");

      sessionStorage.removeItem("nefru_google_onboarding");
      dispatch(
        loginSuccess({
          token: response?.meta?.token || null,
          user,
          profile,
        }),
      );
      navigate(getPostAuthPath(user, profile), { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Unable to finish Google sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <img src={LogoLight} alt="Nefru" className={styles.logo} />
        <p className={styles.eyebrow}>One last step</p>
        <h1 className={styles.title}>How will you use Nefru?</h1>
        <p className={styles.text}>
          {context?.googleProfile?.email
            ? `Google verified ${context.googleProfile.email}. Choose your Nefru experience to finish creating the account.`
            : "Choose your Nefru experience to finish creating the account."}
        </p>

        <div className={styles.roleGrid}>
          <button
            type="button"
            className={styles.roleCard}
            onClick={() => chooseRole("tourist")}
            disabled={loading}
          >
            <strong>Traveler</strong>
            <span>Discover experiences, save trips, and manage bookings.</span>
          </button>

          <button
            type="button"
            className={styles.roleCard}
            onClick={() => chooseRole("guide")}
            disabled={loading}
          >
            <strong>Tour Guide</strong>
            <span>Create tours after completing Nefru guide verification.</span>
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {!context?.onboardingToken && (
          <button
            type="button"
            className={styles.secondary}
            onClick={() => navigate("/auth/login")}
          >
            Back to login
          </button>
        )}
      </section>
    </main>
  );
}
