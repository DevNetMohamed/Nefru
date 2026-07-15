import { useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFilter,
  FiMapPin,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";

import styles from "../ProfilePageShared.module.css";

// Replace this array with backend data when the booking API is ready.
const bookings = [];

const tabs = [
  { key: "upcoming", label: "Upcoming", icon: FiCalendar },
  { key: "completed", label: "Completed", icon: FiCheckCircle },
  { key: "cancelled", label: "Cancelled", icon: FiXCircle },
];

function normalizeStatus(status = "") {
  return status.toLowerCase();
}

function getStatusClass(status) {
  const value = normalizeStatus(status);

  if (value === "completed") return styles.statusCompleted;
  if (value === "cancelled") return styles.statusCancelled;

  return styles.statusUpcoming;
}

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const counts = useMemo(() => {
    return bookings.reduce(
      (acc, booking) => {
        const status = normalizeStatus(booking.status);
        if (acc[status] !== undefined) acc[status] += 1;
        return acc;
      },
      { upcoming: 0, completed: 0, cancelled: 0 },
    );
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => normalizeStatus(booking.status) === activeTab);
  }, [activeTab]);

  return (
    <div className={styles.pageContent}>
      <header className={styles.header}>
        <div>
          <h1>My Bookings</h1>
          <p>View and manage your upcoming and previous trips.</p>
        </div>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.tabs} aria-label="Booking status filters">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <Icon />
                <span>{tab.label}</span>
                <strong>{counts[tab.key]}</strong>
              </button>
            );
          })}
        </div>

        <label className={styles.sortControl}>
          <FiFilter />
          <span>Sort by:</span>
          <select defaultValue="date">
            <option value="date">Travel Date</option>
            <option value="price">Price</option>
            <option value="status">Status</option>
          </select>
        </label>
      </div>

      <section className={styles.card}>
        {filteredBookings.length === 0 ? (
          <div className={styles.emptyState}>
            <FiCalendar />
            <h3>No bookings yet</h3>
            <p>
              Your {activeTab} bookings will appear here once you book a tour through Nefru.
            </p>
          </div>
        ) : (
          <div className={styles.bookingList}>
            {filteredBookings.map((booking) => (
              <article key={booking.id || booking.title} className={styles.bookingCard}>
                <div className={styles.bookingImageWrap}>
                  {booking.image ? (
                    <img src={booking.image} alt={booking.title} />
                  ) : (
                    <div className={styles.bookingImageFallback}>Nefru</div>
                  )}
                </div>

                <div className={styles.bookingMainInfo}>
                  <h2>{booking.title}</h2>
                  <p>Guide: <strong>{booking.guide}</strong></p>
                  <div className={styles.bookingMetaRow}>
                    <span><FiCalendar /> {booking.date}</span>
                    <span><FiMapPin /> {booking.location}</span>
                    <span><FiUsers /> {booking.travelers} Travelers</span>
                    <span><FiClock /> {booking.duration}</span>
                  </div>
                </div>

                <div className={styles.bookingSideInfo}>
                  <span className={`${styles.statusBadge} ${getStatusClass(booking.status)}`}>
                    {booking.status}
                  </span>
                  <strong>{booking.price}</strong>
                  <small>Total Price</small>
                  <button type="button" className={styles.outlineButton}>View Details</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
