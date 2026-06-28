import {
  FiCalendar,
  FiChevronRight,
  FiCreditCard,
  FiHeadphones,
  FiHelpCircle,
  FiMail,
  FiMessageCircle,
  FiPhone,
  FiSearch,
  FiShield,
  FiUser,
} from "react-icons/fi";

import styles from "../ProfilePageShared.module.css";

const supportCards = [
  {
    title: "Booking Help",
    description: "Find answers about bookings, changes, and cancellations.",
    icon: FiCalendar,
  },
  {
    title: "Payment Help",
    description: "Learn about payments, refunds, and billing issues.",
    icon: FiCreditCard,
  },
  {
    title: "Account Help",
    description: "Get help with profile, password, and account settings.",
    icon: FiUser,
  },
  {
    title: "Safety Tips",
    description: "Travel confidently with simple safety guidance.",
    icon: FiShield,
  },
];

const questions = [
  "How do I book a tour on Nefru?",
  "What payment methods are accepted?",
  "Can I change or cancel my booking?",
  "How do I update my account details?",
];

export default function HelpSupport() {
  return (
    <div className={styles.pageContent}>
      <header className={styles.header}>
        <div>
          <h1>Help & Support</h1>
          <p>Find answers to common questions or contact our support team.</p>
        </div>
      </header>

      <section className={styles.card}>
        <div className={styles.searchSupportBox}>
          <FiSearch />
          <input type="search" placeholder="Search for help articles, topics or questions..." />
          <button type="button">Search</button>
        </div>

        <div className={styles.supportGrid}>
          {supportCards.map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className={styles.supportCard}>
                <span>
                  <Icon />
                </span>
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
                <FiChevronRight className={styles.supportArrow} />
              </article>
            );
          })}
        </div>
      </section>

      <div className={styles.twoColumnLayout}>
        <section className={styles.card}>
          <div className={styles.cardTitleCompact}>
            <FiHelpCircle />
            <div>
              <h2>Common Questions</h2>
              <p>Quick answers to the most repeated questions.</p>
            </div>
          </div>

          <div className={styles.questionList}>
            {questions.map((question) => (
              <button key={question} type="button" className={styles.questionItem}>
                <span>{question}</span>
                <FiChevronRight />
              </button>
            ))}
          </div>
        </section>

        <aside className={styles.contactPanel}>
          <div className={styles.contactPanelHeader}>
            <FiHeadphones />
            <div>
              <h2>Still need help?</h2>
              <p>Choose the best way to reach us.</p>
            </div>
          </div>

          <div className={styles.contactMethods}>
            <a href="mailto:support@nefru.com">
              <FiMail />
              <span>
                <strong>Email Us</strong>
                <small>support@nefru.com</small>
              </span>
            </a>

            <button type="button">
              <FiMessageCircle />
              <span>
                <strong>Live Chat</strong>
                <small>Chat will be added later</small>
              </span>
            </button>

            <a href="tel:+201234567890">
              <FiPhone />
              <span>
                <strong>Call Us</strong>
                <small>+20 123 456 7890</small>
              </span>
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
