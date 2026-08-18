import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.module.css";

export default function MyDatePicker({ selected, onChange, availableDates }) {
  const now = new Date();
  const defaultAvailableDates = [
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2),
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4),
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10),
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14),
  ];

  const validAvailableDates = availableDates && availableDates.length > 0
    ? availableDates
    : defaultAvailableDates;

  const isAvailable = (date) =>
    validAvailableDates.some(
      (d) =>
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
    );

  return (
    <div className="p-3">
      <DatePicker
        selected={selected || validAvailableDates[0]}
        onChange={(date) => onChange?.(date)}
        inline
        minDate={new Date()}
        highlightDates={validAvailableDates}
        dayClassName={(date) =>
          isAvailable(date) ? "available-day" : undefined
        }
      />
    </div>
  );
}
