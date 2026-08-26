import styles from "./KpiCard.module.css";

// Small stat card used at the top of admin pages.
// accent: any CSS color for the left bar (defaults to the admin gold).
export default function KpiCard({ label, counter, accent }) {
  return (
    <div className={styles.card} style={accent ? { "--accent": accent } : undefined}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{counter}</p>
    </div>
  );
}
