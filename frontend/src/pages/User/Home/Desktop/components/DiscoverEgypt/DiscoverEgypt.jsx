import React, { useState } from "react";
import styles from "./DiscoverEgypt.module.css";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  Clock,
  Car,
  Lightbulb,
  X,
  ArrowRight,
  Sparkles,
  MapPin,
} from "lucide-react";

import pyramids from "../../../../../../assets/images/explore/pyramids.jpg";
import museum from "../../../../../../assets/images/explore/the_grand_museum.webp";
import oldCairo from "../../../../../../assets/images/explore/old-cairo.jpg";
import khan from "../../../../../../assets/images/explore/khan-el-khalili.jpg";

const categories = [
  {
    id: "historical-sites",
    title: "Historical Sites",
    tagline: "Temples, pyramids & ancient wonders.",
    description:
      "Home to the world's only surviving Ancient Wonder. The Giza Necropolis features the Great Pyramid of Khufu, Khafre, Menkaure, and the enigmatic Sphinx, dating back to 2500 BC.",
    image: pyramids,
    location: "Giza Plateau & Saqqara",
    tickets: "EGP 540 (Foreigner) / EGP 270 (Student) | EGP 900 (Inside Great Pyramid)",
    hours: "07:00 AM - 05:00 PM Daily (Summer till 06:00 PM)",
    howToGetThere: "Metro Line 2 to Giza + Taxi / Uber directly to Entrance Gate (20-30 mins from Downtown).",
    tip: "Visit early at 07:30 AM before heat and tour buses arrive. Book tickets online to bypass the main queues.",
    highlights: [
      "Great Pyramid of Khufu interior",
      "Sphinx Enclosure & Valley Temple",
      "Panoramic 9-Pyramids Viewpoint",
      "Camel & Quad Desert Safari",
    ],
    searchCity: "Giza",
  },
  {
    id: "food-experiences",
    title: "Food Experiences",
    tagline: "Local flavors & culinary adventures.",
    description:
      "Egyptian cuisine is an ancient fusion of Mediterranean, Middle Eastern, and North African traditions spanning 5,000 years, celebrated through vibrant communal street feasts and historic tea houses.",
    image: khan,
    location: "Khan El-Khalili & Islamic Cairo",
    tickets: "Free entry to markets; authentic meal tastings from $5 - $20",
    hours: "10:00 AM - Midnight (Peak culinary vibrancy after 05:00 PM)",
    howToGetThere: "Metro Line 3 to Bab El-Shaariya or Ataba, or Careem/Uber to Al-Azhar Mosque Plaza.",
    tip: "Head to the legendary 200-year-old El Fishawy Café in Khan El-Khalili for fresh mint tea, and try Koshary for Egypt's iconic national dish.",
    highlights: [
      "National Koshary dish tasting",
      "Freshly baked Baladi bread & Ta'ameya",
      "Khan El-Khalili spice souk",
      "El Fishawy historic mirror café",
    ],
    searchCity: "Cairo",
  },
  {
    id: "museums",
    title: "Museums",
    tagline: "Artifacts, exhibitions & culture.",
    description:
      "The Grand Egyptian Museum is the world's largest archaeological complex dedicated to a single civilization, housing the complete 5,000+ piece Tutankhamun golden treasure and monumental pharaonic statues.",
    image: museum,
    location: "Pyramids Road & Fustat, Cairo",
    tickets: "EGP 1,200 (Foreigner Adult) / EGP 600 (Student) | NMEC: EGP 500",
    hours: "09:00 AM - 06:00 PM (Sat-Thu) | 09:00 AM - 09:00 PM (Friday)",
    howToGetThere: "25-35 minutes via Cairo Ring Road from Central Cairo / Zamalek directly to GEM Plaza.",
    tip: "Reserve your entry slot online in advance. The 11-meter Ramses II statue in the Grand Atrium is an unmissable photo spot.",
    highlights: [
      "Complete Tutankhamun golden collection",
      "Grand Chronological Staircase",
      "Ramses II Colossus in the Atrium",
      "Royal Mummies Hall at NMEC",
    ],
    searchCity: "Giza",
  },
  {
    id: "hidden-gems",
    title: "Hidden Gems",
    tagline: "Off-the-beaten-path discoveries.",
    description:
      "Discover tranquil off-the-beaten-path wonders: 3rd-century churches built upon Roman fortress gates, medieval alleyways, and the surreal white chalk rock sculptures of the Western Desert.",
    image: oldCairo,
    location: "Coptic Cairo & Western Desert",
    tickets: "Churches: Free Admission | Saladin Citadel: EGP 450 | Desert Safaris from $120",
    hours: "08:00 AM - 04:30 PM (Old Cairo) | 24/7 for Desert Expeditions",
    howToGetThere: "Metro Line 1 directly to 'Mar Girgis' station for Coptic Cairo churches.",
    tip: "Dress modestly covering shoulders and knees when visiting active historical churches and mosques.",
    highlights: [
      "The Hanging Church (El Muallaqa)",
      "St. Sergius Crypt where Holy Family hid",
      "White Desert wind-carved chalk sculptures",
      "Siwa Oasis healing salt lakes",
    ],
    searchCity: "Cairo",
  },
];

