import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import LogoLight from "../../../assets/images/Logo_Light.png";
import { apiRequest } from "../../../services/api";
import { loginSuccess } from "../../../store/slices/authSlice";
import { getPostAuthPath } from "../utils/authNavigation";
import styles from "./AuthFlow.module.css";

export default function LinkGoogleAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const context = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("nefru_google_link") || "null");
    } catch {
      return null;
    }
  }, []);
  const hasRoleConflict =
    context?.existingRole &&
    context?.googleRole &&
    context.existingRole !== context.googleRole;

  const submit = async (event) => {
    event.preventDefault();

    if (!context?.linkingToken) {
      setError("Your Google linking session expired. Please start again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiRequest("/auth/google/link", {
        method: "POST",
        body: JSON.stringify({
          linkingToken: context.linkingToken,
          password,
          rememberMe: Boolean(context.rememberMe),
        }),
      });

      const user = response?.data?.user;
      const profile = response?.data?.profile;
      if (!user) throw new Error("Unable to link Google account");

      sessionStorage.removeItem("nefru_google_link");
      dispatch(
        loginSuccess({
          token: response?.meta?.token || null,
          user,
          profile,
        }),
      );
      navigate(getPostAuthPath(user, profile), { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Unable to link Google account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <img src={LogoLight} alt="Nefru" className={styles.logo} />
        <p className={styles.eyebrow}>Secure account linking</p>
        <h1 className={styles.title}>This email already has a Nefru account</h1>
        <p className={styles.text}>
          Enter your current Nefru password once to link Google securely. After
          that, you can use either sign-in method.
        </p>

        {context?.email && <p className={styles.info}>{context.email}</p>}
        {hasRoleConflict && (
          <p className={styles.error}>
            The existing account is a {context.existingRole}, while the Google
            duplicate is a {context.googleRole}. For safety, automatic merging
            will pause so neither profile loses its data.
          </p>
        )}

        <form className={styles.form} onSubmit={submit}>
          <label className={styles.label} htmlFor="link-password">
            Current Nefru password
          </label>
          <input
            id="link-password"
            className={styles.input}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.primary}
            type="submit"
            disabled={loading || !password}
          >
            {loading ? "Linking…" : "Link Google account"}
          </button>
          <button
            className={styles.secondary}
            type="button"
            onClick={() => navigate("/auth/login")}
          >
            Cancel
          </button>
        </form>
      </section>
    </main>
  );
}
