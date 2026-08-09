import { CalendarDays, Home, MapPinned, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

import styles from "./GuideMobileNav.module.css";

const items = [
  { label: "Dashboard", to: "/guide/dashboard", icon: Home },
  { label: "My Tours", to: "/guide", icon: MapPinned, end: true },
  { label: "Calendar", to: "/guide/calendar", icon: CalendarDays },
  { label: "Profile", to: "/guide/profile", icon: UserRound },
];

export default function GuideMobileNav() {
  return (
    <nav className={styles.navigation} aria-label="Guide mobile navigation">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ""}`
            }
          >
            <Icon size={21} strokeWidth={2} aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
