import {
  ArrowLeft,
  Bell,
  CalendarDays,
  ChevronRight,
  Home,
  LogOut,
  MapPinned,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import logo from "../../../../assets/images/logo.png";
import fallbackAvatar from "../../../../assets/images/guiders/guide1.webp";
import { logout } from "../../../../store/slices/authSlice";
import NotificationPopover from "../../../User/Notifications/components/NotificationPopover";
import styles from "./GuideHeader.module.css";

const MOBILE_BREAKPOINT = "(max-width: 991px)";

const resolveGuideNotificationLink = (notification) => {
  if (notification?.type?.trim() === "booking") return "/guide/dashboard";
  if (notification?.type?.trim() === "payment") return "/guide/profile";
  if (notification?.type?.trim() === "support") return "/guide/profile";
  return notification?.link?.startsWith("/guide") ? notification.link : null;
};

const profileMenuItems = [
  { path: "/guide/profile", label: "Guide Profile", icon: User },
  { path: "/guide/dashboard", label: "Dashboard", icon: Home },
  { path: "/guide", label: "My Tours", icon: MapPinned },
  { path: "/guide/calendar", label: "Calendar", icon: CalendarDays },
];

const mobileBackFallbacks = {
  "/guide/profile": "/guide/dashboard",
  "/guide/notifications": "/guide/dashboard",
};

export default function GuideHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const actionsRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, profile } = useSelector((state) => state.auth);
  const notifications = useSelector(
    (state) => state.notifications.notifications,
  );

  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const fullName = user?.fullName || "Ahmed Farouk";
  const email = user?.email || "guide@nefru.com";
  const avatar = user?.avatar || profile?.profileImage || fallbackAvatar;
  const backFallback = mobileBackFallbacks[location.pathname];
  const showMobileBack = Boolean(backFallback);

  useEffect(() => {
    setShowNotifications(false);
    setShowProfile(false);
  }, [location.pathname]);

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

  const handleMobileBack = () => {
    if (location.key && location.key !== "default") {
      navigate(-1);
      return;
    }

    navigate(backFallback || "/guide/dashboard", { replace: true });
  };

  const handleNotificationClick = () => {
    const isMobile = window.matchMedia(MOBILE_BREAKPOINT).matches;

    setShowProfile(false);

    if (isMobile) {
      setShowNotifications(false);
      navigate("/guide/notifications");
      return;
    }

    setShowNotifications((current) => !current);
  };

  const handleLogout = () => {
    setShowProfile(false);
    dispatch(logout());
    navigate("/auth/login", { replace: true });
  };

  return (
    <header className={styles.header}>
      <div className={styles.mobileStartSlot}>
        {showMobileBack ? (
          <button
            type="button"
            className={styles.mobileBackButton}
            onClick={handleMobileBack}
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </button>
        ) : (
          <span className={styles.mobileBackPlaceholder} aria-hidden="true" />
        )}
      </div>

      <button
        type="button"
        className={styles.mobileBrand}
        onClick={() => navigate("/guide/dashboard")}
        aria-label="Open guide dashboard"
      >
        <img src={logo} alt="" aria-hidden="true" />
        <span>
          <strong>Nefru</strong>
          <small>TOUR GUIDE</small>
        </span>
      </button>

      <div className={styles.headerContext} aria-hidden="true">
        <span>Guide workspace</span>
      </div>

      <div className={styles.actions} ref={actionsRef}>
        <div className={styles.actionWrapper}>
          <button
            type="button"
            className={styles.iconButton}
            data-open={showNotifications || undefined}
            onClick={handleNotificationClick}
            aria-label="Open notifications"
            aria-expanded={showNotifications}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className={styles.notificationBadge}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationPopover
              onClose={() => setShowNotifications(false)}
              viewAllTo="/guide/notifications"
              resolveLink={resolveGuideNotificationLink}
            />
          )}
        </div>

        <div className={`${styles.actionWrapper} ${styles.profileAction}`}>
          <button
            type="button"
            className={styles.iconButton}
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
            <div className={styles.dropdown} role="menu" aria-label="Guide menu">
              <header className={styles.profilePanelHeader}>
                <button
                  type="button"
                  className={styles.profileHeader}
                  onClick={() => navigateFromMenu("/guide/profile")}
                >
                  <span className={styles.avatarWrapper}>
                    <img src={avatar} alt={`${fullName} profile`} />
                  </span>

                  <span className={styles.profileHeaderText}>
                    <strong>{fullName}</strong>
                    <small>{email}</small>
                    <span className={styles.viewProfileText}>
                      View guide profile
                    </span>
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
                    const isActive =
                      item.path === "/guide"
                        ? location.pathname === item.path
                        : location.pathname.startsWith(item.path);

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
                  className={styles.logoutButton}
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
    </header>
  );
}
