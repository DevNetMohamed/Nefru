import style from "./Date.module.css";
import MyDatePicker from "../DatePicker/DatePicker";

export default function Date({ selected, onChange, availableDates }) {
  return (
    <div>
      <div className={style.headerDate}>
        <span>Select Date</span>
        <span className={style.badge}>AVAILABLE DATES</span>
      </div>

      <div className={style.DatePicker}>
        <MyDatePicker
          selected={selected}
          onChange={onChange}
          availableDates={availableDates}
        />
      </div>
    </div>
  );
}
