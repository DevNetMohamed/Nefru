import styles from "./Schedule.module.css";
import {
  FaArrowLeft,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarCheck,
  FaCircleInfo,
} from "react-icons/fa6";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../../../services/api";

function Schedule({ scheduleData, onBack, onNext, onAddSlot, onClearDates }) {
  const navigate = useNavigate();
  const location = useLocation();
  const tripId = location.state?.tripId;

  const initialData = scheduleData || {
    selectedText: "Oct 8 - Oct 12",
    days: [
      { day: 28, muted: true }, { day: 29, muted: true }, { day: 30, muted: true }, { day: 31, muted: true },
      { day: 1 }, { day: 2 }, { day: 3 },
      { day: 4 }, { day: 5 }, { day: 6 }, { day: 7 }, { day: 8, selected: true }, { day: 9, selected: true }, { day: 10, selected: true },
      { day: 11, selected: true }, { day: 12, active: true }, { day: 13 }, { day: 14 }, { day: 15 }, { day: 16 }, { day: 17 },
      { day: 18 }, { day: 19 }, { day: 20 }, { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 },
      { day: 25 }, { day: 26 }, { day: 27 }, { day: 28 },
    ],
    slots: [
      { id: 1, startTime: "09:00AM", endTime: "01:00 PM", maxGuests: 12 },
      { id: 2, startTime: "02:00 PM", endTime: "06:00 PM", maxGuests: 8 },
    ],
  };

  const [days, setDays] = useState(initialData.days);
  const [slots, setSlots] = useState(initialData.slots);
  const [loading, setLoading] = useState(false);
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const selectedDays = days.filter((day) => day.selected || day.active);

  function toggleDay(index) {
    setDays((prev) => prev.map((day, dayIndex) => (dayIndex === index ? { ...day, selected: !day.selected } : day)));
  }

  function addSlot() {
    const newSlot = {
      id: Date.now(),
      startTime: "09:00AM",
      endTime: "01:00 PM",
      maxGuests: 12,
    };

    setSlots((prev) => [...prev, newSlot]);
    if (onAddSlot) onAddSlot(newSlot);
  }

  function updateSlot(id, field, value) {
    setSlots((prev) => prev.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot)));
  }

  function clearDates() {
    setDays((prev) => prev.map((day) => ({ ...day, selected: false, active: false })));
    if (onClearDates) onClearDates();
  }

  async function handleNext() {
    setLoading(true);

    try {
      const selectedDates = selectedDays.map((day) => day.day);

      if (tripId) {
        await apiRequest(`/trips/${tripId}`, {
          method: "PATCH",
          body: JSON.stringify({ schedule: { dates: selectedDates, slots } }),
        });
      }

      if (onNext) {
        onNext();
        return;
      }

      navigate("/guide/tourmedia", { state: { tripId } });
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.iconButton} onClick={onBack}>
          <FaArrowLeft />
        </button>
        <h1>Select Date & Time</h1>
        <div className={styles.emptyBox}></div>
      </header>

      <main className={styles.content}>
        <div className={styles.stepper}>
          <div className={styles.line}></div>
          <div className={styles.activeLine}></div>
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`${styles.step} ${step <= 2 ? styles.activeStep : ""}`}
            >
              {step}
            </div>
          ))}
        </div>

        <div className={styles.sections}>
          <section className={styles.card}>
            <div className={styles.calendarTop}>
              <button type="button" className={styles.smallRound}>
                <FaChevronLeft />
              </button>
              <button type="button" className={styles.smallRound}>
                <FaChevronRight />
              </button>
            </div>

            <div className={styles.weekRow}>
              {weekDays.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className={styles.daysGrid}>
              {days.map((item, index) => (
                <button
                  key={`${item.day}-${index}`}
                  type="button"
                  className={`${styles.dayButton} ${item.muted ? styles.mutedDay : ""} ${
                    item.selected ? styles.selectedDay : ""
                  } ${item.active ? styles.activeDay : ""}`}
                  onClick={() => toggleDay(index)}
                >
                  {item.day}
                </button>
              ))}
            </div>

            <div className={styles.selectedBox}>
              <div className={styles.selectedText}>
                <FaCalendarCheck />
                <span>
                  Selected: {selectedDays.length === 0 ? "No dates yet" : `${selectedDays.length} dates`}
                </span>
              </div>

              <button type="button" className={styles.clearButton} onClick={clearDates}>
                Clear
              </button>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.timeHeader}>
              <h2>Time Slots</h2>
              <button type="button" className={styles.addButton} onClick={addSlot}>
                + ADD SLOT
              </button>
            </div>

            <div className={styles.slotsList}>
              {slots.map((slot) => (
                <div key={slot.id} className={styles.slotCard}>
                  <div className={styles.timeInputs}>
                    <label>
                      Start Time
                      <input
                        type="text"
                        value={slot.startTime}
                        onChange={(event) => updateSlot(slot.id, "startTime", event.target.value)}
                      />
                    </label>

                    <label>
                      End Time
                      <input
                        type="text"
                        value={slot.endTime}
                        onChange={(event) => updateSlot(slot.id, "endTime", event.target.value)}
                      />
                    </label>
                  </div>

                  <div className={styles.guestsRow}>
                    <span>Max Guests</span>
                    <div className={styles.counter}>
                      <button type="button" onClick={() => updateSlot(slot.id, "maxGuests", Math.max(1, slot.maxGuests - 1))}>-</button>
                      <strong>{slot.maxGuests}</strong>
                      <button type="button" onClick={() => updateSlot(slot.id, "maxGuests", slot.maxGuests + 1)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.note}>
              <FaCircleInfo />
              <p>
                These time slots will be applied to all selected dates. You can
                adjust specific days later in the dashboard.
              </p>
            </div>

            <button type="button" className={styles.nextButton} onClick={handleNext}>
              {loading ? "Saving..." : <>Next Step <FaArrowRight /></>}
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Schedule;