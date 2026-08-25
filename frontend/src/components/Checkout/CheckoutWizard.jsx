import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";

import styles from "./Checkout.module.css";
import BookingSummaryStep from "./Steps/BookingSummaryStep";
import CardDetailsStep from "./Steps/CardDetailsStep";
import PaymentMethodStep from "./Steps/PaymentMethodStep";
import PaymentSuccessStep from "./Steps/PaymentSuccessStep";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : Promise.resolve(null);

export default function CheckoutWizard({ initialData }) {
  const [currentStep, setCurrentStep] = useState(
    ["confirmed", "completed"].includes(initialData.status) ? 4 : 1,
  );
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [bookingState, setBookingState] = useState({
    ...initialData,
    bookingId: initialData.bookingId || initialData.id,
    totalAmount: Number(initialData.totalPrice || initialData.price || 0),
    currency: "USD",
    paymentMethodId: "new_card",
  });

  useEffect(() => {
    const update = () => {
      const expiresAt = new Date(initialData.holdExpiresAt).getTime();
      setRemainingSeconds(Number.isFinite(expiresAt) ? Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)) : 0);
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [initialData.holdExpiresAt]);

  const countdown = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    return `${minutes}:${String(remainingSeconds % 60).padStart(2, "0")}`;
  }, [remainingSeconds]);

  const handleBack = () => {
    if (currentStep > 1 && currentStep < 4) setCurrentStep((step) => step - 1);
    else window.history.back();
  };

  return (
    <div className={styles.checkoutWrapper}>
      <div className={styles.checkoutCard}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={handleBack} aria-label="Back"><FiArrowLeft /></button>
          <h2 className={styles.headerTitle}>{currentStep === 4 ? "Confirmed" : `Secure checkout · ${countdown}`}</h2>
          <div style={{ width: 36 }} />
        </div>
        <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${(currentStep / 4) * 100}%` }} /></div>
        <Elements stripe={stripePromise}>
          {currentStep === 1 && <BookingSummaryStep bookingData={bookingState} onNext={() => setCurrentStep(2)} expired={remainingSeconds <= 0} />}
          {currentStep === 2 && (
            <PaymentMethodStep
              bookingData={bookingState}
              onNext={(paymentMethodId) => {
                setBookingState((current) => ({ ...current, paymentMethodId }));
                setCurrentStep(3);
              }}
            />
          )}
          {currentStep === 3 && (
            <CardDetailsStep
              bookingData={bookingState}
              stripeConfigured={Boolean(publishableKey)}
              onSuccess={() => setCurrentStep(4)}
            />
          )}
          {currentStep === 4 && <PaymentSuccessStep bookingData={bookingState} />}
        </Elements>
      </div>
    </div>
  );
}
