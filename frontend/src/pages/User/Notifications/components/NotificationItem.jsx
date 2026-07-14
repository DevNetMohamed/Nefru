import { Link } from "react-router-dom";
import {
  Bell,
  CalendarCheck,
  CreditCard,
  Info,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import { formatTimeAgo } from "../utils/formatTimeAgo";
import styles from "./NotificationItem.module.css";

const iconMap = {
  booking: CalendarCheck,
  payment: CreditCard,
  account: ShieldCheck,
  support: MessageCircle,
  system: Info,
  default: Bell,
};

export default function NotificationItem({
  notification,
  compact = false,
  onRead,
}) {
  const type = notification?.type?.trim();
  const Icon = iconMap[type] || iconMap.default;

  const isUnread = !notification?.isRead;
  const hasLink = Boolean(notification?.link);

  const itemClassName = `${styles.item} ${isUnread ? styles.unread : ""} ${
    compact ? styles.compact : ""
  }`;

  const handleClick = () => {
    onRead?.(notification.id, hasLink);
  };

  const content = (
    <>
      <div className={styles.iconBox} aria-hidden="true">
        <Icon size={18} />
      </div>

      <div className={styles.content}>
        <div className={styles.topLine}>
          <h3>{notification?.title || "Notification"}</h3>
          <span>{formatTimeAgo(notification?.createdAt)}</span>
        </div>

        <p>{notification?.message || "You have a new notification."}</p>
      </div>

      {isUnread && <span className={styles.dot} aria-label="Unread" />}
    </>
  );

  if (hasLink) {
    return (
      <Link
        to={notification.link}
        className={itemClassName}
        onClick={handleClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={itemClassName} onClick={handleClick}>
      {content}
    </button>
  );
}
