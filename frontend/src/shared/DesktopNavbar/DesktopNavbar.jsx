import styles from "./DesktopNavbar.module.css";
import { Bell, Heart, User } from "lucide-react";
import logo from "../../../../../assets/images/logo.png";
function DesktopNavbar() {
  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <img src={logo} alt="Nefru Logo" />
          <span>  Nefru</span>

        </div>

      {/* Search */}
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search experiences..."
        />
      </div>

      {/* Navigation Links */}
      <ul className={styles.links}>
        <li>Experiences</li>
        <li>Destinations</li>
        <li>Cruises</li>
        <li>Packages</li>
      </ul>

      {/* Actions */}
      <div className={styles.actions}>
        <Bell size={20} />
        <Heart size={20} />
        <User size={20} />
      </div>
    </nav>
  );
}

export default DesktopNavbar;