import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell } from "lucide-react";
import useIsMobile from "../../../hooks/useIsMobile";
import DesktopNavbar from "../Home/components/DesktopNavbar/DesktopNavbar";
import Footer from "../../../shared/components/Footer/Footer";
import MobilePageHeader from "../../../shared/components/MobilePageHeader/MobilePageHeader";
import { markAllAsRead, markAsRead } from "../../../store/slices/notificationSlice";
import NotificationItem from "./components/NotificationItem";
import styles from "./NotificationsPage.module.css";

const filters = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Bookings", value: "booking" },
  { label: "Account", value: "account" },
];

function NotificationsContent({ isMobile }) {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);
  const [activeFilter, setActiveFilter] = useState("all");
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;
    if (activeFilter === "unread") return notifications.filter((notification) => !notification.isRead);
    return notifications.filter((notification) => notification.type?.trim() === activeFilter);
  }, [activeFilter, notifications]);

  const handleMarkAllRead = () => dispatch(markAllAsRead());

  return (
    <main className={styles.page}>
      <div className={styles.pageShell}>
        {isMobile && (
          <MobilePageHeader
            title="Notifications"
            backTo={-1}
            action={{ text: "Read all", label: "Mark all notifications as read", onClick: handleMarkAllRead, disabled: unreadCount === 0 }}
          />
        )}
        <section className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>
              {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? "s" : ""}` : "You are all caught up"}
            </span>
            {!isMobile && <h1>Notifications</h1>}
            <p>Stay updated with bookings, payments, and account activity.</p>
          </div>
          {!isMobile && (
            <div className={styles.heroActions}>
              <button type="button" className={styles.markAllButton} onClick={handleMarkAllRead} disabled={unreadCount === 0}>Mark all read</button>
            </div>
          )}
        </section>
        <section className={styles.panel} aria-label="Notification center">
          <div className={styles.tabs} role="tablist" aria-label="Notification filters">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.value;
              return (
                <button key={filter.value} type="button" role="tab" aria-selected={isActive} className={isActive ? styles.activeTab : ""} onClick={() => setActiveFilter(filter.value)}>
                  {filter.label}
                  {filter.value === "unread" && unreadCount > 0 && <span className={styles.tabCount}>{unreadCount}</span>}
                </button>
              );
            })}
          </div>
          {filteredNotifications.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}><Bell size={30} /></div>
              <h2>No notifications here</h2>
              <p>Booking updates, payment activity, and account alerts will appear in this section.</p>
            </div>
          ) : (
            <div className={styles.list}>
              {filteredNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} onRead={(id) => dispatch(markAsRead(id))} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function NotificationsPage() {
  const isMobile = useIsMobile(992);
  if (isMobile) return <NotificationsContent isMobile />;
  return <><DesktopNavbar /><NotificationsContent isMobile={false} /><Footer /></>;
}
