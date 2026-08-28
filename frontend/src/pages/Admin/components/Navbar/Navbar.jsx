import styles from './Navbar.module.css';
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

import { logoutUser } from '../../../../store/slices/authSlice'

const PAGE_TITLES = {
  overview: "Dashboard",
  accounts: "Accounts",
  cms: "Tours & Content",
  analytics: "Analytics",
  booking: "Bookings",
};

export default function Navbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const activeKey =
    location.pathname.split("/").filter(Boolean).pop() || "overview";
  const title = PAGE_TITLES[activeKey] || "Dashboard";

  // Close on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const email = user?.email || "";
  const displayName =
    user?.fullName || (email ? email.split("@")[0] : "Admin");
  const initial = (displayName?.[0] || "A").toUpperCase();

  return (
    <div className={styles.navbar}>
      <div style={{ fontSize: "32px", fontWeight: "500" }}>{title}</div>
      <div className={styles.section}>
        {/* <button type="button" className={styles.iconButton} aria-label="Notifications">
          <Icons.Notification />
        </button> */}

        <div className={styles.accountWrap} ref={menuRef}>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.avatar}`}
            aria-label="Account menu"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {initial}
          </button>

          {menuOpen ? (
            <div className={styles.menu} role="menu" aria-label="Account">
              <div className={styles.menuHeader}>
                <span className={styles.menuAvatar}>{initial}</span>
                <span className={styles.menuIdentity}>
                  <span className={styles.menuName} title={displayName}>
                    {displayName}
                  </span>
                  <span className={styles.menuEmail} title={email}>
                    {email || "No email"}
                  </span>
                </span>
              </div>
              {/* <div className={styles.menuMeta}>
                <span className={styles.rolePill}>{role.toUpperCase()}</span>
                <span className={styles.signedIn}>Signed in</span>
              </div> */}
              <div className={styles.divider} />
              <button
                type="button"
                role="menuitem"
                className={styles.logoutButton}
                onClick={() => dispatch(logoutUser())}
              >
                Log out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
