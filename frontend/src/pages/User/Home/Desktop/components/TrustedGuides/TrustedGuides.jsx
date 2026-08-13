import styles from "./TrustedGuides.module.css";
import { useNavigate } from "react-router-dom";

import guide1 from "../../../../../../assets/images/guiders/guide1.webp";
import guide2 from "../../../../../../assets/images/guiders/guide3.webp";
import guide3 from "../../../../../../assets/images/guiders/guide4.webp";

const defaultGuides = [
  {
    id: 1,
    name: "Ahmed Kamal",
    rating: "4.9",
    languages: "Arabic • English",
    experience: "8 Years Experience",
    image: guide1,
  },
  {
    id: 2,
    name: "Sara Hassan",
    rating: "4.8",
    languages: "English • French",
    experience: "6 Years Experience",
    image: guide2,
  },
  {
    id: 3,
    name: "Mohamed Adel",
    rating: "4.9",
    languages: "Arabic • German",
    experience: "10 Years Experience",
    image: guide3,
  },
  {
    id: 4,
    name: "Nour Ramadan",
    rating: "4.7",
    languages: "Arabic • English",
    experience: "5 Years Experience",
    image: guide1,
  },
];

// Bug #4 fixed: handle Vite bundled asset paths that start with "/"
const getImgSrc = (img, fallback) => {
  if (!img) return fallback;
  if (
    typeof img === "string" &&
    (img.startsWith("http://") ||
      img.startsWith("https://") ||
      img.startsWith("data:") ||
      img.startsWith("/"))
  ) {
    return img;
  }
  return `http://localhost:5000/uploads/${img}`;
};

function TrustedGuides({ guides }) {
  const navigate = useNavigate();
  const displayGuides = guides && guides.length > 0
    ? guides.map((g, idx) => ({
        id: g._id || idx,
        name: g.user?.fullName || g.name || "Local Guide",
        rating: g.rating ? String(g.rating) : "4.9",
        languages: Array.isArray(g.languages) && g.languages.length > 0
          ? g.languages.join(" • ")
          : (typeof g.languages === "string" ? g.languages : "Arabic • English"),
        experience: g.yearsExperience
          ? `${g.yearsExperience} Years Experience`
          : (g.experience || "5 Years Experience"),
        image: getImgSrc(g.user?.avatar || g.heroImage, [guide1, guide2, guide3][idx % 3]),
      }))
    : defaultGuides;

  return (
    <section
      id="top-guides"
      className={styles.section}
    >
      <div className={styles.header}>
        <div>
          <h2>Trusted Local Guides</h2>

          <p>
            Meet experienced guides ready to
            help you discover Egypt.
          </p>
        </div>

        {/* Bug #7 fixed: View All Guides button */}
        <button onClick={() => navigate("/user/discover")}>
          View All Guides
        </button>
      </div>

      <div className={styles.grid}>
        {displayGuides.map((guide) => (
          <div
            key={guide.id}
            className={styles.card}
          >
            <img
              src={guide.image}
              alt={guide.name}
            />

            <h3>{guide.name}</h3>

            <div className={styles.rating}>
              ⭐ {guide.rating}
            </div>

            <p>{guide.languages}</p>

            <span>
              {guide.experience}
            </span>

            {/* Bug #7 fixed: View Profile button */}
            <button onClick={() => navigate("/user/discover")}>
              View Profile
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrustedGuides;