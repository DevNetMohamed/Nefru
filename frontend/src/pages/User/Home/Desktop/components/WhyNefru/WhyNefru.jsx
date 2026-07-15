import styles from "./WhyNefru.module.css";
import {
  ShieldCheck,
  CalendarCheck,
  CreditCard,
  Users,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Guides",
    description:
      "Every guide is reviewed and approved to ensure trusted experiences.",
  },
  {
    icon: CalendarCheck,
    title: "Instant Booking",
    description:
      "Reserve tours quickly with real-time availability and confirmations.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Protected payment process with reliable booking management.",
  },
  {
    icon: Users,
    title: "Local Experts",
    description:
      "Discover Egypt through experienced guides who know it best.",
  },
];

const WhyNefru = () => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>Why Choose Nefru?</h2>

        <p>
          Designed to connect travelers with authentic
          Egyptian experiences.
        </p>
      </div>

      <div className={styles.grid}>
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className={styles.card}
            >
              <div className={styles.icon}>
                <Icon size={30} />
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhyNefru;