function pad(value) {
  return String(value).padStart(2, "0");
}

export function toDateKey(value) {
  if (!value) return "";
  if (typeof value === "string") {
    const match = value.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export function normalizeTime(value, fallback = "09:00") {
  if (!value) return fallback;
  const text = String(value).trim();
  const twentyFourHour = text.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHour) {
    return `${pad(Math.min(Number(twentyFourHour[1]), 23))}:${twentyFourHour[2]}`;
  }

  const twelveHour = text.match(/^(\d{1,2}):(\d{2})\s*([ap]m)$/i);
  if (!twelveHour) return fallback;
  let hour = Number(twelveHour[1]) % 12;
  if (twelveHour[3].toLowerCase() === "pm") hour += 12;
  return `${pad(hour)}:${twelveHour[2]}`;
}

function safeSlotId(value) {
  return String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .slice(0, 80);
}

export function makeOccurrenceKey(date, slotId, startTime, endTime) {
  return [
    toDateKey(date),
    safeSlotId(slotId) || `${normalizeTime(startTime)}-${normalizeTime(endTime, "10:00")}`,
  ].join("::");
}

function normalizeSlot(slot, date, index, fallbackCapacity) {
  const startTime = normalizeTime(slot?.startTime);
  const endTime = normalizeTime(slot?.endTime, "10:00");
  const capacity = Math.max(
    1,
    Number(slot?.capacity ?? slot?.maxGuests ?? slot?.availableSpots ?? fallbackCapacity ?? 1) || 1,
  );
  const id = safeSlotId(slot?.id) || `slot-${index + 1}-${startTime.replace(":", "")}`;

  return {
    id,
    date: toDateKey(date),
    startTime,
    endTime,
    capacity,
    occurrenceKey: makeOccurrenceKey(date, id, startTime, endTime),
  };
}

export function normalizeTripSchedule(schedule = {}, fallbackCapacity = 1) {
  const dates = [...new Set((schedule?.dates || []).map(toDateKey).filter(Boolean))].sort();
  const incomingByDate = schedule?.slotsByDate || {};
  const flatSlots = Array.isArray(schedule?.slots) ? schedule.slots : [];
  const slotsByDate = {};

  dates.forEach((date) => {
    let source = Array.isArray(incomingByDate[date]) ? incomingByDate[date] : [];

    if (!source.length) {
      const datedSlots = flatSlots.filter((slot) => toDateKey(slot?.date || slot?.dateKey) === date);
      source = datedSlots.length ? datedSlots : flatSlots.filter((slot) => !slot?.date && !slot?.dateKey);
    }

    slotsByDate[date] = source.map((slot, index) =>
      normalizeSlot(slot, date, index, fallbackCapacity),
    );
  });

  const normalizedSlots = dates.flatMap((date) => slotsByDate[date] || []);

  return { dates, slotsByDate, slots: normalizedSlots };
}

export function occurrenceDateTime(dateKey, time) {
  const normalizedDate = toDateKey(dateKey);
  const normalizedTime = normalizeTime(time);
  const [year, month, day] = normalizedDate.split("-").map(Number);
  const [hour, minute] = normalizedTime.split(":").map(Number);
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute);
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(new Date(utcGuess)).map((part) => [part.type, part.value]),
  );
  const cairoAtGuess = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
  );
  return new Date(utcGuess - (cairoAtGuess - utcGuess));
}

export function findOccurrence(trip, occurrenceKey) {
  const schedule = normalizeTripSchedule(trip?.schedule, trip?.groupSize || 1);
  const occurrence = schedule.slots.find((slot) => slot.occurrenceKey === occurrenceKey);
  return { schedule, occurrence };
}
