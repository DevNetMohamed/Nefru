import { useCallback, useEffect, useState } from "react";
import { FiBookmark, FiClock, FiMapPin, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { useSavedTrips } from "../../../context/useSavedTrips";
import { resolveMediaUrl } from "../../../services/api";
import styles from "./Saved.module.css";

export default function Saved() {
  const navigate = useNavigate();
  const { refresh, toggleSaved } = useSavedTrips();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const savedTrips = await refresh();
      setTrips(savedTrips);
    } catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }, [refresh]);
  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const remove = async (tripId) => {
    await toggleSaved(tripId);
    setTrips((current) => current.filter((trip) => String(trip.id) !== String(tripId)));
  };

  return (
    <div className={styles.page}>
      <header><div><h1>Saved Trips</h1><p>Your bookmarked Nefru experiences, available on every signed-in device.</p></div></header>
      {error && <p className={styles.error}>{error}</p>}
      {loading ? <div className={styles.empty}>Loading saved trips...</div> : trips.length === 0 ? (
        <div className={styles.empty}><FiBookmark /><h2>No saved trips yet</h2><p>Use the bookmark button on an active trip to keep it here.</p><button onClick={() => navigate("/user/recommended-trips")}>Explore trips</button></div>
      ) : (
        <div className={styles.grid}>
          {trips.map((trip) => (
            <article key={trip.id} className={styles.card} onClick={() => navigate(`/user/trips/info/${trip.id}`)}>
              <img src={resolveMediaUrl(trip.image)} alt={trip.title} />
              <div className={styles.body}>
                <span className={styles.category}>{trip.category}</span>
                <h2>{trip.title}</h2>
                <div className={styles.meta}><span><FiMapPin /> {trip.location}</span><span><FiClock /> {trip.duration}</span></div>
                <div className={styles.footer}><strong>${Number(trip.price).toFixed(2)} USD</strong><button type="button" aria-label="Remove saved trip" onClick={(event) => { event.stopPropagation(); remove(trip.id); }}><FiTrash2 /></button></div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
