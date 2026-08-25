import { FiCheck, FiDollarSign, FiGlobe, FiLock } from "react-icons/fi";

import DesktopNavbar from "../Home/components/DesktopNavbar/DesktopNavbar";
import styles from "./Settings.module.css";

export default function Settings() {
  return (
    <>
      <DesktopNavbar />
      <main className={styles.page}>
        <header><span>Preferences</span><h1>Settings</h1><p>Control how Nefru displays your travel experience.</p></header>
        <section className={styles.card}>
          <div className={styles.title}><FiGlobe /><div><h2>Currency</h2><p>All trip prices and payments currently use US dollars.</p></div></div>
          <div className={styles.options}>
            <div className={styles.active}><FiDollarSign /><span><strong>USD — US Dollar</strong><small>Display and payment currency</small></span><FiCheck /></div>
            <div className={styles.soon}><span><strong>EGP — Egyptian Pound</strong><small>Currency conversion</small></span><b>Soon</b></div>
            <div className={styles.soon}><span><strong>EUR — Euro</strong><small>Currency conversion</small></span><b>Soon</b></div>
          </div>
          <p className={styles.note}><FiLock /> The amount displayed in USD is the exact amount sent to Stripe at checkout.</p>
        </section>
      </main>
    </>
  );
}
