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

function ToursManagement({ pageData, toursData, onCreateTour, onManageTour }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [backendTours, setBackendTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const headerData = pageData || {
    exploreText: "Explore",
    title: "Discover Egypt",
    notificationCount: 1,
  };

  const tours = Array.isArray(toursData) && toursData.length > 0 ? toursData : backendTours;

  useEffect(() => {
    async function loadTours() {
      try {
        const response = await apiRequest("/trips/guide/me");
        setBackendTours(response?.data?.tours || []);
      } catch (error) {
        console.error(error);
        setBackendTours([]);
      } finally {
        setLoading(false);
      }
    }

    loadTours();
  }, []);

  const tabs = useMemo(() => {
    const allCount = tours.length;
    const activeCount = tours.filter((tour) => tour.status === "active").length;
    const reviewCount = tours.filter((tour) => tour.status === "reviewing").length;
    const draftCount = tours.filter((tour) => tour.status === "draft").length;

    return [
      { label: `All (${allCount})`, value: "All" },
      { label: `Active (${activeCount})`, value: "active" },
      { label: `Reviewing (${reviewCount})`, value: "reviewing" },
      { label: `Drafts (${draftCount})`, value: "draft" },
    ];
  }, [tours]);

  const visibleTours = tours.filter((tour) => {
    if (activeTab === "All") return true;
    return tour.status === activeTab;
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

  function handleManageTour(tour) {
    if (onManageTour) {
      onManageTour(tour);
      return;
    }

    navigate("/guide/createtour", { state: { tripId: tour.id } });
  }

  return (
    <div className={styles.page}>
      <header className={styles.topHeader}>
        <div className={styles.topLeft}>
          <div className={styles.locationIcon}>
            <FaLocationDot />
          </div>

          <div>
            <p className={styles.smallText}>{headerData.exploreText}</p>
            <h1 className={styles.topTitle}>{headerData.title}</h1>
          </div>
        </div>

        <button type="button" className={styles.roundButton}>
          <FaBell />
          {headerData.notificationCount > 0 ? <span className={styles.dot} /> : null}
        </button>
      </header>

      <main className={styles.content}>
        <section className={styles.hero}>
          <h2 className={styles.heroTitle}>My Tours</h2>
          <p className={styles.heroText}>
            Manage your curated experiences and track their performance.
          </p>

          <button type="button" className={styles.createButton} onClick={handleCreateTour}>
            <FaPlus />
            Create New Tour
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
            {visibleTours.map((tour) => (
              <article key={tour.id} className={styles.card}>
                <div className={styles.cardImageWrap}>
                  <img src={tour.image} alt={tour.title} className={styles.cardImage} />
                  <span className={`${styles.badge} ${getStatusClass(tour.status)}`}>
                    {tour.statusText || tour.status}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{tour.title}</h3>

                  <div className={styles.metaRow}>
                    <span className={styles.metaItem}>
                      <FaClock />
                      {tour.duration}
                    </span>
                    <span className={styles.metaItem}>
                      <FaPeopleGroup />
                      Max {tour.groupSize}
                    </span>
                  </div>

                  <div className={styles.bottomRow}>
                    <p className={styles.price}>
                      ${tour.price} <span>/ person</span>
                    </p>

                    <button
                      type="button"
                      className={styles.manageButton}
                      onClick={() => handleManageTour(tour)}
                    >
                      {tour.actionLabel || "Manage"} →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <footer className={styles.bottomNav}>
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
      </footer>
    </div>
  );
}

export default ToursManagement;