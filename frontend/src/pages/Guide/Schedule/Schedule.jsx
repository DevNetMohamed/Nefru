import styles from "./Schedule.module.css";
import {
  FaArrowLeft,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarCheck,
  FaCircleInfo,
} from "react-icons/fa6";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../../../services/api";

function Schedule({ scheduleData, onBack, onNext, onAddSlot, onClearDates }) {
  const navigate = useNavigate();
  const location = useLocation();
  const tripId = location.state?.tripId;

  const initialData = {
    days: [
      { day: 28, muted: true }, { day: 29, muted: true }, { day: 30, muted: true }, { day: 31, muted: true },
      { day: 1 }, { day: 2 }, { day: 3 },
      { day: 4 }, { day: 5 }, { day: 6 }, { day: 7 }, { day: 8, selected: true }, { day: 9, selected: true }, { day: 10, selected: true },
      { day: 11, selected: true }, { day: 12, active: true }, { day: 13 }, { day: 14 }, { day: 15 }, { day: 16 }, { day: 17 },
      { day: 18 }, { day: 19 }, { day: 20 }, { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 },
      { day: 25 }, { day: 26 }, { day: 27 }, { day: 28 },
    ],
    slots: [
      { id: 1, startTime: "09:00", endTime: "13:00", maxGuests: 12 },
      { id: 2, startTime: "14:00", endTime: "18:00", maxGuests: 8 },
    ],
  };

  const scheduleDates = scheduleData?.dates ?? scheduleData?.schedule?.dates;
  const scheduleSlots = scheduleData?.slots ?? scheduleData?.schedule?.slots;

  function buildDays(selectedDates = []) {
    return initialData.days.map((day) => ({
      ...day,
      selected: selectedDates?.includes(day.day) || day.selected || false,
    }));
  }

  function normalizeTimeString(value) {
    if (!value) return "";

    const normalized = `${value}`.trim();
    const amPmMatch = normalized.match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);

    if (amPmMatch) {
      let [_, hour, minute, period] = amPmMatch;
      hour = Number(hour);
      if (period.toUpperCase() === "PM" && hour < 12) hour += 12;
      if (period.toUpperCase() === "AM" && hour === 12) hour = 0;
      return `${hour.toString().padStart(2, "0")}:${minute}`;
    }

    const timeMatch = normalized.match(/^(\d{1,2}):(\d{2})$/);
    if (timeMatch) {
      const [_, hour, minute] = timeMatch;
      return `${hour.padStart(2, "0")}:${minute}`;
    }

    return normalized;
  }

  function normalizeSlots(incomingSlots) {
    if (!Array.isArray(incomingSlots) || incomingSlots.length === 0) {
      return initialData.slots;
    }

    return incomingSlots.map((slot) => ({
      id: slot.id ?? Date.now() + Math.random(),
      startTime: normalizeTimeString(slot.startTime || "09:00"),
      endTime: normalizeTimeString(slot.endTime || "13:00"),
      maxGuests: slot.maxGuests || 1,
    }));
  }

  const [days, setDays] = useState(() => buildDays(scheduleDates));
  const [slots, setSlots] = useState(() => normalizeSlots(scheduleSlots));
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const selectedDays = days.filter((day) => day.selected || day.active);

  useEffect(() => {
    async function loadSchedule() {
      if (!tripId) return;

      setLoadingInitial(true);
      setFetchError("");

      try {
        const response = await apiRequest(`/trips/${tripId}`);
        const schedule = response?.data?.schedule || { dates: [], slots: [] };

        setDays(buildDays(schedule.dates));
        setSlots(normalizeSlots(schedule.slots));
      } catch (error) {
        console.error(error);
        setFetchError("Unable to load the saved schedule. Please try again.");
      } finally {
        setLoadingInitial(false);
      }
    }

    loadSchedule();
  }, [tripId]);

  function toggleDay(index) {
    setDays((prev) =>
      prev.map((day, dayIndex) =>
        dayIndex === index && !day.muted
          ? { ...day, selected: !day.selected }
          : day,
      ),
    );
  }

  function addSlot() {
    const newSlot = {
      id: Date.now(),
      startTime: "09:00",
      endTime: "13:00",
      maxGuests: 12,
    };

    setSlots((prev) => [...prev, newSlot]);
    if (onAddSlot) onAddSlot(newSlot);
  }

  function removeSlot(id) {
    setSlots((prev) => prev.filter((slot) => slot.id !== id));
  }

  function updateSlot(id, field, value) {
    const nextValue = field === "startTime" || field === "endTime" ? normalizeTimeString(value) : value;

    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === id
          ? { ...slot, [field]: nextValue }
          : slot,
      ),
    );
  }

  function clearDates() {
    setDays((prev) => prev.map((day) => ({ ...day, selected: false })));
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
                  disabled={item.muted}
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

            {fetchError && <p className={styles.errorText}>{fetchError}</p>}

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
                        type="time"
                        value={slot.startTime}
                        onChange={(event) => updateSlot(slot.id, "startTime", event.target.value)}
                      />
                    </label>

                    <label>
                      End Time
                      <input
                        type="time"
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

                  <button
                    type="button"
                    className={styles.deleteSlotButton}
                    onClick={() => removeSlot(slot.id)}
                  >
                    Delete Slot
                  </button>
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

            <button type="button" className={styles.nextButton} onClick={handleNext} disabled={loading || loadingInitial}>
              {loading ? "Saving..." : <>Next Step <FaArrowRight /></>}
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Schedule;