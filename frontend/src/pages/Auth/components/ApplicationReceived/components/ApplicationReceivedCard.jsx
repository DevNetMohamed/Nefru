import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiHelpCircle,
  FiLogIn,
  FiMail,
} from "react-icons/fi";

import styles from "../ApplicationReceived.module.css";
import LogoLight from "../../../../../assets/images/Logo_Light.png";

const reviewSteps = [
  "Our team reviews your documents and guide details.",
  "You will receive an email once the review is complete.",
  "If approved, you can log in and start creating tours.",
];

export default function ApplicationReceivedCard() {
  const navigate = useNavigate();

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
        Your guide application and supporting documents have been submitted
        successfully and are now under review.
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
          Keep an eye on your email. We may contact you if we need extra
          information.
        </p>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => navigate("/")}
        >
          <FiArrowLeft />
          Back Home
        </button>

        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => navigate("/auth/login")}
        >
          <FiLogIn />
          Log in
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
