import { FiArrowRight, FiCalendar, FiInfo, FiUser } from "react-icons/fi";

import { resolveMediaUrl } from "../../../services/api";
import styles from "../Checkout.module.css";

export default function BookingSummaryStep({ bookingData, onNext, expired }) {
  return (
    <div className={styles.content}>
      <div className={styles.stepTitleContainer}><h3 className={styles.stepTitle}>Booking summary</h3><div className={styles.stepTitleDecoration} /></div>
      <div className={styles.tourBannerOverlay}>
        <img src={resolveMediaUrl(bookingData.image)} alt={bookingData.title} className={styles.tourBanner} />
        <span className={styles.tourBannerTag}>One traveler</span>
        <h4 className={styles.tourBannerTitle}>{bookingData.title}</h4>
      </div>
      <div className={styles.infoGrid}>
        <div className={styles.infoBox}><FiCalendar className={styles.infoIcon} /><div><div className={styles.infoLabel}>Schedule</div><div className={styles.infoValue}>{bookingData.date}</div><div className={styles.infoSub}>{bookingData.startTime}</div></div></div>
        <div className={styles.infoBox}><FiUser className={styles.infoIcon} /><div><div className={styles.infoLabel}>Traveler</div><div className={styles.infoValue}>Account holder</div><div className={styles.infoSub}>One reserved place</div></div></div>
      </div>
      <div className={styles.priceBox}>
        <div className={styles.priceHeader}>Price details</div>
        <div className={styles.priceRow}><span>Trip price</span><span>${bookingData.totalAmount.toFixed(2)}</span></div>
        <div className={styles.priceRowTotal}><span>Total amount</span><span className={styles.priceTotalValue}>${bookingData.totalAmount.toFixed(2)} USD</span></div>
      </div>
      <div className={styles.cancellationNote}><FiInfo /><span>You can cancel before the trip starts. Automatic refunds are not available yet.</span></div>
      <button className={styles.mainBtn} onClick={onNext} disabled={expired}>Proceed to payment (${bookingData.totalAmount.toFixed(2)}) <FiArrowRight /></button>
    </div>
  );
}
