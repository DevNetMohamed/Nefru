import styles from "./CreateTour.module.css";
import { FaArrowLeft, FaPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../../../services/api";

function CreateTour({ tourData = {}, onBack, onNext }) {
  const navigate = useNavigate();
  const location = useLocation();
  const editingTripId = location.state?.tripId;

  const categories = [
    "History & Culture",
    "Food & Culinary",
    "Adventure",
    "Luxury",
    "Nile Cruise",
    "Desert Safari",
  ];

  const [title, setTitle] = useState(tourData.title || "");
  const [city, setCity] = useState(tourData.city || "");
  const [price, setPrice] = useState(tourData.price || "");
  const [groupSize, setGroupSize] = useState(tourData.groupSize || 12);
  const [durationValue, setDurationValue] = useState(tourData.durationValue || "");
  const [description, setDescription] = useState(tourData.description || "");
  const [selectedCategories, setSelectedCategories] = useState(
    tourData.categories || [categories[0]],
  );
  const [loading, setLoading] = useState(false);
  const [loadingTrip, setLoadingTrip] = useState(Boolean(editingTripId));

  useEffect(() => {
    async function loadTrip() {
      if (!editingTripId) return;

      setLoadingTrip(true);

      try {
        const response = await apiRequest(`/trips/${editingTripId}`);
        const trip = response?.data;

        const categoryReverseMap = {
          History: "History & Culture",
          Food: "Food & Culinary",
          Adventure: "Adventure",
          Culture: "History & Culture",
        };

        const durationMatch = `${trip.duration || ""}`.match(/^(\d+)/);

        setTitle(trip.title || "");
        setCity(trip.location || "");
        setPrice(trip.price || "");
        setGroupSize(trip.groupSize || 12);
        setDurationValue(durationMatch?.[1] || "");
        setDescription(trip.description || "");
        setSelectedCategories([categoryReverseMap[trip.category] || categories[0]]);
      } catch (error) {
        console.error(error);
        alert(error.message);
      } finally {
        setLoadingTrip(false);
      }
    }

    loadTrip();
  }, [editingTripId]);

  function handleBack() {
    navigate("/guide");
  }

  function toggleCategory(category) {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category);
      }

      return [...prev, category].slice(-3);
    });
  }

  async function handleNext() {
    if (!title.trim() || !city.trim() || !description.trim() || !durationValue || !price) {
      alert("Please fill in the main trip information first.");
      return;
    }

    setLoading(true);

    const categoryMap = {
      "History & Culture": "History",
      "Food & Culinary": "Food",
      Adventure: "Adventure",
      Luxury: "Culture",
      "Nile Cruise": "Culture",
      "Desert Safari": "Adventure",
    };

    const payload = {
      title,
      description,
      location: city,
      price: Number(price),
      duration: `${durationValue} Hours`,
      category: categoryMap[selectedCategories[0] || "History & Culture"] || "History",
      groupSize: Number(groupSize) || 12,
    };

    try {
      const response = editingTripId
        ? await apiRequest(`/trips/${editingTripId}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          })
        : await apiRequest("/trips", {
            method: "POST",
            body: JSON.stringify(payload),
          });

      const tripId = response?.data?.id || editingTripId;

      if (onNext) {
        onNext();
        return;
      }

      navigate("/guide/schedule", { state: { tripId } });
    } catch (error) {
      console.error(error);
      // show stack trace to help identify where 'role' access failed
      alert(`${error.message}\n\n${error.stack || ""}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.backButton} onClick={handleBack}>
          <FaArrowLeft />
        </button>

        <h1 className={styles.title}>{editingTripId ? "Edit Trip" : "Create Trip"}</h1>

        <div className={styles.headerSpace} />
      </header>

      <main className={styles.content}>
        <div className={styles.stepper}>
          <div className={`${styles.stepLine} ${styles.stepLineActive}`} />
          <div className={styles.stepLine} />

          <div className={`${styles.step} ${styles.stepActive}`}>1</div>
          <div className={styles.step}>2</div>
          <div className={styles.step}>3</div>
          <div className={styles.step}>4</div>
        </div>

        <section className={styles.card}>
          {loadingTrip && <p className={styles.helperText}>Loading saved trip data...</p>}

          <div className={styles.formGroup}>
            <label className={styles.label}>TOUR TITLE</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g., Hidden Gems of Cairo"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <p className={styles.helperText}>Make it catchy and descriptive.</p>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>DESTINATION CITY</label>
           
              <input
                className={styles.input}
                type="text"
                placeholder="e.g. Cairo"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
          </div>

          <div className={styles.separator} />

          <div className={styles.formGroup}>
            <div className={styles.sectionTop}>
              <div>
                <label className={styles.label}>CATEGORIES (SELECT UP TO 3)</label>
                <p className={styles.helperText}>
                  Help travelers filter and find your trip based on their interests.
                </p>
              </div>
            </div>

            <div className={styles.chipsGrid}>
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`${styles.chip} ${selectedCategories.includes(item) ? styles.chipActive : ""}`}
                  onClick={() => toggleCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.separator} />

          <div className={styles.formGroup}>
            <label className={styles.label}>DURATION (HOURS)</label>
            <div className={styles.durationRow}>
              <input
                className={styles.durationInput}
                type="number"
                placeholder="e.g. 4"
                value={durationValue}
                onChange={(event) => setDurationValue(event.target.value)}
              />
              <span className={styles.durationUnit}>Hours</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>BASE PRICE (PER PERSON)</label>
            <div className={styles.priceBox}>
              <span className={styles.currency}>$</span>
              <input
                className={styles.priceInput}
                type="text"
                placeholder="0.00"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
              <span className={styles.currencyLabel}>USD</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>MAX GROUP SIZE</label>
            <div className={styles.priceBox}>
              <input
                className={styles.priceInput}
                type="number"
                min="1"
                value={groupSize}
                onChange={(event) => setGroupSize(event.target.value)}
              />
            </div>
          </div>

          <div className={styles.separator} />

          <div className={styles.formGroup}>
            <div className={styles.sectionTop}>
              <label className={styles.label}>TOUR DESCRIPTION</label>
              <span className={styles.counter}>{description.length} / 1000</span>
            </div>

            <textarea
              className={styles.textarea}
              placeholder="Describe what makes this trip special. What will travelers experience? Highlight key sights and the overall atmosphere."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.nextButton} onClick={handleNext}>
              <FaPlus />
              {loading ? "Saving..." : "Next Step"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CreateTour;
