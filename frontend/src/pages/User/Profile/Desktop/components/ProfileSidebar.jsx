import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiCalendar,
  FiCreditCard,
  FiHeadphones,
  FiLock,
  FiLogOut,
  FiStar,
  FiUser,
} from "react-icons/fi";

import styles from "./ProfileSidebar.module.css";

const menuItems = [
  { to: "/user/profile", label: "Profile Overview", icon: FiUser, end: true },
  { to: "/user/profile/bookings", label: "My Bookings", icon: FiCalendar },
  { to: "/user/profile/payments", label: "Payment Methods", icon: FiCreditCard },
  { to: "/user/profile/reviews", label: "Reviews Written", icon: FiStar },
  { to: "/user/profile/change-password", label: "Change Password", icon: FiLock },
  { to: "/user/profile/support", label: "Help & Support", icon: FiHeadphones },
];

function getInitials(fullName = "User") {
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfileSidebar({ onLogout }) {
  const { user } = useSelector((state) => state.auth);
  const fullName = user?.fullName || "Nefru Traveler";
  const email = user?.email || "traveler@nefru.com";

  return (
    <aside className={styles.sidebar}>
      <div className={styles.summaryCard}>
        <div className={styles.avatar}>{getInitials(fullName)}</div>
        <div>
          <h2>{fullName}</h2>
          <p>{email}</p>
        </div>

        <div className={styles.progressBlock}>
          <div className={styles.progressHeader}>
            <span>Profile Completion</span>
            <strong>60%</strong>
          </div>
          <div className={styles.progressTrack}>
            <span />
          </div>
        </div>
      </div>

      <nav className={styles.navCard} aria-label="Profile navigation">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
              }
            >
              <Icon />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <button type="button" className={styles.navItem} onClick={onLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