function DiscoverEgypt() {
  const navigate = useNavigate();
  const [activeGuide, setActiveGuide] = useState(null);

  return (
    <section id="explore-egypt" className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2>Discover Egypt</h2>
          <p>
            Explore places before you book — history, tickets, opening hours and
            how to get there.
          </p>
        </div>

        <button onClick={() => navigate("/user/discover-egypt")}>
          View All Guides
        </button>
      </div>

      <div className={styles.grid}>
        {categories.map((item) => (
          <div
            key={item.title}
            className={styles.card}
            onClick={() => setActiveGuide(item)}
          >
            <img src={item.image} alt={item.title} />

            <div className={styles.overlay}>
              <h3>{item.title}</h3>

              <p>{item.tagline}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveGuide(item);
                }}
              >
                Explore Guide →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* INTERACTIVE GUIDE MODAL */}
      {activeGuide && (
        <div
          className={styles.modalOverlay}
          onClick={() => setActiveGuide(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              onClick={() => setActiveGuide(null)}
              aria-label="Close guide modal"
            >
              <X size={20} />
            </button>

            <img
              src={activeGuide.image}
              alt={activeGuide.title}
              className={styles.modalImage}
            />

            <div className={styles.modalBody}>
              <div>
                <span className={styles.modalCategoryBadge}>
                  {activeGuide.title} Guide
                </span>
                <h2 className={styles.modalTitle}>
                  {activeGuide.title}: {activeGuide.tagline}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#003D5B", fontWeight: 700, fontSize: "0.875rem", marginTop: 4 }}>
                  <MapPin size={14} />
                  <span>{activeGuide.location}</span>
                </div>
              </div>

              <p className={styles.modalOverview}>
                {activeGuide.description}
              </p>

              <div className={styles.modalGrid}>
                <div className={styles.modalInfoBlock}>
                  <div className={styles.modalBlockTitle}>
                    <Ticket size={16} /> 2026 Ticket Prices
                  </div>
                  <div className={styles.modalBlockText}>
                    {activeGuide.tickets}
                  </div>
                </div>

                <div className={styles.modalInfoBlock}>
                  <div className={styles.modalBlockTitle}>
                    <Clock size={16} /> Opening Hours
                  </div>
                  <div className={styles.modalBlockText}>
                    {activeGuide.hours}
                  </div>
                </div>

                <div className={styles.modalInfoBlock}>
                  <div className={styles.modalBlockTitle}>
                    <Car size={16} /> How to Get There
                  </div>
                  <div className={styles.modalBlockText}>
                    {activeGuide.howToGetThere}
                  </div>
                </div>

                <div className={styles.modalInfoBlock}>
                  <div className={styles.modalBlockTitle}>
                    <Lightbulb size={16} /> Egyptologist Insider Tip
                  </div>
                  <div className={styles.modalBlockText}>
                    {activeGuide.tip}
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className={styles.modalHighlights}>
                <div className={styles.modalHighlightsTitle}>
                  <Sparkles size={16} /> Must-See Highlights
                </div>
                <ul className={styles.modalHighlightsList}>
                  {activeGuide.highlights.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.modalFooter}>
                <button
                  className={styles.modalTourButton}
                  onClick={() => {
                    const searchCity = activeGuide.searchCity;
                    setActiveGuide(null);
                    navigate(`/user/trips?search=${encodeURIComponent(searchCity)}`);
                  }}
                >
                  <span>Find Guided Tours to {activeGuide.title}</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  className={styles.modalAllGuidesButton}
                  onClick={() => {
                    setActiveGuide(null);
                    navigate("/user/discover-egypt");
                  }}
                >
                  <span>All Destination Guides</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default DiscoverEgypt;
