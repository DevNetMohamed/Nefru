import React, { useState } from "react";
import styles from "../Checkout.module.css";
import { FiCreditCard, FiArrowRight, FiLock } from "react-icons/fi";
import { FaApplePay, FaGooglePay, FaPaypal } from "react-icons/fa";

/**
 * 📍 الشاشة الثانية: اختيار وسيلة الدفع (Select Payment Method)
 * تتيح للمستخدم تحديد طريقة الدفع المناسبة له (بطاقة بانكية، Apple Pay، Google Pay، أو PayPal)
 */
export default function PaymentMethodStep({ bookingData, onNext }) {
  // وسيلة الدفع المحددة حالياً
  const [selectedMethod, setSelectedMethod] = useState("card");

  const totalAmount = bookingData?.totalAmount || 3150.0;
  const symbol = bookingData?.currencySymbol || "ج.م";

  // قائمة وسائل الدفع المتاحة
  const methods = [
    {
      id: "card",
      name: "Credit / Debit Card",
      sub: "Visa, Mastercard, Amex",
      icon: <FiCreditCard />,
    },
    {
      id: "apple_pay",
      name: "Apple Pay",
      sub: "Fast & Secure Check-out",
      icon: <FaApplePay style={{ fontSize: "1.6rem" }} />,
    },
    {
      id: "google_pay",
      name: "Google Pay",
      sub: "Secure Google Wallet",
      icon: <FaGooglePay style={{ fontSize: "1.6rem" }} />,
    },
    {
      id: "paypal",
      name: "PayPal",
      sub: "Pay with your PayPal account",
      icon: <FaPaypal style={{ color: "#003087" }} />,
    },
  ];

  const handleProceed = () => {
    onNext(selectedMethod);
  };

  return (
    <div className={styles.content}>
      {/* 1. عنوان المرحلة */}
      <div className={styles.stepTitleContainer}>
        <h3 className={styles.stepTitle}>طريقة الدفع</h3>
        <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
          SELECT PAYMENT METHOD
        </span>
      </div>

      {/* 2. ملخص سريع للرحلة */}
      <div className={styles.miniSummary}>
        <img
          src="https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=150&q=80"
          alt="Trip"
          className={styles.miniThumb}
        />
        <div>
          <h5 className={styles.miniTitle}>Private Giza Plateau Trip</h5>
          <p className={styles.miniMeta}>2 Travelers • Oct 14, 2023</p>
        </div>
        <div className={styles.miniPrice}>{totalAmount.toFixed(2)} {symbol}</div>
      </div>

      {/* 3. قائمة خيارات الدفع */}
      <div className={styles.methodsList}>
        {methods.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <div
              key={method.id}
              className={`${styles.methodCard} ${
                isSelected ? styles.methodCardSelected : ""
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className={styles.methodLeft}>
                <div className={styles.methodIconBadge}>{method.icon}</div>
                <div>
                  <div className={styles.methodName}>{method.name}</div>
                  <div className={styles.methodSub}>{method.sub}</div>
                </div>
              </div>

              {/* دائرة تحديد الاختيار (Radio Button) */}
              <div
                className={`${styles.radioCircle} ${
                  isSelected ? styles.radioCircleSelected : ""
                }`}
              >
                {isSelected && <div className={styles.radioDot}></div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* شريط تشفير آمن */}
      <div className={styles.securityBanner} style={{ color: "#64748b", fontSize: "0.7rem" }}>
        <FiLock /> 256-BIT SSL ENCRYPTED PAYMENT
      </div>

      {/* 4. زر المتابعة */}
      <button className={styles.mainBtn} onClick={handleProceed}>
        Pay Now <FiArrowRight />
      </button>
    </div>
  );
}
