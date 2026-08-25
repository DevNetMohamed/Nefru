import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiHelpCircle,
  FiMail,
  FiUserCheck,
} from "react-icons/fi";

import styles from "../ApplicationReceived.module.css";
import LogoLight from "../../../../../assets/images/Logo_Light.png";

const reviewSteps = [
  "Our team reviews your identity document and guide details.",
  "You can keep browsing Nefru while your application is pending.",
  "We’ll email you when your application is approved or if changes are needed.",
];

export default function ApplicationReceivedCard() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <div className={styles.card} aria-labelledby="application-title">
      <img src={LogoLight} alt="Nefru" className={styles.heroLogo} />
      <div className={styles.successMark} aria-hidden="true">
        <span className={styles.successRing} />
        <FiCheck className={styles.successIcon} />
      </div>

      <span className={styles.statusBadge}>
        <FiClock /> Pending review
      </span>

      <h2 id="application-title" className={styles.title}>
        Application Received
      </h2>

      <p className={`${styles.subtitle} fs-5`}>
        Your guide verification documents were submitted successfully. Your
        account stays signed in while our team reviews the application.
      </p>

      <div className={styles.reviewCard}>
        <div className={styles.reviewIcon} aria-hidden="true">
          <FiCalendar />
        </div>

        <div className={styles.reviewContent}>
          <h3>What happens next?</h3>
          <ul className={styles.stepList}>
            {reviewSteps.map((step) => (
              <li key={step}>
                <FiCheckCircle />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.noteBox}>
        <FiMail />
        <p>
          Creating or publishing tours stays locked until approval, but you can
          browse Nefru and update your guide profile meanwhile.
        </p>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => navigate("/user/home")}
        >
          <FiArrowLeft />
          Explore Nefru
        </button>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={() =>
            navigate(
              isAuthenticated && user?.role === "guide"
                ? "/guide/dashboard"
                : "/auth/login",
            )
          }
        >
          <FiUserCheck />
          {isAuthenticated && user?.role === "guide"
            ? "Guide Dashboard"
            : "Log in"}
        </button>
      </div>

      <p className={styles.helpText}>
        <FiHelpCircle />
        Questions? Visit our <button type="button">Help Center</button> or
        contact <a href="mailto:support@nefru.com">support@nefru.com</a>
      </p>
    </div>
  );
}
