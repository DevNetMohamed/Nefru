import Style from "./Book.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DateComponent from "./components/Date/Date";
import { Button } from "../../../../shared/components/Button/Button";
import Icons from "../../../../assets/icons";
import { useState, useMemo } from "react";
import Counter from "./components/Counter/Counter";
import { MdOutlineVerified } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { IoMdShare } from "react-icons/io";

const SEED_TRIP_PRICES = {
  "Historic Cairo Walking Trip": 700,
  "Pyramids Sunrise & Sphinx Experience": 1200,
  "Alexandria Coastal & Heritage Trip": 1500,
  "Luxor East & West Banks": 1900,
  "Nile Sunset Felucca": 500,
  "Cairo Street Food Evening": 850,
  "Siwa Desert Safari & Sunset": 2200,
  "Coptic Cairo & Civilization Museum": 1100,
  "Abu Simbel Day Trip": 2600,
};

const Book = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const trip = location.state?.trip || location.state?.tour;
  const tripTitle = trip?.title || "Historic Cairo Walking Trip";

  // Derive realistic unit price and currency from seed data or passed state
  const unitPrice = useMemo(() => {
    if (trip?.price) {
      const parsed = typeof trip.price === "number" ? trip.price : parseFloat(String(trip.price).replace(/[^0-9.]/g, ""));
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return SEED_TRIP_PRICES[tripTitle] || 700;
  }, [trip, tripTitle]);

  const isEGP = unitPrice >= 100 || trip?.currency === "EGP" || !String(trip?.price || "").includes("$");
  const currencySymbol = isEGP ? "ج.م" : "$";

  const [activeSlot, setActiveSlot] = useState(trip?.timeSlot || "Morning");
  const [travelers, setTravelers] = useState(1);
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });

  const totalPrice = unitPrice * travelers;

  const formattedDate = useMemo(() => {
    return selectedDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedDate]);

  const TIME_SLOTS = [
    { label: "Morning", Icon: Icons.sun },
    { label: "Afternoon", Icon: Icons.afternoon },
    { label: "Evening", Icon: Icons.event },
  ];

  const bookingPayload = {
    bookingId: `NF-${Math.floor(1000 + Math.random() * 9000)}-${tripTitle.slice(0, 5)}`,
    title: tripTitle,
    date: formattedDate,
    time: activeSlot === "Morning" ? "09:30 AM" : activeSlot === "Afternoon" ? "02:00 PM" : "06:00 PM",
    adults: travelers,
    baseRate: unitPrice * travelers,
    guideFee: Math.round(unitPrice * travelers * 0.1),
    transportFee: Math.round(unitPrice * travelers * 0.05),
    totalAmount: totalPrice,
    currency: currencySymbol,
  };

  return (
    <>
      {/* Header */}
      <div className="container d-flex justify-content-between align-items-center py-3">
        <div>
          <button
            onClick={() => navigate(-1)}
            className={`${Style.backButton} border-0 bg-transparent cursor-pointer`}
            aria-label="Go back"
          >
            <IoArrowBack />
          </button>
        </div>
        <div className="fw-bold fs-6 text-truncate px-2">{tripTitle}</div>
        <div className={`${Style.backButton}`}>
          <IoMdShare />
        </div>
      </div>

      {/* Schedule */}
      <DateComponent
        selected={selectedDate}
        onChange={(d) => setSelectedDate(d)}
      />

      <div className="container">
        <div className="py-2 fw-semibold">Select Time Slot</div>
        <div className={Style.slotsRow}>
          {TIME_SLOTS.map((slot, index) => {
            const SlotIcon = slot.Icon;
            const isSelected = slot.label === activeSlot;

            return (
              <div key={index} className={Style.timeSlot}>
                <Button
                  className={`${Style.timeSlot}`}
                  type={isSelected ? "primary" : "normal"}
                  onClick={() => setActiveSlot(slot.label)}
                >
                  {SlotIcon && <SlotIcon />}
                  {slot.label}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`container d-flex justify-content-between align-items-center bg-body-tertiary p-3 rounded-3 mt-3`}
      >
        <div className="col-md-6">
          <h5 className="mb-1 fw-bold">Travelers</h5>
          <span className="text-muted small">
            {isEGP ? `${unitPrice.toFixed(2)} ${currencySymbol}` : `${currencySymbol}${unitPrice}`} per person
          </span>
        </div>

        <div className="col-md-6 d-flex justify-content-end">
          <Counter
            initialValue={1}
            min={1}
            max={12}
            onChange={(val) => setTravelers(val)}
          />
        </div>
      </div>

      <div className="container mt-3">
        <div className="bg-body-tertiary p-4 rounded-4 shadow-sm border border-light-subtle">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <p className="text-muted mb-1 small fw-medium">
                {formattedDate} • {activeSlot}
              </p>
              <span className="text-uppercase small text-secondary fw-semibold">
                Total Price ({travelers} {travelers === 1 ? "Traveler" : "Travelers"})
              </span>
              <h2 className="fw-bolder mb-0 text-dark">
                {isEGP ? `${totalPrice.toFixed(2)} ${currencySymbol}` : `${currencySymbol}${totalPrice.toFixed(2)}`}
              </h2>
            </div>

            <div className="d-flex align-items-center gap-2 text-success px-3 py-2 bg-success-subtle rounded-3">
              <MdOutlineVerified size={18} />
              <span className="fw-semibold small">Best Price Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-4 d-flex justify-content-end">
        <Link
          to="/user/trips/book/status"
          state={bookingPayload}
          style={{ textDecoration: "none" }}
        >
          <Button type="primary">Proceed to Payment</Button>
        </Link>
      </div>
    </>
  );
};

export default Book;
