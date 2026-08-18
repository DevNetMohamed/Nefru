import React from "react";
import styles from "../Checkout.module.css";
import { FiCheck, FiArrowRight, FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

/**
 * 📍 الشاشة الرابعة: نجاح العملية (Payment Successful)
 * تعرض شاشة التهنئة وتفاصيل الحجز المكتمل مع زر الانتقال للحجوزات أو الرئيسية
 */
export default function PaymentSuccessStep({ bookingData }) {
  const navigate = useNavigate();

  const bookingId = bookingData?.bookingId || "NF-8829-Luxor";
  const title = bookingData?.title || "Private Trip: Valley of the Kings";
  const date = bookingData?.date || "Oct 14, 2023";
  const travelers = bookingData?.adults || 2;

  return (
    <div className={styles.content}>
      <div className={styles.successContainer}>
        {/* 1. علامة الصح التفاعلية المتوهجة */}
        <div className={styles.successCheckBadge}>
          <FiCheck />
        </div>

        {/* 2. نصوص التهنئة */}
        <div>
          <h2 className={styles.successHeading}>Payment Successful</h2>
          <p className={styles.successSub}>
            Your journey through history begins now.
          </p>
        </div>

        {/* 3. بطاقة تذكرة الحجز المكتمل */}
        <div className={styles.ticketCard}>
          <div className={styles.ticketRow}>
            <span style={{ color: "#64748b", fontWeight: 600 }}>BOOKING ID</span>
            <span className={styles.ticketId}>{bookingId}</span>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", textAlign: "left" }}>
            <img
              src="https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=120&q=80"
              alt="Trip"
              style={{ width: "48px", height: "48px", borderRadius: "10px", objectFit: "cover" }}
            />
            <div>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>
                {title}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                {date} • {travelers} Adults
              </div>
            </div>
          </div>
        </div>

        {/* 4. أزرار التنقل السريعة */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
          <button
            className={styles.mainBtn}
            onClick={() => navigate("/user/profile/bookings")}
          >
            Go to My Bookings <FiArrowRight />
          </button>

          <button
            className={styles.secondaryBtn}
            onClick={() => navigate("/user/home")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
