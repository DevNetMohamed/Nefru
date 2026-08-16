import React from "react";
import styles from "../Checkout.module.css";
import { FiCalendar, FiUsers, FiInfo, FiArrowRight } from "react-icons/fi";

/**
 * 📍 الشاشة الأولى: ملخص الحجز (Booking Summary)
 * تعرض تفاصيل الرحلة المختارة والتكلفة الإجمالية وسياسة الإلغاء قبل الانتقال للدفع
 */
export default function BookingSummaryStep({ bookingData, onNext }) {
  // بيانات افتراضية إذا لم تتوفر من الصفحة السابقة
  const title = bookingData?.title || "Giza Pyramids Private Trip";
  const date = bookingData?.date || "Oct 24, 2023";
  const time = bookingData?.time || "09:00 AM";
  const adults = bookingData?.adults || 2;
  
  const symbol = bookingData?.currencySymbol || "ج.م";
  const baseRate = bookingData?.baseRate || 2400.0;
  const guideFee = bookingData?.guideFee || 450.0;
  const transportFee = bookingData?.transportFee || 300.0;
  const totalAmount = baseRate + guideFee + transportFee;

  return (
    <div className={styles.content}>
      {/* 1. عنوان الصفحة الفرعي */}
      <div className={styles.stepTitleContainer}>
        <h3 className={styles.stepTitle}>ملخص الحجز</h3>
        <div className={styles.stepTitleDecoration}></div>
      </div>

      {/* 2. صورة وكارت الرحلة */}
      <div className={styles.tourBannerOverlay}>
        <img
          src="https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=600&q=80"
          alt={title}
          className={styles.tourBanner}
        />
        <span className={styles.tourBannerTag}>Private Trip</span>
        <h4 className={styles.tourBannerTitle}>{title}</h4>
      </div>

      {/* 3. صندوق التوقيت والمسافرين */}
      <div className={styles.infoGrid}>
        <div className={styles.infoBox}>
          <FiCalendar className={styles.infoIcon} />
          <div>
            <div className={styles.infoLabel}>SCHEDULE</div>
            <div className={styles.infoValue}>{date}</div>
            <div className={styles.infoSub}>{time}</div>
          </div>
        </div>

        <div className={styles.infoBox}>
          <FiUsers className={styles.infoIcon} />
          <div>
            <div className={styles.infoLabel}>TRAVELERS</div>
            <div className={styles.infoValue}>{adults} Adults</div>
            <div className={styles.infoSub}>Private Group</div>
          </div>
        </div>
      </div>

      {/* 4. تفاصيل وتفكيك السعر (Price Details) */}
      <div className={styles.priceBox}>
        <div className={styles.priceHeader}>PRICE DETAILS</div>
        
        <div className={styles.priceRow}>
          <span>Base Rate ({adults} x {baseRate / adults} {symbol})</span>
          <span>{baseRate.toFixed(2)} {symbol}</span>
        </div>

        <div className={styles.priceRow}>
          <span>Private Guide Fee</span>
          <span>{guideFee.toFixed(2)} {symbol}</span>
        </div>

        <div className={styles.priceRow}>
          <span>Transport (Luxury SUV)</span>
          <span>{transportFee.toFixed(2)} {symbol}</span>
        </div>

        <div className={styles.priceRowTotal}>
          <span>Total Amount</span>
          <span className={styles.priceTotalValue}>{totalAmount.toFixed(2)} {symbol}</span>
        </div>
      </div>

      {/* 5. تنبيه سياسة الإلغاء */}
      <div className={styles.cancellationNote}>
        <FiInfo style={{ flexShrink: 0, marginTop: 2, fontSize: "1rem" }} />
        <span>
          Free cancellation before Oct 22. Detailed itinerary and guide contact will be sent to your email after successful payment.
        </span>
      </div>

      {/* 6. زر الانتقال للشاشة التالية */}
      <button className={styles.mainBtn} onClick={onNext}>
        Proceed to Payment ({totalAmount.toFixed(2)} {symbol}) <FiArrowRight />
      </button>
    </div>
  );
}
