import {
  BellRing,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  MapPin,
  MessageCircleMore,
  Star,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import pyramidsImage from "../../../assets/images/explore/pyramids.webp";
import abuSimbelImage from "../../../assets/images/hero/aswan.jpeg";
import luxorImage from "../../../assets/images/tours/Luxor.jpg";
import feluccaImage from "../../../assets/images/hero/cairo.jpg";
import styles from "./GuideDashboard.module.css";

const stats = [
  {
    label: "Upcoming Tours",
    value: "7",
    helper: "Next 30 days",
    icon: CalendarDays,
    tone: "blue",
  },
  {
    label: "Total Guests",
    value: "28",
    helper: "Across all tours",
    icon: UsersRound,
    tone: "gold",
  },
  {
    label: "Avg. Rating",
    value: "4.8 / 5",
    helper: "From 124 reviews",
    icon: Star,
    tone: "gold",
  },
  {
    label: "This Month Earnings",
    value: "$2,450",
    helper: "↑ 18% vs last month",
    icon: CircleDollarSign,
    tone: "green",
  },
];

const upcomingTours = [
  {
    id: 1,
    title: "Pyramids of Giza & Sphinx",
    location: "Giza, Egypt",
    date: "May 21, 2025",
    time: "09:30 AM",
    guests: "8 / 12",
    earnings: "$320",
    status: "Today",
    image: pyramidsImage,
  },
  {
    id: 2,
    title: "Abu Simbel Day Trip",
    location: "Aswan, Egypt",
    date: "May 23, 2025",
    time: "06:30 AM",
    guests: "6 / 10",
    earnings: "$280",
    status: "Upcoming",
    image: abuSimbelImage,
  },
  {
    id: 3,
    title: "Luxor East & West Banks",
    location: "Luxor, Egypt",
    date: "May 24, 2025",
    time: "08:00 AM",
    guests: "10 / 14",
    earnings: "$360",
    status: "Upcoming",
    image: luxorImage,
  },
  {
    id: 4,
    title: "Nile Sunset Felucca",
    location: "Cairo, Egypt",
    date: "May 26, 2025",
    time: "06:00 PM",
    guests: "4 / 8",
    earnings: "$140",
    status: "Upcoming",
    image: feluccaImage,
  },
];

const scheduleItems = [
  {
    time: "09:30 AM",
    title: "Pyramids of Giza & Sphinx",
    location: "Giza Plateau Entrance",
    guests: 8,
  },
  {
    time: "01:30 PM",
    title: "Museum of Egyptian Civilization",
    location: "Fustat, Cairo",
    guests: 10,
  },
  {
    time: "07:00 PM",
    title: "Nile Dinner Cruise",
    location: "Zamalek Marina",
    guests: 12,
  },
];

const reminders = [
  {
    title: "3 guests need passport info",
    helper: "For upcoming tours",
    icon: UsersRound,
    tone: "green",
  },
  {
    title: "1 trip tomorrow",
    helper: "Pyramids of Giza & Sphinx at 09:30 AM",
    icon: CalendarDays,
    tone: "blue",
  },
  {
    title: "2 special requests",
    helper: "View and respond",
    icon: MessageCircleMore,
    tone: "gold",
  },
];

const activities = [
  {
    title: "New review received",
    helper: "5★ review for Luxor East & West Banks",
    time: "2h ago",
    icon: Star,
    tone: "green",
  },
  {
    title: "Booking confirmed",
    helper: "Nile Sunset Felucca · May 26",
    time: "4h ago",
    icon: UsersRound,
    tone: "blue",
  },
  {
    title: "Trip reached full capacity",
    helper: "Luxor East & West Banks · May 24",
    time: "1d ago",
    icon: BellRing,
    tone: "gold",
  },
];

function SectionAction({ children, onClick }) {
  return (
    <button type="button" className={styles.sectionAction} onClick={onClick}>
      {children}
      <ChevronRight size={17} aria-hidden="true" />
    </button>
  );
}

export default function GuideDashboard() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Guide dashboard</span>
          <h1>Tours Booking Management</h1>
          <p>Manage your booked tours, guests, and schedule.</p>
        </div>
      </header>

      <div className={styles.dashboardGrid}>
        <div className={styles.primaryColumn}>
          <section className={`${styles.card} ${styles.nextTourCard}`}>
            <div className={styles.cardHeading}>
              <h2>
                Next Trip <Star size={18} fill="currentColor" aria-hidden="true" />
              </h2>
              <span className={styles.todayBadge}>• Today</span>
            </div>

            <div className={styles.nextTourContent}>
              <img
                src={pyramidsImage}
                alt="Pyramids of Giza and the Sphinx"
                className={styles.nextTourImage}
              />

              <div className={styles.nextTourDetails}>
                <h3>Pyramids of Giza &amp; Sphinx</h3>

                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <CalendarDays size={20} aria-hidden="true" />
                    <span>
                      <strong>May 21, 2025</strong>
                      <small>Wed</small>
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <Clock3 size={20} aria-hidden="true" />
                    <span>
                      <strong>09:30 AM</strong>
                      <small>Start Time</small>
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <MapPin size={20} aria-hidden="true" />
                    <span>
                      <strong>Giza Plateau Entrance</strong>
                      <small>Meeting Point</small>
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <UsersRound size={20} aria-hidden="true" />
                    <span>
                      <strong>8 / 12</strong>
                      <small>Guests</small>
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <CircleDollarSign size={20} aria-hidden="true" />
                    <span>
                      <strong>$320</strong>
                      <small>Expected Earnings</small>
                    </span>
                  </div>
                </div>

                <div className={styles.nextTourActions}>
                  <button type="button" className={styles.primaryButton}>
                    View Details <ChevronRight size={18} />
                  </button>
                  <button type="button" className={styles.secondaryButton}>
                    <UsersRound size={18} /> Guest List
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.statsGrid} aria-label="Guide statistics">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <article className={styles.statCard} key={stat.label}>
                  <span className={`${styles.statIcon} ${styles[stat.tone]}`}>
                    <Icon size={23} aria-hidden="true" />
                  </span>
                  <span className={styles.statContent}>
                    <small>{stat.label}</small>
                    <strong>{stat.value}</strong>
                    <em>{stat.helper}</em>
                  </span>
                </article>
              );
            })}
          </section>

          <section className={`${styles.card} ${styles.toursCard}`}>
            <div className={styles.sectionHeader}>
              <h2>Upcoming Booked Tours</h2>
              <SectionAction onClick={() => navigate("/guide")}>View all</SectionAction>
            </div>

            <div className={styles.tourList}>
              {upcomingTours.map((trip) => (
                <article className={styles.tourRow} key={trip.id}>
                  <img src={trip.image} alt="" aria-hidden="true" />
                  <div className={styles.tourMain}>
                    <h3>{trip.title}</h3>
                    <span>
                      <MapPin size={13} /> {trip.location}
                    </span>
                    <div className={styles.mobileTourMeta}>
                      <span>{trip.date}</span>
                      <span>•</span>
                      <span>{trip.time}</span>
                    </div>
                  </div>
                  <div className={styles.desktopMeta}>
                    <small>Date</small>
                    <strong>{trip.date}</strong>
                  </div>
                  <div className={styles.desktopMeta}>
                    <small>Start time</small>
                    <strong>{trip.time}</strong>
                  </div>
                  <div className={styles.guestsMeta}>
                    <UsersRound size={16} />
                    <strong>{trip.guests}</strong>
                  </div>
                  <strong className={styles.earnings}>{trip.earnings}</strong>
                  <span
                    className={`${styles.statusBadge} ${
                      trip.status === "Today" ? styles.statusToday : ""
                    }`}
                  >
                    {trip.status}
                  </span>
                  <button type="button" className={styles.rowAction} aria-label={`View ${trip.title}`}>
                    <ChevronRight size={19} />
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className={styles.sideColumn}>
          <section className={`${styles.card} ${styles.sideCard}`}>
            <div className={styles.sectionHeader}>
              <h2>Today&apos;s Schedule</h2>
              <SectionAction onClick={() => navigate("/guide/calendar")}>
                Calendar
              </SectionAction>
            </div>

            <div className={styles.timeline}>
              {scheduleItems.map((item) => (
                <article className={styles.timelineItem} key={item.time}>
                  <span className={styles.timelineTime}>{item.time}</span>
                  <span className={styles.timelineDot} aria-hidden="true" />
                  <span className={styles.timelineText}>
                    <strong>{item.title}</strong>
                    <small>{item.location}</small>
                  </span>
                  <span className={styles.timelineGuests}>
                    <UsersRound size={15} /> {item.guests}
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className={`${styles.card} ${styles.sideCard}`}>
            <div className={styles.sectionHeader}>
              <h2>Reminders &amp; Alerts</h2>
            </div>
            <div className={styles.compactList}>
              {reminders.map((item) => {
                const Icon = item.icon;
                return (
                  <button type="button" className={styles.compactItem} key={item.title}>
                    <span className={`${styles.compactIcon} ${styles[item.tone]}`}>
                      <Icon size={18} />
                    </span>
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.helper}</small>
                    </span>
                    <ChevronRight size={18} />
                  </button>
                );
              })}
            </div>
          </section>

          <section className={`${styles.card} ${styles.sideCard}`}>
            <div className={styles.sectionHeader}>
              <h2>Latest Activity</h2>
            </div>
            <div className={styles.compactList}>
              {activities.map((item) => {
                const Icon = item.icon;
                return (
                  <div className={styles.activityItem} key={item.title}>
                    <span className={`${styles.compactIcon} ${styles[item.tone]}`}>
                      <Icon size={18} />
                    </span>
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.helper}</small>
                    </span>
                    <time>{item.time}</time>
                  </div>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
