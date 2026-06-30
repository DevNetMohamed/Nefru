import { FiClock, FiShield } from "react-icons/fi";

import Footer from "./../../../../../shared/Footer/Footer";
import ApplicationReceivedCard from "../components/ApplicationReceivedCard";
import styles from "../ApplicationReceived.module.css";

export default function DesktopApplicationReceived() {
  return (
    <>
      <main className={styles.container}>
        <div className={styles.authLayout}>
          <section className={styles.hero} aria-label="Nefru guide review status">
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>Thank you for joining Nefru</h1>
              <div className={styles.heroLine} />
              <p className={styles.heroText}>
                We verify guide profiles carefully to keep every Nefru
                experience trusted, safe, and professional.
              </p>
            </div>

            <div className={styles.trustStrip}>
              <div className={styles.trustItem}>
                <FiShield />
                <span>Verified community</span>
              </div>
              <div className={styles.trustItem}>
                <FiClock />
                <span>Up to 5 business days</span>
              </div>
            </div>
          </section>

          <section className={styles.formSide}>
            <ApplicationReceivedCard />
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
}
