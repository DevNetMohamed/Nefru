import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, MapPin, RefreshCw, UserRound, XCircle } from "lucide-react";

import { apiRequest, resolveMediaUrl } from "../../../services/api";
import styles from "./GuideBookings.module.css";

function occurrenceStart(item) {
  return item.startsAt
    ? new Date(item.startsAt)
    : new Date(`${item.date}T${String(item.startTime || "00:00").slice(0, 5)}:00`);
}

function occurrenceEnd(item) {
  return item.endsAt
    ? new Date(item.endsAt)
    : new Date(`${item.date}T${String(item.endTime || "23:59").slice(0, 5)}:00`);
}

export default function GuideBookings() {
  const [occurrences, setOccurrences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [workingKey, setWorkingKey] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiRequest("/bookings/guide/me");
      setOccurrences(response?.data?.occurrences || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const stats = useMemo(() => ({
    upcoming: occurrences.filter((item) => item.bookings.some((booking) => ["confirmed", "pending_payment"].includes(booking.status))).length,
    guests: occurrences.reduce((sum, item) => sum + item.bookings.filter((booking) => booking.status === "confirmed").length, 0),
    completed: occurrences.filter((item) => item.bookings.some((booking) => booking.status === "completed")).length,
  }), [occurrences]);

  const complete = async (item) => {
    const itemKey = `${item.tripId}:${item.occurrenceKey}`;
    setWorkingKey(itemKey);
    try {
      await apiRequest("/bookings/guide/occurrences/complete", { method: "PATCH", body: JSON.stringify({ tripId: item.tripId, occurrenceKey: item.occurrenceKey }) });
      await load();
    } catch (requestError) { setError(requestError.message); }
    finally { setWorkingKey(""); }
  };

  const cancel = async (item) => {
    const reason = window.prompt("Tell the affected travelers why this trip is cancelled:");
    if (!reason?.trim()) return;
    const itemKey = `${item.tripId}:${item.occurrenceKey}`;
    setWorkingKey(itemKey);
    try {
      await apiRequest("/bookings/guide/occurrences/cancel", { method: "PATCH", body: JSON.stringify({ tripId: item.tripId, occurrenceKey: item.occurrenceKey, reason }) });
      await load();
    } catch (requestError) { setError(requestError.message); }
    finally { setWorkingKey(""); }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div><span>Booking management</span><h1>Booked trip occurrences</h1><p>View guests, payment status, special requests, and update the whole occurrence.</p></div>
        <button type="button" onClick={load} disabled={loading}><RefreshCw size={17} /> Refresh</button>
      </header>
      <section className={styles.stats}>
        <article><CalendarDays /><span><strong>{stats.upcoming}</strong> Upcoming occurrences</span></article>
        <article><UserRound /><span><strong>{stats.guests}</strong> Confirmed travelers</span></article>
        <article><CheckCircle2 /><span><strong>{stats.completed}</strong> Completed occurrences</span></article>
      </section>
      {error && <p className={styles.error}>{error}</p>}
      {loading ? <div className={styles.empty}>Loading guide bookings...</div> : occurrences.length === 0 ? <div className={styles.empty}>No bookings have been made for your trips yet.</div> : (
        <div className={styles.list}>
          {occurrences.map((item) => {
            const itemKey = `${item.tripId}:${item.occurrenceKey}`;
            const confirmed = item.bookings.filter((booking) => booking.status === "confirmed");
            const pending = item.bookings.filter((booking) => booking.status === "pending_payment");
            const active = confirmed.length + pending.length > 0;
            const ended = occurrenceEnd(item) <= new Date();
            const started = occurrenceStart(item) <= new Date();
            return (
              <article className={styles.card} key={itemKey}>
                <div className={styles.tripHeader}>
                  <img src={resolveMediaUrl(item.image)} alt={item.title} />
                  <div className={styles.tripInfo}><h2>{item.title}</h2><p><MapPin size={14} /> {item.location}</p><div><span><CalendarDays size={14} /> {item.date}</span><span><Clock3 size={14} /> {item.startTime} – {item.endTime}</span><span><UserRound size={14} /> {confirmed.length + pending.length} / {item.capacity}</span></div></div>
                  <div className={styles.actions}>
                    <button type="button" className={styles.completeButton} disabled={!confirmed.length || !ended || workingKey === itemKey} onClick={() => complete(item)}><CheckCircle2 size={16} /> Mark completed</button>
                    <button type="button" className={styles.cancelButton} disabled={!active || started || workingKey === itemKey} onClick={() => cancel(item)}><XCircle size={16} /> Cancel occurrence</button>
                  </div>
                </div>
                <div className={styles.guestList}>
                  <div className={styles.guestHeader}><span>Traveler</span><span>Payment</span><span>Request</span><span>Price</span></div>
                  {item.bookings.map((booking) => (
                    <div className={styles.guestRow} key={booking.id}>
                      <span><strong>{booking.tourist}</strong><small>{booking.touristEmail}</small></span>
                      <span className={styles[booking.paymentStatus === "paid" ? "paid" : "pending"]}>{booking.paymentStatus}</span>
                      <span>{booking.specialRequest || "—"}</span>
                      <span><strong>${Number(booking.totalPrice).toFixed(2)}</strong><small>{booking.status.replaceAll("_", " ")}</small></span>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
