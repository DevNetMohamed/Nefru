import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Filter,
  MapPin,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";

import pyramidsImage from "../../../assets/images/explore/pyramids.webp";
import luxorImage from "../../../assets/images/tours/Luxor.jpg";
import feluccaImage from "../../../assets/images/hero/cairo.jpg";
import styles from "./GuideCalendar.module.css";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const calendarDays = [
  { day: 27, muted: true },
  { day: 28, muted: true },
  { day: 29, muted: true },
  { day: 30, muted: true },
  { day: 1 },
  { day: 2 },
  { day: 3 },
  { day: 4 },
  { day: 5 },
  { day: 6, events: [{ label: "2 tours", tone: "booked" }] },
  { day: 7, events: [{ label: "1 trip", tone: "booked" }] },
  { day: 8 },
  { day: 9, events: [{ label: "1 trip", tone: "booked" }] },
  { day: 10, events: [{ label: "1 trip", tone: "booked" }] },
  { day: 11 },
  { day: 12, events: [{ label: "1 trip", tone: "booked" }] },
  { day: 13, events: [{ label: "2 tours", tone: "booked" }] },
  { day: 14, events: [{ label: "1 trip", tone: "booked" }] },
  { day: 15 },
  { day: 16, events: [{ label: "1 trip", tone: "booked" }] },
  { day: 17, events: [{ label: "2 tours", tone: "booked" }] },
  { day: 18 },
  { day: 19, events: [{ label: "1 trip", tone: "booked" }] },
  { day: 20, events: [{ label: "1 trip", tone: "booked" }] },
  {
    day: 21,
    selected: true,
    events: [
      { label: "3 tours", tone: "booked" },
      { label: "1 reminder", tone: "reminder" },
    ],
  },
  { day: 22 },
  { day: 23, events: [{ label: "1 trip", tone: "pending" }] },
  { day: 24, events: [{ label: "2 tours", tone: "booked" }] },
  { day: 25 },
  { day: 26, events: [{ label: "1 trip", tone: "booked" }] },
  { day: 27, events: [{ label: "2 tours", tone: "booked" }] },
  { day: 28, events: [{ label: "1 trip", tone: "booked" }] },
  { day: 29 },
  { day: 30, events: [{ label: "1 trip", tone: "booked" }] },
  { day: 31, events: [{ label: "1 trip", tone: "booked" }] },
];

const schedule = [
  {
    time: "09:30 AM",
    title: "Pyramids of Giza & Sphinx",
    location: "Giza Plateau Entrance",
    guests: "8 / 12",
    status: "Today",
    image: pyramidsImage,
  },
  {
    time: "01:30 PM",
    title: "Museum of Egyptian Civilization",
    location: "Fustat, Cairo",
    guests: "10 / 10",
    status: "Confirmed",
    image: luxorImage,
  },
  {
    time: "07:00 PM",
    title: "Nile Dinner Cruise",
    location: "Zamalek Marina",
    guests: "12 / 12",
    status: "Full",
    image: feluccaImage,
  },
];

const reminders = [
  {
    title: "1 pending booking",
    helper: "Abu Simbel Day Trip on May 23",
    tone: "pending",
  },
  {
    title: "2 guests need passport info",
    helper: "For upcoming tours",
    tone: "reminder",
  },
  {
    title: "Your trip tomorrow",
    helper: "Pyramids of Giza & Sphinx at 09:30 AM",
    tone: "booked",
  },
];

const weekStrip = [
  { label: "SUN", day: 18 },
  { label: "MON", day: 19 },
  { label: "TUE", day: 20 },
  { label: "WED", day: 21, selected: true },
  { label: "THU", day: 22 },
  { label: "FRI", day: 23 },
  { label: "SAT", day: 24 },
];

