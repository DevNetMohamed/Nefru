import RegisterForm from "../components/RegisterForm";
import styles from "../Register.module.css";
import Footer from "./../../../../../shared/Footer/Footer";

export default function DesktopRegister() {
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
              <h1 className={styles.heroTitle}>Your Journey Begins in Egypt</h1>

              <div className={styles.heroLine} />
              <p className={styles.heroText}>
                Create your Nefru account to unlock exclusive experiences,
                personalized journeys, and the timeless wonders of Egypt.
              </p>
            </div>
          </section>
          <section className={styles.formSide}>
            <RegisterForm />
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
}
