import styles from "./Booking.module.css";
import Table, { BookingItem } from "../../components/Table/Table";
import KpiCard from "../../components/KpiCard/KpiCard";
import { useEffect, useState } from "react";

import { getBookings } from "../../api";

const CARD_ACCENTS = {
  total: "#B59441",
  confirmed: "#4E924D",
  completed: "#5656df",
  cancelled: "#c2372f",
};

// Read-only bookings overview: no management actions by design.
export default function Booking() {
  const [bookings, setBookings] = useState(null);

  // current page for server-side pagination
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadBookings() {
      const result = await getBookings(page);
      if (!active) return;
      if (result.error) {
        setError(result.error);
      } else {
        setBookings(result);
      }
      setLoading(false);
    }

    loadBookings();
    return () => {
      active = false;
    };
  }, [page]);

  const stats = bookings?.meta?.stats;

  return (
    <div className={styles.container}>
      {error ? (
        <p role="alert" style={{ color: "#c2372f", padding: "8px" }}>
          {error}
        </p>
      ) : null}

      <div className={styles.cardContainer}>
        <KpiCard
          label="Total Bookings"
          counter={stats?.total ?? "—"}
          accent={CARD_ACCENTS.total}
        />
        <KpiCard
          label="Confirmed"
          counter={stats?.confirmed ?? "—"}
          accent={CARD_ACCENTS.confirmed}
        />
        <KpiCard
          label="Completed"
          counter={stats?.completed ?? "—"}
          accent={CARD_ACCENTS.completed}
        />
        <KpiCard
          label="Revenue (paid)"
          counter={stats ? `$${stats.revenuePaid}` : "—"}
          accent="#0D1C2F"
        />
      </div>
      <div className={styles.layout}>
        <Table
          data={bookings}
          item={BookingItem}
          onPageChange={(newPage) => setPage(newPage)}
          isLoading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
