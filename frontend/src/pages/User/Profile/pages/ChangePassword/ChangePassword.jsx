import AccountSecurityPanel from "../../../../../shared/components/AccountSecurityPanel/AccountSecurityPanel";
import styles from "../ProfilePageShared.module.css";

export default function ChangePassword() {
  return (
    <div className={styles.pageContent}>
      <header className={styles.header}>
        <div>
          <h1>Sign-in &amp; Security</h1>
          <p>Manage your password and connected Google account.</p>
        </div>
      </header>

      <AccountSecurityPanel />
    </div>
  );
}
