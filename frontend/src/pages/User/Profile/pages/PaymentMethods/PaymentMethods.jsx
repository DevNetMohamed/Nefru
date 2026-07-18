import {
  FiCreditCard,
  FiLock,
  FiPlus,
  FiShield,
  FiTrash2,
} from "react-icons/fi";

import styles from "../ProfilePageShared.module.css";

// Replace this array with backend/payment provider data when payment methods are ready.
const paymentMethods = [];

export default function PaymentMethods() {
  return (
    <div className={styles.pageContent}>
      <header className={styles.header}>
        <div>
          <h1>Payment Methods</h1>
          <p>Manage your saved cards and payment preferences.</p>
        </div>
      </header>

      <div className={styles.twoColumnLayout}>
        <section className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <div className={styles.cardTitleCompact}>
              <FiCreditCard />
              <div>
                <h2>Saved Cards</h2>
                <p>Cards used for booking and payment.</p>
              </div>
            </div>

            <button type="button" className={styles.outlineButton}>
              <FiPlus />
              Add New Card
            </button>
          </div>

          {paymentMethods.length === 0 ? (
            <div className={styles.emptyState}>
              <FiCreditCard />
              <h3>No payment methods yet</h3>
              <p>Your saved cards will appear here after you add a payment method.</p>
            </div>
          ) : (
            <div className={styles.paymentList}>
              {paymentMethods.map((card) => (
                <article key={card.id} className={styles.paymentCard}>
                  <div>
                    <span className={styles.cardBrand}>{card.brand}</span>
                    <h3>**** **** **** {card.last4}</h3>
                    <p>{card.holderName}</p>
                  </div>

                  <div className={styles.paymentActions}>
                    {card.isDefault && <span className={styles.defaultBadge}>Default</span>}
                    <button type="button" aria-label="Remove card">
                      <FiTrash2 />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className={styles.infoPanel}>
          <div className={styles.infoPanelIcon}>
            <FiShield />
          </div>
          <h2>Secure Payments</h2>
          <p>
            Your payment information is protected and will be handled securely when payment
            integration is connected.
          </p>

          <ul className={styles.infoList}>
            <li><FiLock /> Encrypted payment data</li>
            <li><FiShield /> Secure checkout experience</li>
            <li><FiCreditCard /> No hidden fees before booking</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
