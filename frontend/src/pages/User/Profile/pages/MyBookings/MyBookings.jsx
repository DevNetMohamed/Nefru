import { useCallback, useEffect, useMemo, useState } from "react";
import { FiCalendar, FiCheckCircle, FiClock, FiFilter, FiMapPin, FiXCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { apiRequest, resolveMediaUrl } from "../../../../../services/api";
import styles from "../ProfilePageShared.module.css";

const tabs = [
  { key: "upcoming", label: "Upcoming", icon: FiCalendar },
  { key: "completed", label: "Completed", icon: FiCheckCircle },
  { key: "cancelled", label: "Canceled", icon: FiXCircle },
];

function statusClass(group) {
  if (group === "completed") return styles.statusCompleted;
  if (group === "cancelled") return styles.statusCancelled;
  return styles.statusUpcoming;
}

function statusLabel(booking) {
  if (booking.status === "pending_payment") return "Payment pending";
  if (booking.status === "confirmed") return "Upcoming";
  if (booking.status === "cancelled") return "Canceled";
  return booking.status.replaceAll("_", " ");
}

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [sortBy, setSortBy] = useState("date");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest("/bookings/me");
      setBookings(response?.data?.bookings || []);
    } catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const counts = useMemo(() => bookings.reduce((result, booking) => {
    result[booking.statusGroup] = (result[booking.statusGroup] || 0) + 1;
    return result;
  }, { upcoming: 0, completed: 0, cancelled: 0 }), [bookings]);

  const filtered = useMemo(() => bookings
    .filter((booking) => booking.statusGroup === activeTab)
    .sort((a, b) => sortBy === "price" ? Number(b.totalPrice) - Number(a.totalPrice) : String(a.date).localeCompare(String(b.date))), [activeTab, bookings, sortBy]);

  const cancel = async (booking) => {
    const warning = booking.paymentStatus === "paid"
      ? " Automatic refunds are not available yet."
      : "";
    if (!window.confirm(`Cancel your ${booking.title} booking?${warning}`)) return;
    try {
      await apiRequest(`/bookings/${booking.id}/cancel`, { method: "PATCH", body: JSON.stringify({ reason: "Cancelled by traveler" }) });
      await load();
    } catch (requestError) { setError(requestError.message); }
  };

  return (
    <div className={styles.pageContent}>
      <header className={styles.header}><div><h1>My Bookings</h1><p>Manage payment holds, upcoming trips, and trip history.</p></div></header>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.toolbar}>
        <div className={styles.tabs} aria-label="Booking status filters">
          {tabs.map((tab) => { const Icon = tab.icon; return <button key={tab.key} type="button" className={`${styles.tabButton} ${activeTab === tab.key ? styles.tabButtonActive : ""}`} onClick={() => setActiveTab(tab.key)}><Icon /><span>{tab.label}</span><strong>{counts[tab.key]}</strong></button>; })}
        </div>
        <label className={styles.sortControl}><FiFilter /><span>Sort by:</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="date">Travel date</option><option value="price">Price</option></select></label>
      </div>
      <section className={styles.card}>
        {loading ? <div className={styles.emptyState}>Loading bookings...</div> : filtered.length === 0 ? (
          <div className={styles.emptyState}><div className={styles.emptyStateIcon}><FiCalendar /></div><h3>No {activeTab} bookings</h3><p>Your bookings will appear here after you select an active trip and time.</p></div>
        ) : (
          <div className={styles.bookingList}>
            {filtered.map((booking) => (
              <article key={booking.id} className={styles.bookingCard}>
                <div className={styles.bookingImageWrap}>{booking.image ? <img src={resolveMediaUrl(booking.image)} alt={booking.title} /> : <div className={styles.bookingImageFallback}>Nefru</div>}</div>
                <div className={styles.bookingMainInfo}>
                  <h2>{booking.title}</h2><p>Guide: <strong>{booking.guide}</strong></p>
                  <div className={styles.bookingMetaRow}><span><FiCalendar /> {booking.date}</span><span><FiClock /> {booking.startTime}</span><span><FiMapPin /> {booking.location}</span></div>
                  {booking.cancellationReason && <p>Reason: {booking.cancellationReason}</p>}
                </div>
                <div className={styles.bookingSideInfo}>
                  <span className={`${styles.statusBadge} ${statusClass(booking.statusGroup)}`}>{statusLabel(booking)}</span>
                  <strong>${Number(booking.totalPrice).toFixed(2)}</strong><small>Total price · USD</small>
                  {booking.status === "pending_payment" && <button type="button" className={styles.primaryButton} onClick={() => navigate(`/user/bookings/${booking.id}/payment`)}>Continue payment</button>}
                  {["pending_payment", "confirmed"].includes(booking.status) && <button type="button" className={styles.dangerButton} onClick={() => cancel(booking)}>Cancel booking</button>}
                  <button type="button" className={styles.outlineButton} onClick={() => navigate(`/user/trips/info/${booking.tripId}`)}>View trip</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
