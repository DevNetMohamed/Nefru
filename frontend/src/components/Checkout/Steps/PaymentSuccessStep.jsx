import { FiArrowRight, FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { resolveMediaUrl } from "../../../services/api";
import styles from "../Checkout.module.css";

export default function PaymentSuccessStep({ bookingData }) {
  const navigate = useNavigate();
  return (
    <div className={styles.content}>
      <div className={styles.successContainer}>
        <div className={styles.successCheckBadge}><FiCheck /></div>
        <div><h2 className={styles.successHeading}>Payment successful</h2><p className={styles.successSub}>Your place is confirmed and now appears in Upcoming bookings.</p></div>
        <div className={styles.ticketCard}>
          <div className={styles.ticketRow}><span>BOOKING ID</span><span className={styles.ticketId}>{bookingData.bookingId}</span></div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", textAlign: "left" }}>
            <img src={resolveMediaUrl(bookingData.image)} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover" }} />
            <div><div style={{ fontSize: ".88rem", fontWeight: 700 }}>{bookingData.title}</div><div style={{ fontSize: ".75rem", color: "#64748b" }}>{bookingData.date} · One traveler</div></div>
          </div>
        </div>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          <button className={styles.mainBtn} onClick={() => navigate("/user/profile/bookings")}>Go to My Bookings <FiArrowRight /></button>
          <button className={styles.secondaryBtn} onClick={() => navigate("/user/home")}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}
