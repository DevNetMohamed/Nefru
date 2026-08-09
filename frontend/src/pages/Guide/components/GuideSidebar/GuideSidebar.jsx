import {
  CalendarDays,
  CircleHelp,
  Home,
  MapPinned,
  UserRound,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import logo from "../../../../assets/images/logo.png";
import styles from "./GuideSidebar.module.css";

const navigationItems = [
  { label: "Dashboard", to: "/guide/dashboard", icon: Home },
  { label: "My Tours", to: "/guide", icon: MapPinned, end: true },
  { label: "Calendar", to: "/guide/calendar", icon: CalendarDays },
  { label: "Profile", to: "/guide/profile", icon: UserRound },
];

export default function GuideSidebar() {
  const navigate = useNavigate();

  return (
    <aside className={styles.sidebar}>
      <button
        type="button"
        className={styles.brand}
        onClick={() => navigate("/guide/dashboard")}
        aria-label="Open guide dashboard"
      >
        <img src={logo} alt="" aria-hidden="true" />
        <span>
          <strong>Nefru</strong>
          <small>TOUR GUIDE</small>
        </span>
      </button>

      <nav className={styles.navigation} aria-label="Guide navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
            >
              <Icon size={20} strokeWidth={2} aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <a className={styles.supportCard} href="mailto:support@nefru.com">
        <span className={styles.supportIcon}>
          <CircleHelp size={21} aria-hidden="true" />
        </span>
        <span>
          <strong>Need Help?</strong>
          <small>Contact Support</small>
        </span>
        <b aria-hidden="true">›</b>
      </a>
    </aside>
  );
}
