import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Bell } from "lucide-react";

import {
  markAllAsRead,
  markAsRead,
} from "../../../../store/slices/notificationSlice";
import NotificationItem from "./NotificationItem";
import styles from "./NotificationPopover.module.css";

export default function NotificationPopover({
  onClose,
  viewAllTo = "/user/notifications",
  resolveLink,
}) {
  const dispatch = useDispatch();

  const notifications = useSelector(
    (state) => state.notifications.notifications
  );

  const latestNotifications = notifications.slice(0, 5);
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const handleRead = (id, hasLink) => {
    dispatch(markAsRead(id));

    if (hasLink) {
      onClose?.();
    }
  };

  return (
    <div className={styles.popover}>
      <header className={styles.header}>
        <div>
          <h2>Notifications</h2>
          <p>
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You are all caught up"}
          </p>
        </div>

        <button
          type="button"
          className={styles.markButton}
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
        >
          Mark all read
        </button>
      </header>

      <div className={styles.body}>
        {latestNotifications.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Bell size={28} />
            </div>
            <h3>No notifications yet</h3>
            <p>You’ll see booking updates and account alerts here.</p>
          </div>
        ) : (
          latestNotifications.map((notification) => {
            const resolvedNotification = resolveLink
              ? { ...notification, link: resolveLink(notification) }
              : notification;

            return (
              <NotificationItem
                key={notification.id}
                notification={resolvedNotification}
                compact
                onRead={handleRead}
              />
            );
          })
        )}
      </div>

      <footer className={styles.footer}>
        <Link to={viewAllTo} onClick={onClose}>
          View all notifications
        </Link>
      </footer>
    </div>
  );
}
