import { useEffect, useState } from "react";
import { FaApplePay, FaGooglePay, FaPaypal } from "react-icons/fa";
import { FiArrowRight, FiCreditCard, FiLock } from "react-icons/fi";

import { apiRequest, resolveMediaUrl } from "../../../services/api";
import styles from "../Checkout.module.css";

export default function PaymentMethodStep({ bookingData, onNext }) {
  const [selected, setSelected] = useState("new_card");
  const [cards, setCards] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/payments/methods")
      .then((response) => {
        const methods = response?.data?.methods || [];
        setCards(methods);
        const defaultCard = methods.find((card) => card.isDefault);
        if (defaultCard) setSelected(defaultCard.id);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  const methods = [
    ...cards.map((card) => ({ id: card.id, name: `${card.brand.toUpperCase()} ending ${card.last4}`, sub: `Expires ${card.expMonth}/${card.expYear}`, icon: <FiCreditCard /> })),
    { id: "new_card", name: "Credit / Debit Card", sub: "Use a new card", icon: <FiCreditCard /> },
  ];
  const soon = [
    { id: "apple", name: "Apple Pay", icon: <FaApplePay /> },
    { id: "google", name: "Google Pay", icon: <FaGooglePay /> },
    { id: "paypal", name: "PayPal", icon: <FaPaypal /> },
  ];

  return (
    <div className={styles.content}>
      <div className={styles.stepTitleContainer}><h3 className={styles.stepTitle}>Payment method</h3></div>
      <div className={styles.miniSummary}>
        <img src={resolveMediaUrl(bookingData.image)} alt={bookingData.title} className={styles.miniThumb} />
        <div><h5 className={styles.miniTitle}>{bookingData.title}</h5><p className={styles.miniMeta}>One traveler · {bookingData.date}</p></div>
        <div className={styles.miniPrice}>${bookingData.totalAmount.toFixed(2)}</div>
      </div>
      <div className={styles.methodsList}>
        {methods.map((method) => (
          <button type="button" key={method.id} className={`${styles.methodCard} ${selected === method.id ? styles.methodCardSelected : ""}`} onClick={() => setSelected(method.id)}>
            <span className={styles.methodLeft}><span className={styles.methodIconBadge}>{method.icon}</span><span><span className={styles.methodName}>{method.name}</span><span className={styles.methodSub}>{method.sub}</span></span></span>
            <span className={`${styles.radioCircle} ${selected === method.id ? styles.radioCircleSelected : ""}`}>{selected === method.id && <span className={styles.radioDot} />}</span>
          </button>
        ))}
        {soon.map((method) => (
          <div key={method.id} className={styles.methodCard} aria-disabled="true" style={{ opacity: .55, cursor: "not-allowed" }}>
            <span className={styles.methodLeft}><span className={styles.methodIconBadge}>{method.icon}</span><span><span className={styles.methodName}>{method.name}</span><span className={styles.methodSub}>Soon</span></span></span>
          </div>
        ))}
      </div>
      {error && <div className={styles.cancellationNote}>{error}</div>}
      <div className={styles.securityBanner}><FiLock /> Stripe-secured card payment</div>
      <button className={styles.mainBtn} onClick={() => onNext(selected)}>Continue <FiArrowRight /></button>
    </div>
  );
}
