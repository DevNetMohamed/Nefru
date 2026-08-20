import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Check,
  CircleCheck,
  FileSearch,
  LayoutDashboard,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import styles from "./GuideApplicationReceived.module.css";

export default function GuideApplicationReceived() {
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.auth);
  const status = profile?.verificationStatus || "pending";

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="application-received-title">
        <div className={styles.successMark} aria-hidden="true">
          <span />
          <Check />
        </div>

        <p className={styles.eyebrow}>
          <CalendarClock size={16} /> {status === "pending" ? "Pending review" : status}
        </p>
        <h1 id="application-received-title">Application received</h1>
        <p className={styles.intro}>
          Your documents were submitted successfully. You are still signed in,
          and this page remains inside your guide workspace while the Nefru team reviews them.
        </p>

        <div className={styles.steps}>
          <div><FileSearch /><span><strong>Document review</strong><small>We review your identity and guide details.</small></span></div>
          <div><CircleCheck /><span><strong>Status update</strong><small>You will receive an email and in-app notification.</small></span></div>
          <div><BadgeCheck /><span><strong>Approval</strong><small>Publishing tours unlocks after approval.</small></span></div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.secondaryButton} onClick={() => navigate("/guide/verification")}>
            View application <ArrowRight size={17} />
          </button>
          <button type="button" className={styles.primaryButton} onClick={() => navigate("/guide/dashboard")}>
            <LayoutDashboard size={17} /> Guide dashboard
          </button>
        </div>
      </section>
    </main>
  );
}
