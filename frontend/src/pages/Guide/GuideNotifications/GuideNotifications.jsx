import { Bell } from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { markAllAsRead, markAsRead } from "../../../store/slices/notificationSlice";
import NotificationItem from "../../User/Notifications/components/NotificationItem";
import styles from "./GuideNotifications.module.css";

const resolveGuideNotification = (notification) => {
  const type = notification?.type?.trim();
  let link = null;

  if (type === "booking") link = "/guide/dashboard";
  if (type === "payment") link = "/guide/profile";
  if (type === "support") link = "/guide/profile";

  return { ...notification, link };
};

const filters = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Bookings", value: "booking" },
  { label: "Payments", value: "payment" },
  { label: "Account", value: "account" },
];

export default function GuideNotifications() {
  const [activeFilter, setActiveFilter] = useState("all");
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;
    if (activeFilter === "unread") {
      return notifications.filter((notification) => !notification.isRead);
    }
    return notifications.filter(
      (notification) => notification.type?.trim() === activeFilter,
    );
  }, [activeFilter, notifications]);

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>
            {unreadCount > 0 ? `${unreadCount} unread updates` : "You are all caught up"}
          </span>
          <h1>Notifications</h1>
          <p>Stay updated with bookings, payments, reviews, and account activity.</p>
        </div>
        <button
          type="button"
          onClick={() => dispatch(markAllAsRead())}
          disabled={unreadCount === 0}
        >
          Mark all read
        </button>
      </header>

      <section className={styles.panel}>
        <div className={styles.tabs} role="tablist" aria-label="Notification filters">
          {filters.map((filter) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === filter.value}
              key={filter.value}
              className={activeFilter === filter.value ? styles.activeTab : ""}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
              {filter.value === "unread" && unreadCount > 0 && (
                <span>{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        {filteredNotifications.length === 0 ? (
          <div className={styles.emptyState}>
            <span><Bell size={28} /></span>
            <h2>No notifications here</h2>
            <p>New booking updates and trip alerts will appear in this section.</p>
          </div>
        ) : (
          <div className={styles.list}>
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={resolveGuideNotification(notification)}
                onRead={(id) => dispatch(markAsRead(id))}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
