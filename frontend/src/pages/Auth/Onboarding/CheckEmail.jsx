import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import LogoLight from "../../../assets/images/Logo_Light.png";
import { apiRequest } from "../../../services/api";
import styles from "./AuthFlow.module.css";

export default function CheckEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "your email";
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const resend = async () => {
    if (!searchParams.get("email")) return;
    setLoading(true);
    setStatus("");

    try {
      const response = await apiRequest("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email: searchParams.get("email") }),
      });
      setStatus(response.message);
    } catch (error) {
      setStatus(error.message || "Unable to resend verification email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <img src={LogoLight} alt="Nefru" className={styles.logo} />
        <p className={styles.eyebrow}>Check your inbox</p>
        <h1 className={styles.title}>Verify your email</h1>
        <p className={styles.text}>
          We sent a verification link to <strong>{email}</strong>. Open it to
          activate your account. The link expires in 30 minutes.
        </p>

        <aside className={styles.deliveryNote} aria-label="Email delivery help">
          <strong>Can&apos;t find the email?</strong>
          <span>
            Check your Spam or Junk folder, then mark the Nefru message as
            &quot;Not spam&quot; so future emails reach your inbox.
          </span>
        </aside>

        {status && <p className={styles.info} role="status">{status}</p>}

        <button
          className={styles.primary}
          type="button"
          onClick={resend}
          disabled={loading || !searchParams.get("email")}
        >
          {loading ? "Sending…" : "Resend verification email"}
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
