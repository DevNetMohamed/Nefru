import styles from "./DesktopNavbar.module.css";
import {
  Bell,
  Calendar,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";
import {
  FiCreditCard,
  FiHeadphones,
  FiLock,
  FiStar,
} from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import logo from "../../../../../assets/images/logo.png";
import profileImage from "../../../../../assets/images/user/user1.png";
import { logout } from "../../../../../store/slices/authSlice";
import NotificationPopover from "../../../Notifications/components/NotificationPopover";

const getImgSrc = (img, fallback) => {
  if (!img) return fallback;
  if (
    typeof img === "string" &&
    (img.startsWith("http://") ||
      img.startsWith("https://") ||
      img.startsWith("data:") ||
      img.startsWith("/"))
  ) {
    return img;
  }
  return `http://localhost:5000/uploads/${img}`;
};

const profileMenuItems = [
  {
    path: "/user/profile",
    label: "My Profile",
    icon: User,
  },
  {
    path: "/user/profile/bookings",
    label: "My Bookings",
    icon: Calendar,
  },
  {
    path: "/user/profile/payments",
    label: "Payment Methods",
    icon: FiCreditCard,
  },
  {
    path: "/user/profile/reviews",
    label: "Reviews written",
    icon: FiStar,
  },
  {
    path: "/user/profile/change-password",
    label: "Change Password",
    icon: FiLock,
  },
  {
    path: "/user/profile/support",
    label: "Help & Support",
    icon: FiHeadphones,
  },
];

function DesktopNavbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const actionsRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth || {});
  const notifications = useSelector(
    (state) => state.notifications?.notifications || []
  );

  const unreadNotificationsCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const fullName = user?.fullName || "Not Logged In";
  const email = user?.email || "Not Logged In";
  const avatar = getImgSrc(user?.profileImage || user?.avatar, profileImage);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname === "/user/home" || location.pathname === "/user") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    navigate(`/user/home#${sectionId}`);
  };

  useEffect(() => {
    if (!showNotifications && !showProfile) return undefined;

    const closeMenus = (event) => {
      if (!actionsRef.current?.contains(event.target)) {
        setShowNotifications(false);
        setShowProfile(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setShowNotifications(false);
        setShowProfile(false);
      }
    };

    document.addEventListener("pointerdown", closeMenus);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeMenus);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [showNotifications, showProfile]);

  const navigateFromMenu = (path) => {
    setShowProfile(false);
    navigate(path);
  };

  const handleLogout = () => {
    setShowProfile(false);
    dispatch(logout());
    navigate("/auth/login", { replace: true });
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={() => navigate("/user/home")}>
        <img src={logo} alt="Nefru Logo" />
        <span>Nefru</span>
      </div>

      <ul className={styles.links}>
        <li>
          <a href="#Home" onClick={(e) => scrollToSection(e, "Home")}>Home</a>
        </li>
        <li>
          <a href="#popular-tours" onClick={(e) => scrollToSection(e, "popular-tours")}>Tours</a>
        </li>
        <li>
          <a href="/user/nearby" onClick={(e) => { e.preventDefault(); navigate("/user/nearby"); }}>Nearby Map</a>
        </li>
        <li>
          <a href="#explore-egypt" onClick={(e) => scrollToSection(e, "explore-egypt")}>Explore Egypt</a>
        </li>
        <li>
          <a href="#top-guides" onClick={(e) => scrollToSection(e, "top-guides")}>Guides</a>
        </li>
      </ul>

      <div className={styles.actions} ref={actionsRef}>
        <div className={styles.notificationWrapper}>
          <button
            type="button"
            className={styles.notificationButton}
            data-open={showNotifications || undefined}
            onClick={() => {
              setShowNotifications((current) => !current);
              setShowProfile(false);
            }}
            aria-label="Open notifications"
            aria-expanded={showNotifications}
          >
            <Bell size={20} />
            {unreadNotificationsCount > 0 && (
              <span className={styles.notificationBadge}>
                {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationPopover
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>

        <div className={styles.profileWrapper}>
          <button
            type="button"
            className={styles.profileButton}
            data-open={showProfile || undefined}
            onClick={() => {
              setShowProfile((current) => !current);
              setShowNotifications(false);
            }}
            aria-label="Open profile menu"
            aria-expanded={showProfile}
            aria-haspopup="menu"
          >
            <User size={20} />
          </button>

          {showProfile && (
            <div
              className={styles.dropdown}
              role="menu"
              aria-label="Profile menu"
            >
              <header className={styles.profilePanelHeader}>
                <button
                  type="button"
                  className={styles.profileHeader}
                  onClick={() => navigateFromMenu("/user/profile")}
                >
                  <span className={styles.avatarWrapper}>
                    <img src={avatar} alt={`${fullName} profile`} />
                  </span>

                  <span className={styles.profileHeaderText}>
                    <strong>{fullName}</strong>
                    <small>{email}</small>
                    <span className={styles.viewProfileText}>View profile</span>
                  </span>

                  <ChevronRight
                    size={18}
                    className={styles.profileHeaderChevron}
                    aria-hidden="true"
                  />
                </button>
              </header>

              <div className={styles.menuBody}>
                <div className={styles.menuList}>
                  {profileMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <button
                        key={item.path}
                        type="button"
                        className={styles.dropdownItem}
                        data-active={isActive || undefined}
                        onClick={() => navigateFromMenu(item.path)}
                        role="menuitem"
                      >
                        <span className={styles.itemIcon}>
                          <Icon size={18} aria-hidden="true" />
                        </span>
                        <span className={styles.itemLabel}>{item.label}</span>
                        <ChevronRight
                          size={17}
                          className={styles.itemChevron}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <footer className={styles.menuFooter}>
                <button
                  type="button"
                  className={styles.logoutBtn}
                  onClick={handleLogout}
                  role="menuitem"
                >
                  <LogOut size={18} aria-hidden="true" />
                  <span>Logout</span>
                </button>
              </footer>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default DesktopNavbar;
