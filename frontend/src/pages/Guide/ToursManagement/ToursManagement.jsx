import styles from "./ToursManagement.module.css";
import {
  FaLocationDot,
  FaBell,
  FaPlus,
  FaClock,
  FaPeopleGroup,
  FaHouse,
  FaBookmark,
  FaEnvelope,
  FaRegCalendarCheck,
} from "react-icons/fa6";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../services/api";

const API_ORIGIN = "http://localhost:5000";

function getImageSrc(image) {
  if (!image) return "";
  if (image.startsWith("http") || image.startsWith("data:") || image.startsWith("blob:")) {
    return image;
  }

  if (image.startsWith("/uploads")) {
    return `${API_ORIGIN}${image}`;
  }

  return `${API_ORIGIN}/uploads/${image}`;
}

function ToursManagement({ pageData, toursData, onCreateTour, onManageTour }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [backendTours, setBackendTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const notificationCount = pageData?.notificationCount || 0;

  let tours = backendTours;

if (Array.isArray(toursData) && toursData.length > 0) {
  tours = toursData;
}

 useEffect(() => {
  const loadTours = async () => {
    try {
      const response = await apiRequest("/trips/guide/me");
      setBackendTours(response.data.tours);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  loadTours();
}, []);

  const tabs = useMemo(() => {
    const allCount = tours.length;
    const activeCount = tours.filter((trip) => trip.status === "active").length;
    const reviewCount = tours.filter((trip) => trip.status === "reviewing").length;
    const draftCount = tours.filter((trip) => trip.status === "draft").length;

    return [
      { label: `All (${allCount})`, value: "All" },
      { label: `Active (${activeCount})`, value: "active" },
      { label: `Reviewing (${reviewCount})`, value: "reviewing" },
      { label: `Drafts (${draftCount})`, value: "draft" },
    ];
  }, [tours]);

  const visibleTours = tours.filter((trip) => {
    if (activeTab === "All") return true;
    return trip.status === activeTab;
  });

  const getStatusClass = (status) => {
    if (status === "active") return styles.statusActive;
    if (status === "draft") return styles.statusDraft;
    if (status === "reviewing") return styles.statusReviewing;
    return styles.statusActive;
  };

  function handleCreateTour() {
    if (onCreateTour) {
      onCreateTour();
      return;
    }

    navigate("/guide/createtour");
  }

  function handleManageTour(trip) {
    if (onManageTour) {
      onManageTour(trip);
      return;
    }

    navigate("/guide/createtour", { state: { tripId: trip.id } });
  }

  return (
    <div className={styles.page}>
      <header className={styles.topHeader}>
        <div className={styles.topLeft}>
          <div className={styles.locationIcon}>
            <FaLocationDot />
          </div>

          <div>
           <p className={styles.smallText}>Explore</p>
           <h1 className={styles.topTitle}>Discover Egypt</h1>
          </div>
        </div>

        <button type="button" className={styles.roundButton}>
          <FaBell />
         {notificationCount > 0 && <span className={styles.dot} />}
        </button>
      </header>

      <main className={styles.content}>
        <section className={styles.hero}>
          <h2 className={styles.heroTitle}>My Tours</h2>
          <p className={styles.heroText}>
            Create, manage, and track your trip experiences.
          </p>

          <button type="button" className={styles.createButton} onClick={handleCreateTour}>
            <FaPlus />
            Create New Trip
          </button>
        </section>

        <section className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`${styles.tabButton} ${activeTab === tab.value ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </section>

        {loading ? (
          <p className={styles.heroText}>Loading your tours...</p>
        ) : (
          <section className={styles.cardsList}>
            {visibleTours.map((trip) => (
              <article key={trip.id} className={styles.card}>
                <div className={styles.cardImageWrap}>
                  <img src={getImageSrc(trip.image)} alt={trip.title} className={styles.cardImage} />
                  <span className={`${styles.badge} ${getStatusClass(trip.status)}`}>
                    {trip.statusText || trip.status}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{trip.title}</h3>

                  <div className={styles.metaRow}>
                    <span className={styles.metaItem}>
                      <FaClock />
                      {trip.duration}
                    </span>
                    <span className={styles.metaItem}>
                      <FaPeopleGroup />
                      Max {trip.groupSize}
                    </span>
                  </div>

                  <div className={styles.bottomRow}>
                    <p className={styles.price}>
                      ${trip.price} <span>/ person</span>
                    </p>

                    <button
                      type="button"
                      className={styles.manageButton}
                      onClick={() => handleManageTour(trip)}
                    >
                      {trip.actionLabel || "Manage"} →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      {/* <footer className={styles.bottomNav}>
        <button type="button" className={styles.navItem}>
          <FaHouse />
          <span>Home</span>
        </button>

        <button type="button" className={`${styles.navItem} ${styles.navActive}`}>
          <FaRegCalendarCheck />
          <span>My Tours</span>
        </button>

        <button type="button" className={styles.navItem}>
          <FaBookmark />
          <span>Saved</span>
        </button>

        <button type="button" className={styles.navItem}>
          <FaEnvelope />
          <span>Inbox</span>
        </button>
      </footer> */}


    </div>
  );
}

export default ToursManagement;
