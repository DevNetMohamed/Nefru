import ApplicationReceivedCard from "../components/ApplicationReceivedCard";
import styles from "../ApplicationReceived.module.css";

export default function MobileApplicationReceived() {
  return (
    <main className={styles.container}>
      <section className={styles.formSide}>
        <ApplicationReceivedCard />
      </section>
    </main>
  );
}
