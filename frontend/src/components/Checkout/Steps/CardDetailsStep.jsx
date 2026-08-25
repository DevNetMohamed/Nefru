import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { FiArrowRight, FiCheckCircle, FiCreditCard, FiShield, FiUser } from "react-icons/fi";

import { apiRequest } from "../../../services/api";
import styles from "../Checkout.module.css";

export default function CardDetailsStep({ bookingData, stripeConfigured, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardHolder, setCardHolder] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isSavedCard = bookingData.paymentMethodId?.startsWith("pm_");

  const verify = async () => {
    await apiRequest("/payments/verify", {
      method: "POST",
      body: JSON.stringify({ bookingId: bookingData.bookingId }),
    });
    onSuccess();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripeConfigured || !stripe) {
      setErrorMessage("Stripe is not configured. Add VITE_STRIPE_PUBLISHABLE_KEY to continue.");
      return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      if (isSavedCard) {
        const response = await apiRequest("/payments/pay-with-saved-card", {
          method: "POST",
          body: JSON.stringify({ bookingId: bookingData.bookingId, paymentMethodId: bookingData.paymentMethodId }),
        });
        if (response.data.status === "succeeded") {
          await verify();
          return;
        }
        if (["requires_action", "requires_confirmation"].includes(response.data.status)) {
          const result = await stripe.confirmCardPayment(response.data.clientSecret);
          if (result.error) throw new Error(result.error.message);
          await verify();
          return;
        }
        throw new Error("The saved card payment could not be completed.");
      }

      const cardElement = elements?.getElement(CardElement);
      if (!cardElement) throw new Error("Card details are not ready yet.");
      const response = await apiRequest("/payments/create-intent", {
        method: "POST",
        body: JSON.stringify({ bookingId: bookingData.bookingId, saveCard }),
      });
      if (response.data.status === "succeeded") {
        await verify();
        return;
      }
      const result = await stripe.confirmCardPayment(response.data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: cardHolder.trim() || "Nefru Traveler" },
        },
      });
      if (result.error) throw new Error(result.error.message);
      if (result.paymentIntent?.status !== "succeeded") throw new Error("Payment was not completed.");
      await verify();
    } catch (error) {
      setErrorMessage(error.message || "Payment could not be completed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.content} onSubmit={handleSubmit}>
      <div className={styles.stepTitleContainer}><h3 className={styles.stepTitle}>{isSavedCard ? "Confirm saved card" : "Card details"}</h3></div>
      <div className={styles.securityBanner}><FiShield /> Secure Stripe payment · ${bookingData.totalAmount.toFixed(2)} USD</div>
      {isSavedCard ? (
        <div className={styles.priceBox}>
          <div className={styles.priceRowTotal}><span><FiCreditCard /> Saved card</span><span className={styles.priceTotalValue}>Ready to pay</span></div>
          <p style={{ marginTop: 12, color: "#64748b", fontSize: 13 }}>Your default billing details stored securely by Stripe will be used.</p>
        </div>
      ) : (
        <>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="cardholder">Cardholder name</label>
            <div className={styles.inputWrap}><FiUser className={styles.inputIcon} /><input id="cardholder" className={styles.inputField} value={cardHolder} onChange={(event) => setCardHolder(event.target.value)} placeholder="Name on card" required /></div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Card number and details</label>
            <div className={styles.stripeCardContainer}>
              <CardElement options={{ style: { base: { fontSize: "15px", color: "#0f172a", "::placeholder": { color: "#94a3b8" } }, invalid: { color: "#be123c" } } }} />
            </div>
          </div>
          <label className={styles.toggleRow}>
            <span className={styles.toggleLabel}>Save card for future trips</span>
            <input type="checkbox" checked={saveCard} onChange={(event) => setSaveCard(event.target.checked)} />
          </label>
        </>
      )}
      {errorMessage && <div className={styles.cancellationNote} style={{ color: "#be123c" }}>{errorMessage}</div>}
      <button className={styles.mainBtn} type="submit" disabled={loading}>
        {loading ? "Processing securely..." : <>Confirm and pay ${bookingData.totalAmount.toFixed(2)} <FiArrowRight /></>}
      </button>
      <div className={styles.badgesRow}><span><FiCheckCircle /> USD</span><span>Stripe secured</span><span>No hidden fees</span></div>
    </form>
  );
}
