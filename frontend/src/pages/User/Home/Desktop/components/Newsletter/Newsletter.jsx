import styles from "./Newsletter.module.css";
const Newsletter = () => {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <span className={styles.badge}>
          STAY INSPIRED
        </span>

        <h2>
          Start Your Egyptian Journey
        </h2>

        <p>
          Receive updates on new tours, hidden gems,
          local experiences and travel inspiration.
        </p>

        <form className={styles.form}>
          <input
            type="email"
            placeholder="Enter your email"
          />

          <button type="submit">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
