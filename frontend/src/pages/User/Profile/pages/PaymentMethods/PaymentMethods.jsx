import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCallback, useEffect, useState } from "react";
import { FiCreditCard, FiLock, FiPlus, FiShield, FiTrash2 } from "react-icons/fi";

import { apiRequest } from "../../../../../services/api";
import styles from "../ProfilePageShared.module.css";

const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = key ? loadStripe(key) : Promise.resolve(null);

function PaymentMethodsContent() {
  const stripe = useStripe();
  const elements = useElements();
  const [methods, setMethods] = useState([]);
  const [adding, setAdding] = useState(false);
  const [holderName, setHolderName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest("/payments/methods");
      setMethods(response?.data?.methods || []);
    } catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const addCard = async (event) => {
    event.preventDefault();
    if (!stripe || !key) { setError("Stripe is not configured."); return; }
    const card = elements.getElement(CardElement);
    setSaving(true); setError("");
    try {
      const setup = await apiRequest("/payments/methods/setup-intent", { method: "POST" });
      const result = await stripe.confirmCardSetup(setup.data.clientSecret, {
        payment_method: { card, billing_details: { name: holderName.trim() || "Nefru Traveler" } },
      });
      if (result.error) throw new Error(result.error.message);
      await apiRequest(`/payments/methods/${result.setupIntent.payment_method}/default`, { method: "PATCH" });
      setAdding(false); setHolderName(""); await load();
    } catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("Remove this saved card?")) return;
    await apiRequest(`/payments/methods/${id}`, { method: "DELETE" });
    await load();
  };

  const makeDefault = async (id) => {
    await apiRequest(`/payments/methods/${id}/default`, { method: "PATCH" });
    await load();
  };

  return (
    <div className={styles.pageContent}>
      <header className={styles.header}><div><h1>Payment Methods</h1><p>Cards are stored securely by Stripe, not on Nefru servers.</p></div></header>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.twoColumnLayout}>
        <section className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <div className={styles.cardTitleCompact}><FiCreditCard /><div><h2>Saved Cards</h2><p>Select a default card for future bookings.</p></div></div>
            <button type="button" className={styles.outlineButton} onClick={() => setAdding((value) => !value)}><FiPlus /> Add New Card</button>
          </div>
          {adding && (
            <form onSubmit={addCard} className={styles.card} style={{ boxShadow: "none", marginBottom: 18 }}>
              <label className={styles.fieldBox}><span>Cardholder name</span><input value={holderName} onChange={(event) => setHolderName(event.target.value)} required /></label>
              <div className={styles.fieldBox} style={{ marginTop: 14 }}><span>Card details</span><div style={{ minHeight: 52, border: "1px solid var(--color-border-strong)", borderRadius: 10, padding: "16px", background: "white" }}><CardElement /></div></div>
              <div className={styles.actions}><button type="submit" className={styles.primaryButton} disabled={saving}>{saving ? "Saving..." : "Save as default"}</button></div>
            </form>
          )}
          {loading ? <div className={styles.emptyState}>Loading cards...</div> : methods.length === 0 ? (
            <div className={styles.emptyState}><div className={styles.emptyStateIcon}><FiCreditCard /></div><h3>No saved cards yet</h3><p>Save a card during checkout or add one here.</p></div>
          ) : (
            <div className={styles.paymentList}>
              {methods.map((card) => (
                <article key={card.id} className={styles.paymentCard}>
                  <div><span className={styles.cardBrand}>{card.brand}</span><h3>•••• •••• •••• {card.last4}</h3><p>{card.holderName} · Expires {card.expMonth}/{card.expYear}</p></div>
                  <div className={styles.paymentActions}>
                    {card.isDefault ? <span className={styles.defaultBadge}>Default</span> : <button type="button" className={styles.outlineButton} style={{ width: "auto", color: "var(--color-primary-dark)", background: "white" }} onClick={() => makeDefault(card.id)}>Make default</button>}
                    <button type="button" aria-label="Remove card" onClick={() => remove(card.id)}><FiTrash2 /></button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
        <aside className={styles.infoPanel}><div className={styles.infoPanelIcon}><FiShield /></div><h2>Secure Payments</h2><p>Nefru only receives card brand, expiry, and last four digits from Stripe.</p><ul className={styles.infoList}><li><FiLock /> Stripe tokenized card data</li><li><FiShield /> Secure future checkout</li><li><FiCreditCard /> USD payments only</li></ul></aside>
      </div>
    </div>
  );
}

export default function PaymentMethods() {
  return <Elements stripe={stripePromise}><PaymentMethodsContent /></Elements>;
}
