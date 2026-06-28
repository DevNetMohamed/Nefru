import LoginForm from "../components/LoginForm";
import styles from "../Login.module.css";
import Footer from "./../../../../../shared/Footer/Footer";

export default function DesktopLogin() {
  return (
    <>
      <main className={styles.container}>
        <div className={styles.authLayout}>
          <section
            className={styles.hero}
            aria-label="Nefru trusted travel access"
          >
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Continue your Egyptian journey
              </h1>
              <div className={styles.heroLine} />
              <p className={styles.heroText}>
                Sign in to discover curated trips, manage your bookings, and
                explore Egypt with verified local guides.
              </p>
            </div>
          </section>
          <section className={styles.formSide}>
              <LoginForm />
            
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
}
