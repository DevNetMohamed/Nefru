import styles from './Navbar.module.css';
import Icons from '../../../../assets/icons'
import { useLocation } from 'react-router-dom'
import { Button } from '../../../../shared/components/Button/Button'

const PAGE_TITLES = {
  overview: "Dashboard",
  accounts: "Accounts",
  cms: "CMS",
  analytics: "Analytics",
  booking: "Bookings",
};

export default function Navbar() {
  const location = useLocation();
  const activeKey =
    location.pathname.split("/").filter(Boolean).pop() || "overview";
  const title = PAGE_TITLES[activeKey] || "Dashboard";

  return (
    <div className={styles.navbar}>
      <div style={{ fontSize: "32px", fontWeight: "500" }}>{title}</div>
      <div className={styles.section}>
        <Button className={styles.iconButton} aria-label="Notifications">
          <Icons.Notification />
        </Button>
        <Button
          className={`${styles.iconButton} ${styles.avatar}`}
          aria-label="Admin account"
        >
          A
        </Button>
      </div>
    </div>
  );
}
