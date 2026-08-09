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

const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getDateKey(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonthTitle(date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function getReadableDate(dateKey) {
  return new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function buildMonthDays(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingEmptyDays = firstDay.getDay();

  return [
    ...Array.from({ length: leadingEmptyDays }, (_, index) => ({
      key: `empty-${index}`,
      empty: true,
    })),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(year, month, index + 1);
      return {
        key: getDateKey(date),
        dateKey: getDateKey(date),
        day: index + 1,
      };
    }),
  ];
}

function getDefaultSlot() {
  return {
    id: `${Date.now()}-${Math.random()}`,
    startTime: "09:00",
    endTime: "13:00",
  };
}

function normalizeTimeString(value) {
  if (!value) return "";

  const normalized = `${value}`.trim();
  const amPmMatch = normalized.match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);

  if (amPmMatch) {
    let [, hour, minute, period] = amPmMatch;
    hour = Number(hour);
    if (period.toUpperCase() === "PM" && hour < 12) hour += 12;
    if (period.toUpperCase() === "AM" && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  }

  const timeMatch = normalized.match(/^(\d{1,2}):(\d{2})$/);
  if (timeMatch) {
    const [, hour, minute] = timeMatch;
    return `${hour.padStart(2, "0")}:${minute}`;
  }

  return normalized;
}

function normalizeSlot(slot) {
  return {
    id: slot.id ?? `${Date.now()}-${Math.random()}`,
    startTime: normalizeTimeString(slot.startTime || "09:00"),
    endTime: normalizeTimeString(slot.endTime || "13:00"),
  };
}

function Schedule({ scheduleData, onBack, onNext, onAddSlot, onClearDates }) {
  const navigate = useNavigate();
  const location = useLocation();
  const tripId = location.state?.tripId;

  const scheduleDates = scheduleData?.dates ?? scheduleData?.schedule?.dates;
  const scheduleSlotsByDate =
    scheduleData?.slotsByDate ?? scheduleData?.schedule?.slotsByDate;
  const scheduleSlots = scheduleData?.slots ?? scheduleData?.schedule?.slots;

  function dateKeyFromSavedDate(savedDate, monthDate = new Date()) {
    if (typeof savedDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(savedDate)) {
      return savedDate;
    }

    if (typeof savedDate === "number") {
      return getDateKey(new Date(monthDate.getFullYear(), monthDate.getMonth(), savedDate));
    }

    return null;
  }

  function normalizeSavedSchedule(schedule = {}, monthDate = new Date()) {
    const dates = (schedule.dates || [])
      .map((date) => dateKeyFromSavedDate(date, monthDate))
      .filter(Boolean);
    const uniqueDates = [...new Set(dates)];
    const incomingSlotsByDate = schedule.slotsByDate || {};
    const nextSlotsByDate = {};

    uniqueDates.forEach((dateKey) => {
      if (Array.isArray(incomingSlotsByDate[dateKey])) {
        nextSlotsByDate[dateKey] = incomingSlotsByDate[dateKey].map(normalizeSlot);
      }
    });

    if (Object.keys(nextSlotsByDate).length === 0 && Array.isArray(schedule.slots)) {
      schedule.slots.forEach((slot) => {
        const slotDate = slot.date || slot.dateKey;
        if (slotDate && uniqueDates.includes(slotDate)) {
          nextSlotsByDate[slotDate] = [
            ...(nextSlotsByDate[slotDate] || []),
            normalizeSlot(slot),
          ];
        }
      });
    }

    uniqueDates.forEach((dateKey) => {
      if (!nextSlotsByDate[dateKey]?.length) {
        nextSlotsByDate[dateKey] = [getDefaultSlot()];
      }
    });

    return {
      dates: uniqueDates,
      slotsByDate: nextSlotsByDate,
    };
  }

  const initialSchedule = normalizeSavedSchedule({
    dates: scheduleDates || [],
    slotsByDate: scheduleSlotsByDate || {},
    slots: scheduleSlots || [],
  });

  const [monthCursor, setMonthCursor] = useState(() => new Date());
  const [selectedDateKeys, setSelectedDateKeys] = useState(initialSchedule.dates);
  const [slotsByDate, setSlotsByDate] = useState(initialSchedule.slotsByDate);
  const [activeDateKey, setActiveDateKey] = useState(initialSchedule.dates[0] || "");
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const days = buildMonthDays(monthCursor);
  const selectedDates = selectedDateKeys;

  useEffect(() => {
    async function loadSchedule() {
      if (!tripId) return;

      setLoadingInitial(true);
      setFetchError("");

      try {
        const response = await apiRequest(`/trips/${tripId}`);
        const schedule = response?.data?.schedule || { dates: [], slots: [] };
        const savedSchedule = normalizeSavedSchedule(schedule, monthCursor);

        setSelectedDateKeys(savedSchedule.dates);
        setSlotsByDate(savedSchedule.slotsByDate);
        setActiveDateKey(savedSchedule.dates[0] || "");
      } catch (error) {
        console.error(error);
        setFetchError("Unable to load the saved schedule. Please try again.");
      } finally {
        setLoadingInitial(false);
      }
    }

    loadSchedule();
  }, [tripId]);

  function goToPreviousMonth() {
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function goToNextMonth() {
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  function toggleDay(dateKey) {
    setSelectedDateKeys((prev) => {
      if (prev.includes(dateKey)) {
        const nextDates = prev.filter((item) => item !== dateKey);
        setSlotsByDate((previousSlots) => {
          const nextSlots = { ...previousSlots };
          delete nextSlots[dateKey];
          return nextSlots;
        });
        setActiveDateKey((current) => (current === dateKey ? nextDates[0] || "" : current));
        return nextDates;
      }

      setSlotsByDate((previousSlots) => ({
        ...previousSlots,
        [dateKey]: previousSlots[dateKey]?.length
          ? previousSlots[dateKey]
          : [getDefaultSlot()],
      }));
      setActiveDateKey(dateKey);
      return [...prev, dateKey].sort();
    });
  }

  function addSlot(dateKey) {
    if (!dateKey) {
      alert("Please select a date first.");
      return;
    }

    const newSlot = {
      id: `${Date.now()}-${Math.random()}`,
      startTime: "09:00",
      endTime: "13:00",
    };

    setSlotsByDate((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newSlot],
    }));
    if (onAddSlot) onAddSlot(newSlot);
  }

  function removeSlot(dateKey, id) {
    setSlotsByDate((prev) => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).filter((slot) => slot.id !== id),
    }));
  }

  function updateSlot(dateKey, id, field, value) {
    const nextValue = field === "startTime" || field === "endTime" ? normalizeTimeString(value) : value;

    setSlotsByDate((prev) => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).map((slot) =>
        slot.id === id ? { ...slot, [field]: nextValue } : slot,
      ),
    }));
  }

  function clearDates() {
    setSelectedDateKeys([]);
    setSlotsByDate({});
    setActiveDateKey("");
    if (onClearDates) onClearDates();
  }

  async function handleNext() {
    setLoading(true);

    try {
      if (selectedDates.length === 0) {
        alert("Please select at least one date.");
        return;
      }

      const missingSlotsDate = selectedDates.find((dateKey) => !slotsByDate[dateKey]?.length);

      if (missingSlotsDate) {
        alert(`Please add at least one time slot for ${getReadableDate(missingSlotsDate)}.`);
        setActiveDateKey(missingSlotsDate);
        return;
      }

      const flatSlots = selectedDates.flatMap((dateKey) =>
        (slotsByDate[dateKey] || []).map((slot) => ({
          ...slot,
          date: dateKey,
        })),
      );

      if (tripId) {
        await apiRequest(`/trips/${tripId}`, {
          method: "PATCH",
          body: JSON.stringify({
            schedule: {
              dates: selectedDates,
              slotsByDate,
              slots: flatSlots,
            },
          }),
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
              <button type="button" className={styles.smallRound} onClick={goToPreviousMonth}>
                <FaChevronLeft />
              </button>
              <h2 className={styles.monthTitle}>{getMonthTitle(monthCursor)}</h2>
              <button type="button" className={styles.smallRound} onClick={goToNextMonth}>
                <FaChevronRight />
              </button>
            </div>

            <div className={styles.weekRow}>
              {weekDays.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className={styles.daysGrid}>
              {days.map((item) =>
                item.empty ? (
                  <span key={item.key} className={styles.emptyDay} />
                ) : (
                  <button
                    key={item.dateKey}
                    type="button"
                    className={`${styles.dayButton} ${
                      selectedDateKeys.includes(item.dateKey) ? styles.selectedDay : ""
                    } ${activeDateKey === item.dateKey ? styles.activeDay : ""}`}
                    onClick={() => toggleDay(item.dateKey)}
                  >
                    {item.day}
                  </button>
                ),
              )}
            </div>

            <div className={styles.selectedBox}>
              <div className={styles.selectedText}>
                <FaCalendarCheck />
                <span>
                  Selected: {selectedDates.length === 0 ? "No dates yet" : `${selectedDates.length} dates`}
                </span>
              </div>

              <button type="button" className={styles.clearButton} onClick={clearDates}>
                Clear
              </button>
            </div>

            {fetchError && <p className={styles.errorText}>{fetchError}</p>}

            {selectedDates.length > 0 && (
              <div className={styles.selectedDatesList}>
                {selectedDates.map((dateKey) => (
                  <button
                    key={dateKey}
                    type="button"
                    className={`${styles.selectedDatePill} ${
                      activeDateKey === dateKey ? styles.activeDatePill : ""
                    }`}
                    onClick={() => setActiveDateKey(dateKey)}
                  >
                    {getReadableDate(dateKey)}
                  </button>
                ))}
              </div>
            )}

          </section>

          <section className={styles.card}>
            <div className={styles.timeHeader}>
              <div>
                <h2>Time Slots</h2>
                <p className={styles.activeDateText}>
                  Each selected day has its own time slot.
                </p>
              </div>
            </div>

            <div className={styles.slotsList}>
              {selectedDates.length === 0 && (
                <p className={styles.noSlotsText}>Select dates from the calendar first.</p>
              )}

              {selectedDates.map((dateKey) => (
                <div key={dateKey} className={styles.dateSlotsGroup}>
                  <div className={styles.dateSlotsHeader}>
                    <h3>{getReadableDate(dateKey)}</h3>
                    <button
                      type="button"
                      className={styles.addButton}
                      onClick={() => addSlot(dateKey)}
                    >
                      + ADD SLOT
                    </button>
                  </div>

                  {(slotsByDate[dateKey] || []).map((slot) => (
                    <div key={slot.id} className={styles.slotCard}>
                      <div className={styles.timeInputs}>
                        <label>
                          Start Time
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(event) =>
                              updateSlot(dateKey, slot.id, "startTime", event.target.value)
                            }
                          />
                        </label>

                        <label>
                          End Time
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(event) =>
                              updateSlot(dateKey, slot.id, "endTime", event.target.value)
                            }
                          />
                        </label>
                      </div>

                      <button
                        type="button"
                        className={styles.deleteSlotButton}
                        onClick={() => removeSlot(dateKey, slot.id)}
                      >
                        Delete Slot
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className={styles.note}>
              <FaCircleInfo />
              <p>
                Time slots are saved per selected date, so each day can have its own
                start time, end time, and guest capacity.
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
