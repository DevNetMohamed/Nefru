import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell } from "lucide-react";

import useIsMobile from "../../../hooks/useIsMobile";
import DesktopNavbar from "../Home/components/DesktopNavbar/DesktopNavbar";
import Footer from "../../../shared/components/Footer/Footer";
import {
  markAllAsRead,
  markAsRead,
} from "../../../store/slices/notificationSlice";
import NotificationItem from "./components/NotificationItem";
import styles from "./NotificationsPage.module.css";

const filters = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Bookings", value: "booking" },
  { label: "Account", value: "account" },
];

function NotificationsContent({ isMobile }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const notifications = useSelector(
    (state) => state.notifications.notifications
  );

  const [activeFilter, setActiveFilter] = useState("all");

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;

    if (activeFilter === "unread") {
      return notifications.filter((notification) => !notification.isRead);
    }

    return notifications.filter(
      (notification) => notification.type?.trim() === activeFilter
    );
  }, [activeFilter, notifications]);

  const handleRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <main className={styles.page}>
      {isMobile && (
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft size={22} />
        </button>
      )}

      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>Account updates</span>
          <h1>Notifications</h1>
          <p>Stay updated with bookings, payments, and account activity.</p>
        </div>

        <div className={styles.heroActions}>
          <button
            type="button"
            className={styles.markAllButton}
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            Mark all read
          </button>

    
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.tabs}>
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={
                activeFilter === filter.value ? styles.activeTab : ""
              }
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {filteredNotifications.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Bell size={34} />
            </div>
            <h2>No notifications yet</h2>
            <p>
              You don’t have any notifications right now. Booking updates and
              account alerts will appear here.
            </p>
          </div>
        ) : (
          <div className={styles.list}>
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={handleRead}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function NotificationsPage() {
  const isMobile = useIsMobile(992);

  if (isMobile) {
    return <NotificationsContent isMobile />;
  }

  return (
    <>
      <DesktopNavbar />
      <NotificationsContent isMobile={false} />
      <Footer />
    </>
  );
}
