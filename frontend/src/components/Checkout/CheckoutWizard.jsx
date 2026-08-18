import React, { useState } from "react";
import styles from "./Checkout.module.css";
import { FiArrowLeft, FiMoreVertical } from "react-icons/fi";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// استدعاء مكونات الخطوات الأربع
import BookingSummaryStep from "./Steps/BookingSummaryStep";
import PaymentMethodStep from "./Steps/PaymentMethodStep";
import CardDetailsStep from "./Steps/CardDetailsStep";
import PaymentSuccessStep from "./Steps/PaymentSuccessStep";

// تهيئة كبسولة Stripe للـ React (سنستخدم المفتاح العام المصرح به)
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_mock_publishable_key"
);

/**
 * 🚀 المكون الرئيسي لمسار الدفع المكتمل (Checkout Wizard)
 * يقود عملية الانتقال بين الخطوات الأربع (1. الملخص -> 2. وسيلة الدفع -> 3. البيانات والبطاقة البلاتينية -> 4. النجاح)
 */
export default function CheckoutWizard({ initialData }) {
  // رقم الخطوة الحالية (من 1 إلى 4)
  const [currentStep, setCurrentStep] = useState(1);

  // حفظ بيانات الحجز ووسيلة الدفع المختارة
  const [bookingState, setBookingState] = useState({
    bookingId: initialData?.bookingId || "NF-8829-Luxor",
    title: initialData?.title || "Giza Pyramids Private Trip",
    date: initialData?.date || "Oct 24, 2023",
    time: initialData?.time || "09:00 AM",
    adults: initialData?.adults || 2,
    baseRate: initialData?.baseRate || 2400.0,
    guideFee: initialData?.guideFee || 450.0,
    transportFee: initialData?.transportFee || 300.0,
    totalAmount: initialData?.totalAmount || 3150.0,
    currency: initialData?.currency || "EGP",
    currencySymbol: initialData?.currencySymbol || "ج.م",
    paymentMethod: "card",
  });

  // التحكم بالرجوع للخطوة السابقة
  const handleBack = () => {
    if (currentStep > 1 && currentStep < 4) {
      setCurrentStep((prev) => prev - 1);
    } else {
      window.history.back();
    }
  };

  // نسبة اكتمال شريط التقدم
  const progressPercent = (currentStep / 4) * 100;

  return (
    <div className={styles.checkoutWrapper}>
      <div className={styles.checkoutCard}>
        {/* 1. الهيدر العلوي */}
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={handleBack} aria-label="Back">
            <FiArrowLeft />
          </button>
          
          <h2 className={styles.headerTitle}>
            {currentStep === 4 ? "نجاح" : "Nefru"}
          </h2>

          <div style={{ width: 36, textAlign: "right" }}>
            {currentStep === 3 && <FiMoreVertical style={{ color: "#64748b" }} />}
          </div>
        </div>

        {/* 2. شريط التقدم بين الخطوات */}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* 3. عرض الخطوة الحالية داخل كبسولة Stripe Elements */}
        <Elements stripe={stripePromise}>
          {currentStep === 1 && (
            <BookingSummaryStep
              bookingData={bookingState}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <PaymentMethodStep
              bookingData={bookingState}
              onNext={(selectedMethod) => {
                setBookingState((prev) => ({ ...prev, paymentMethod: selectedMethod }));
                setCurrentStep(3);
              }}
            />
          )}

          {currentStep === 3 && (
            <CardDetailsStep
              bookingData={bookingState}
              onSuccess={(result) => {
                setBookingState((prev) => ({
                  ...prev,
                  bookingId: result?.bookingId || prev.bookingId,
                }));
                setCurrentStep(4);
              }}
            />
          )}

          {currentStep === 4 && (
            <PaymentSuccessStep bookingData={bookingState} />
          )}
        </Elements>
      </div>
    </div>
  );
}