export default function GuideCalendar() {
  const [view, setView] = useState("Month");
  const [mobileTab, setMobileTab] = useState("Today");

  const summaryCards = useMemo(
    () => [
      { label: "Bookings Today", value: "8", icon: UsersRound, helper: "↑ 14% vs yesterday" },
      { label: "Bookings This Month", value: "24", icon: CalendarDays, helper: "↑ 18% vs last month" },
      { label: "Earnings This Month", value: "$2,450", icon: CircleDollarSign, helper: "↑ 18% vs last month" },
    ],
    [],
  );

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Your availability</span>
          <h1>Trip Calendar</h1>
          <p>Manage your schedule, bookings, and availability.</p>
        </div>
      </header>

      <section className={`${styles.card} ${styles.mobileDateCard}`}>
        <div className={styles.mobileMonthRow}>
          <button type="button" aria-label="Previous week">
            <ChevronLeft size={20} />
          </button>
          <strong>
            May 2025 <ChevronDown size={17} />
          </strong>
          <button type="button" aria-label="Next week">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className={styles.weekStrip}>
          {weekStrip.map((item) => (
            <button
              key={item.day}
              type="button"
              className={item.selected ? styles.selectedWeekDay : ""}
            >
              <small>{item.label}</small>
              <strong>{item.day}</strong>
              {item.selected && <span aria-hidden="true" />}
            </button>
          ))}
        </div>

        <div className={styles.segmentedControl}>
          {["Today", "Upcoming", "Completed"].map((tab) => (
            <button
              type="button"
              key={tab}
              className={mobileTab === tab ? styles.activeSegment : ""}
              onClick={() => setMobileTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <div className={styles.calendarLayout}>
        <div className={styles.primaryColumn}>
          <section className={`${styles.card} ${styles.desktopCalendarCard}`}>
            <div className={styles.calendarToolbar}>
              <div className={styles.viewSwitcher}>
                {["Today", "Week", "Month"].map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={view === item ? styles.activeView : ""}
                    onClick={() => setView(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className={styles.monthNavigation}>
                <button type="button" aria-label="Previous month">
                  <ChevronLeft size={19} />
                </button>
                <strong>
                  May 2025 <ChevronDown size={17} />
                </strong>
                <button type="button" aria-label="Next month">
                  <ChevronRight size={19} />
                </button>
              </div>

              <button type="button" className={styles.filterButton}>
                <Filter size={18} /> Filter
              </button>
            </div>

            <div className={styles.calendarGrid}>
              {weekDays.map((day) => (
                <div className={styles.weekDayHeader} key={day}>
                  {day}
                </div>
              ))}

              {calendarDays.map((item, index) => (
                <button
                  type="button"
                  key={`${item.day}-${index}`}
                  className={`${styles.dayCell} ${item.muted ? styles.mutedDay : ""} ${
                    item.selected ? styles.selectedDay : ""
                  }`}
                >
                  <span className={styles.dayNumber}>{item.day}</span>
                  <span className={styles.dayEvents}>
                    {item.events?.map((event) => (
                      <span key={event.label} className={styles[event.tone]}>
                        <i aria-hidden="true" /> {event.label}
                      </span>
                    ))}
                  </span>
                </button>
              ))}
            </div>

            <div className={styles.legend}>
              <span><i className={styles.booked} /> Booked</span>
              <span><i className={styles.pending} /> Pending / To Confirm</span>
              <span><i className={styles.reminder} /> Reminder</span>
            </div>
          </section>

          <section className={`${styles.card} ${styles.scheduleCard}`}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Today&apos;s Schedule</h2>
                <p>May 21, 2025</p>
              </div>
              <button type="button">View full day <ChevronRight size={17} /></button>
            </div>

            <div className={styles.scheduleList}>
              {schedule.map((item) => (
                <article className={styles.scheduleRow} key={item.time}>
                  <time>{item.time}</time>
                  <span className={styles.scheduleDot} aria-hidden="true" />
                  <img src={item.image} alt="" aria-hidden="true" />
                  <div className={styles.scheduleMain}>
                    <h3>{item.title}</h3>
                    <span><MapPin size={14} /> {item.location}</span>
                  </div>
                  <span className={styles.scheduleGuests}>
                    <UsersRound size={16} /> {item.guests}
                  </span>
                  <span className={styles.scheduleStatus}>{item.status}</span>
                </article>
              ))}
            </div>
          </section>

          <div className={styles.lowerGrid}>
            <section className={`${styles.card} ${styles.availabilityCard}`}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Availability Overview</h2>
                  <p>Your availability this month</p>
                </div>
              </div>
              <div className={styles.availabilityBar} aria-label="Monthly availability">
                <span className={styles.availableBar} />
                <span className={styles.partialBar} />
                <span className={styles.fullBar} />
              </div>
              <div className={styles.availabilityLegend}>
                <span><i className={styles.booked} /> Available <strong>10 days</strong></span>
                <span><i className={styles.pending} /> Partially booked <strong>12 days</strong></span>
                <span><i className={styles.fullTone} /> Fully booked <strong>9 days</strong></span>
              </div>
            </section>

            <section className={`${styles.card} ${styles.upcomingCard}`}>
              <div className={styles.sectionHeader}>
                <div>
                  <h2>Upcoming</h2>
                  <p>Next 7 days</p>
                </div>
              </div>
              <div className={styles.upcomingList}>
                <div><span>May 22</span><strong>Luxor East &amp; West Banks</strong><b>10 / 14</b></div>
                <div><span>May 23</span><strong>Abu Simbel Day Trip</strong><b>6 / 10</b></div>
                <div><span>May 24</span><strong>Nile Sunset Felucca</strong><b>4 / 8</b></div>
              </div>
            </section>
          </div>
        </div>

        <aside className={styles.sideColumn}>
          <section className={styles.summaryGrid}>
            {summaryCards.map((item) => {
              const Icon = item.icon;
              return (
                <article className={styles.summaryCard} key={item.label}>
                  <span><Icon size={20} /></span>
                  <strong>{item.value}</strong>
                  <small>{item.label}</small>
                  <em>{item.helper}</em>
                </article>
              );
            })}
          </section>

          <section className={`${styles.card} ${styles.remindersCard}`}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Reminders &amp; Alerts</h2>
              </div>
            </div>
            <div className={styles.reminderList}>
              {reminders.map((item) => (
                <button type="button" key={item.title}>
                  <span className={`${styles.reminderIcon} ${styles[item.tone]}`}>
                    <Clock3 size={18} />
                  </span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.helper}</small>
                  </span>
                  <ChevronRight size={18} />
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
