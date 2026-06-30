import { Link } from "react-router-dom";
import { FiLock } from "react-icons/fi";

import styles from "../ProfilePageShared.module.css";

export default function ChangePassword() {
  return (
    <div className={styles.pageContent}>
      <header className={styles.header}>
        <div>
          <h1>Change Password</h1>
          <p>Choose a strong password and keep your account secure.</p>
        </div>
      </header>

      <section className={styles.card}>
        <div className={styles.cardTitle}>
          <FiLock />
          <h2>Security Information</h2>
        </div>

        <div className={styles.formGrid}>
          <label className={styles.fieldBox}>
            <span>Current Password</span>
            <input type="password" placeholder="Enter your current password" />
          </label>

          <label className={styles.fieldBox}>
            <span>New Password</span>
            <input type="password" placeholder="Enter your new password" />
          </label>

          <label className={styles.fieldBox}>
            <span>Confirm New Password</span>
            <input type="password" placeholder="Confirm your new password" />
          </label>
        </div>

        <div className={styles.actions}>
          <Link to="/user/profile" className={styles.secondaryButton}>
            Cancel
          </Link>
          <button type="button" className={styles.primaryButton}>
            Update Password
          </button>
        </div>
      </section>
    </div>
  );
}
