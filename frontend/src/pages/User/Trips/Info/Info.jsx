import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaStar,
  FaLocationDot,
  FaClock,
  FaCircleCheck,
  FaUsers,
  FaCarSide,
  FaUtensils,
  FaUserTie,
  FaChevronRight,
} from "react-icons/fa6";
import { FiShare2, FiBookmark } from "react-icons/fi";
import styles from "./Info.module.css";

function Info({ tourData }) {
  const navigate = useNavigate();
  const trip = tourData || {};

  const highlights = trip.highlights || [
    { icon: <FaUsers />, title: "Small Group", text: "(Max 6)" },
    { icon: <FaCarSide />, title: "Luxury", text: "Transfers" },
    { icon: <FaUtensils />, title: "Breakfast", text: "Included" },
    { icon: <FaUserTie />, title: "Expert", text: "Egyptologist" },
  ];

  const reviews = trip.reviews || [
    {
      id: 1,
      name: "Eleanor V.",
      date: "October 2023",
      text: "Absolutely mesmerizing. Seeing the pyramids at sunrise without the crowds is a must.",
      avatar: "",
      rating: 5,
    },
    {
      id: 2,
      name: "James W.",
      date: "September 2023",
      text: "The luxury transfer was smooth, and the breakfast view was incredible.",
      avatar: "",
      rating: 5,
    },
  ];

  const guide = trip.guide || {
    name: "Dr. Zahi M.",
    badge: "PhD Egyptology",
    rating: "4.9",
    reviewsCount: "450",
    about:
      "A passionate historian and seasoned storyteller. With over 15 years of experience, he brings the ancient world to life.",
    avatar: "",
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
        </button>

        <h1 className={styles.headerTitle}>Tours</h1>

        <div className={styles.headerActions}>
          <button type="button" className={styles.iconButton}>
            <FiShare2 />
          </button>
          <button type="button" className={styles.iconButton}>
            <FiBookmark />
          </button>
        </div>
      </header>

      <main className={styles.content}>
        <section className={styles.hero}>
          <img
            src={trip.image || ""}
            alt={trip.title || "Trip"}
            className={styles.heroImage}
          />
        </section>

        <section className={styles.bookingBar}>
          <div className={styles.priceBox}>
            <div className={styles.priceLine}>
              <span className={styles.price}>${trip.price || 185}</span>
              <span className={styles.perPerson}>/ person</span>
            </div>

            <p className={styles.dateLine}>
              {trip.date || "Oct 24"} - {trip.guests || "1 guest"}
            </p>
          </div>

          <button type="button" className={styles.reserveButton}>
            Reserve
          </button>
        </section>

        <section className={styles.tagsRow}>
          <span className={styles.mainTag}>NEFRU Original</span>
          <span className={styles.secondTag}>Guided Trip</span>
        </section>

        <section className={styles.titleSection}>
          <h2 className={styles.title}>
            {trip.title || "Majestic Pyramids & Sphinx Exclusive Sunrise Trip"}
          </h2>

          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <FaStar className={styles.starIcon} />
              <span className={styles.boldText}>
                {trip.rating || "4.96"}
              </span>
              <span className={styles.linkText}>
                ({trip.reviewsCount || "128 reviews"})
              </span>
            </div>

            <div className={styles.metaItem}>
              <FaLocationDot className={styles.metaIcon} />
              <span className={styles.normalText}>
                {trip.location || "Giza, Egypt"}
              </span>
            </div>

            <div className={styles.metaItem}>
              <FaClock className={styles.metaIcon} />
              <span className={styles.normalText}>
                {trip.duration || "4 Hours"}
              </span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>About this experience</h3>
          <p className={styles.paragraph}>
            {trip.description ||
              "Experience the awe-inspiring Great Pyramids of Giza before the crowds arrive. This exclusive sunrise trip offers unparalleled access to one of the world's most iconic ancient sites."}
          </p>

          <p className={styles.paragraph}>
            {trip.longDescription ||
              "Accompanied by a leading Egyptologist, you'll uncover the secrets of the Pharaohs, explore the enigmatic Sphinx, and gain a deeper understanding of the monumental architecture."}
          </p>

          <button type="button" className={styles.readMore}>
            Read full description <FaChevronRight />
          </button>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Experience Highlights</h3>

          <div className={styles.highlightsGrid}>
            {highlights.map((item, index) => (
              <div key={index} className={styles.highlightCard}>
                <div className={styles.highlightIcon}>{item.icon}</div>
                <div className={styles.highlightText}>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Meet your Guide</h3>

          <div className={styles.guideCard}>
            <img
              src={guide.avatar || ""}
              alt={guide.name}
              className={styles.guideAvatar}
            />

            <div className={styles.guideBody}>
              <h4 className={styles.guideName}>{guide.name}</h4>

              <div className={styles.guideMeta}>
                <span className={styles.guideBadge}>{guide.badge}</span>
                <span className={styles.guideRate}>
                  <FaStar className={styles.starIcon} />
                  {guide.rating} ({guide.reviewsCount} reviews)
                </span>
              </div>

              <p className={styles.guideText}>{guide.about}</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.reviewsHeader}>
            <h3 className={styles.sectionTitle}>Guest Reviews</h3>
            <button type="button" className={styles.seeAll}>
              See all {trip.reviewsCount || 128}
            </button>
          </div>

          <div className={styles.reviewsList}>
            {reviews.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewTop}>
                  <img
                    src={review.avatar || ""}
                    alt={review.name}
                    className={styles.reviewAvatar}
                  />

                  <div>
                    <h4 className={styles.reviewName}>{review.name}</h4>
                    <p className={styles.reviewDate}>{review.date}</p>
                  </div>
                </div>

                <div className={styles.reviewStars}>
                  {Array.from({ length: review.rating || 5 }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>

                <p className={styles.reviewText}>"{review.text}"</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Info;