import ResetPasswordForm from "../components/ResetPasswordForm";
import styles from "../ResetPassword.module.css";
import Footer from "./../../../../../shared/Footer/Footer";

export default function DesktopResetPassword() {
  return (
    <>
      <main className={styles.container}>
        <div className={styles.authLayout}>
          <section className={styles.hero} aria-label="Create new password">
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Set a fresh key for your account
              </h1>
              <div className={styles.heroLine} />
              <p className={styles.heroText}>
                Choose a strong password so your Nefru account stays safe while
                you plan and manage your travel experiences.
              </p>
            </div>
          </section>

          <section className={styles.formSide}>
            <ResetPasswordForm />
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
}
