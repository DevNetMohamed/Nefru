import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiCalendar, FiClock, FiLock, FiMapPin, FiUser } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import { apiRequest, resolveMediaUrl } from "../../../../services/api";
import styles from "./Book.module.css";

function formatDate(dateKey) {
  return new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function Book() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedOccurrence, setSelectedOccurrence] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest(`/bookings/trips/${id}/availability`)
      .then((response) => {
        if (!active) return;
        const next = response?.data;
        setData(next);
        const firstDate = next?.schedule?.dates?.[0] || "";
        setSelectedDate(firstDate);
        setSelectedOccurrence(next?.schedule?.slotsByDate?.[firstDate]?.find((slot) => slot.bookable)?.occurrenceKey || "");
      })
      .catch((requestError) => active && setError(requestError.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id]);

  const slots = useMemo(
    () => data?.schedule?.slotsByDate?.[selectedDate] || [],
    [data, selectedDate],
  );

  const selectDate = (date) => {
    setSelectedDate(date);
    setSelectedOccurrence(data?.schedule?.slotsByDate?.[date]?.find((slot) => slot.bookable)?.occurrenceKey || "");
  };

  const createBooking = async () => {
    if (!selectedOccurrence) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await apiRequest("/bookings", {
        method: "POST",
        body: JSON.stringify({ tripId: id, occurrenceKey: selectedOccurrence, specialRequest }),
      });
      navigate(`/user/profile/bookings`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <main className={styles.statePage}>Loading available dates...</main>;
  if (!data) return <main className={styles.statePage}>{error || "Trip availability is unavailable."}</main>;

  const trip = data.trip;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <button type="button" onClick={() => navigate(-1)} aria-label="Back"><FiArrowLeft /></button>
        <div><span>Book your place</span><h1>{trip.title}</h1></div>
      </header>

      <div className={styles.layout}>
        <section className={styles.bookingPanel}>
          <div className={styles.tripSummary}>
            <img src={resolveMediaUrl(trip.image)} alt={trip.title} />
            <div>
              <h2>{trip.title}</h2>
              <p>{trip.description}</p>
              <div className={styles.meta}>
                <span><FiMapPin /> {trip.location}</span>
                <span><FiClock /> {trip.duration}</span>
              </div>
            </div>
          </div>

          <section className={styles.section}>
            <div className={styles.sectionHeading}><FiCalendar /><div><h2>Select a date</h2><p>Only dates published by the guide are available.</p></div></div>
            {data.schedule.dates.length ? (
              <div className={styles.dateGrid}>
                {data.schedule.dates.map((date) => (
                  <button key={date} type="button" className={selectedDate === date ? styles.selected : ""} onClick={() => selectDate(date)}>
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            ) : <p className={styles.empty}>No future dates are available.</p>}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeading}><FiClock /><div><h2>Select a time</h2><p>One account reserves one place.</p></div></div>
            <div className={styles.slotGrid}>
              {slots.map((slot) => (
                <button
                  key={slot.occurrenceKey}
                  type="button"
                  disabled={!slot.bookable}
                  className={selectedOccurrence === slot.occurrenceKey ? styles.selected : ""}
                  onClick={() => setSelectedOccurrence(slot.occurrenceKey)}
                >
                  <strong>{slot.startTime} – {slot.endTime}</strong>
                  <span>{slot.availableSpots} of {slot.capacity} places left</span>
                </button>
              ))}
            </div>
          </section>

          <label className={styles.requestField}>
            <span>Special request <small>(optional)</small></span>
            <textarea value={specialRequest} maxLength={500} onChange={(event) => setSpecialRequest(event.target.value)} placeholder="Accessibility, meeting, or other useful information for your guide" />
          </label>
        </section>

        <aside className={styles.pricePanel}>
          <span className={styles.priceLabel}>Price for your place</span>
          <strong className={styles.price}>${Number(trip.price).toFixed(2)} USD</strong>
          <div className={styles.priceRow}><span>Traveler</span><span><FiUser /> Account holder</span></div>
          <div className={styles.total}><span>Total</span><strong>${Number(trip.price).toFixed(2)}</strong></div>
          <p className={styles.holdNote}><FiLock /> Your place will be held for {data.holdMinutes} minutes while you pay.</p>
          {error && <p className={styles.error}>{error}</p>}
          <button type="button" className={styles.continueButton} disabled={!selectedOccurrence || submitting} onClick={createBooking}>
            {submitting ? "Holding your place..." : "Continue to payment"}
          </button>
        </aside>
      </div>
    </main>
  );
}
