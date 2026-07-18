import ForgetpasswordForm from "../components/ForgetpasswordForm";
import styles from "../Forgetpassword.module.css";
import Footer from "./../../../../../shared/Footer/Footer";

export default function DesktopForgetpassword() {
  return (
    <>
      <main className={styles.container}>
        <div className={styles.authLayout}>
          <section className={styles.hero} aria-label="Password recovery help">
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Get back to your journey safely
              </h1>
              <div className={styles.heroLine} />
              <p className={styles.heroText}>
                Enter your email and we’ll help you reset access to your Nefru
                account without losing your upcoming travel plans.
              </p>
            </div>
          </section>

          <section className={styles.formSide}>
            <ForgetpasswordForm />
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
}
