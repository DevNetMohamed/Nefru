import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  MapPin,
  Clock,
  Ticket,
  Car,
  Lightbulb,
  Search,
  ChevronDown,
  ArrowRight,
  Info,
  X,
  Compass,
  Landmark,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Home,
  Briefcase,
  Heart,
  User,
  ChevronRight,
} from "lucide-react";

import useIsMobile from "../../../hooks/useIsMobile";
import MobilePageHeader from "../../../shared/components/MobilePageHeader/MobilePageHeader";
import DesktopNavbar from "../Home/components/DesktopNavbar/DesktopNavbar";
import Footer from "../Home/Desktop/components/Footer/Footer";
import styles from "./DiscoverEgyptPage.module.css";

// Image assets
import pyramidsImg from "../../../assets/images/explore/pyramids.jpg";
import sphinxImg from "../../../assets/images/explore/Sphinx.jpg";
import museumImg from "../../../assets/images/explore/the_grand_museum.webp";
import oldCairoImg from "../../../assets/images/explore/old-cairo.jpg";
import khanImg from "../../../assets/images/explore/khan-el-khalili.jpg";
import nileImg from "../../../assets/images/explore/nile-felucca.jpg";
import safariImg from "../../../assets/images/explore/desert-safari.jpg";
import luxorImg from "../../../assets/images/tours/Luxor.jpg";

const PLACES_DATA = [
  {
    id: "giza-pyramids",
    title: "The Great Pyramids & Sphinx",
    category: "Historical Sites",
    city: "Giza",
    location: "Al Haram, Giza Governorate",
    image: pyramidsImg,
    badge: "Must Visit #1",
    description:
      "The last surviving wonder of the ancient world. Built during the Fourth Dynasty (c. 2500 BC) for Pharaohs Khufu, Khafre, and Menkaure.",
    longHistory:
      "Constructed over 4,500 years ago, the Giza Plateau contains the Great Pyramid of Giza (Khufu), the Pyramid of Khafre, the Pyramid of Menkaure, and the iconic Great Sphinx. Built with over 2.3 million limestone blocks, it remains humanity's greatest architectural feat of the ancient world.",
    tickets: {
      general: "EGP 540 (Foreigner) / EGP 270 (Student)",
      khufuInside: "EGP 900 (Inside Great Pyramid)",
      khafreInside: "EGP 220 (Inside Khafre)",
      egyptians: "EGP 60 (Adult) / EGP 30 (Student)",
    },
    hours: "07:00 AM - 05:00 PM (Daily, Summer till 06:00 PM)",
    bestTime: "Early morning at 07:30 AM before heat & bus groups",
    howToGetThere:
      "Take Cairo Metro Line 2 to 'Giza' Station, then a 15-minute Careem/Uber ride directly to the Mina House or Sphinx Entrance Gate.",
    insiderTip:
      "Purchase tickets online at the official MOTA website to skip the main ticketing queue, and always agree on camel/horse ride prices at the official government stalls.",
    highlights: [
      "Great Pyramid of Khufu interior",
      "Panoramic viewpoint for 9 pyramids aligned",
      "Great Sphinx enclosure & Valley Temple",
      "Solar Boat exhibition area",
    ],
  },
  {
    id: "grand-museum",
    title: "The Grand Egyptian Museum (GEM)",
    category: "Museums",
    city: "Giza",
    location: "Pyramids Road, Giza",
    image: museumImg,
    badge: "World's Largest Museum",
    description:
      "The largest archaeological museum complex in the world, dedicated to a single civilization, housing over 100,000 ancient artifacts.",
    longHistory:
      "Spanning nearly 500,000 square meters, the GEM is Egypt's crown cultural jewel. It houses the complete Tutankhamun collection for the first time in history, the colossal 3,200-year-old statue of Ramses II in the Grand Atrium, and a monumental staircase with sweeping views of the Pyramids.",
    tickets: {
      general: "EGP 1,200 (Foreigner Adult) / EGP 600 (Student)",
      egyptians: "EGP 200 (Adult) / EGP 100 (Student)",
      guidedTour: "Included in premium entrance tickets",
    },
    hours: "09:00 AM - 06:00 PM (Sat - Thu) | 09:00 AM - 09:00 PM (Friday)",
    bestTime: "Late afternoon for stunning sunset views of the pyramids from the Grand Stairs",
    howToGetThere:
      "Direct Uber/Taxi from Central Cairo (approx. 25-35 mins via Cairo Ring Road) to the Main Museum Plaza Gate.",
    insiderTip:
      "Book your entrance ticket slot online at least 3 days in advance during peak season (Oct - April).",
    highlights: [
      "Complete 5,000+ piece King Tutankhamun golden treasure",
      "Colossal 11-meter Ramses II Grand Hall Statue",
      "Grand Staircase chronologically arranged by dynasties",
      "Children's Museum and immersive VR exhibits",
    ],
  },
  {
    id: "old-cairo",
    title: "Historic Cairo & Citadel of Saladin",
    category: "Cultural Walks",
    city: "Cairo",
    location: "Salah Salem St, Al-Abageyah, Cairo",
    image: oldCairoImg,
    badge: "UNESCO Heritage",
    description:
      "Centuries of medieval Islamic and Coptic heritage, Ottoman domes, and the dramatic hilltop fortress built by Saladin in 1176 AD.",
    longHistory:
      "Founded in the 10th century, Historic Cairo is one of the world's oldest Islamic cities. Saladin's Citadel served as the seat of Egyptian government for nearly 700 years and features the alabaster Mosque of Muhammad Ali.",
    tickets: {
      general: "EGP 450 (Foreigner) / EGP 230 (Student)",
      copticChurches: "Free Admission (Donations welcomed)",
      egyptians: "EGP 60 (Adult) / EGP 30 (Student)",
    },
    hours: "08:00 AM - 04:30 PM (Daily)",
    bestTime: "Morning for Coptic Cairo, 03:00 PM for Citadel skyline panoramas",
    howToGetThere:
      "For Coptic Cairo: Metro Line 1 to 'Mar Girgis' station right outside the Hanging Church. For Citadel: Taxi / Uber to Salah Salem gate.",
    insiderTip:
      "Visit the Hanging Church (El Muallaqa) and St. Sergius (where the Holy Family hid) in the morning, then taxi to the Citadel for lunch.",
    highlights: [
      "Muhammad Ali Alabaster Mosque",
      "The Hanging Church (3rd Century AD)",
      "National Military Museum inside the fortress",
      "Panoramic views over Cairo and distant Pyramids",
    ],
  },
  {
    id: "khan-el-khalili",
    title: "Khan El-Khalili & Al-Muizz Street",
    category: "Food & Bazaars",
    city: "Cairo",
    location: "El-Gamaleya, Islamic Cairo",
    image: khanImg,
    badge: "Ancient Bazaar",
    description:
      "Vibrant 14th-century souk and open-air medieval street packed with brass lamps, spices, perfumes, gold, and historical cafes.",
    longHistory:
      "Established during the Mamluk era in 1382 by Emir Djaharks el-Khalili, this historic market is the commercial heart of old Cairo. Neighboring Al-Muizz Street has the greatest concentration of medieval architectural treasures in the Islamic world.",
    tickets: {
      general: "Free Entry to Bazaar & Al-Muizz Street",
      complexQalawun: "EGP 180 (Foreigner) / EGP 90 (Student)",
      egyptians: "Free to market / EGP 20 for monument interiors",
    },
    hours: "10:00 AM - 11:30 PM (Peak atmosphere from 05:00 PM onwards)",
    bestTime: "Late afternoon transitioning into illuminated night",
    howToGetThere:
      "Metro Line 3 to 'Bab El-Shaariya' or 'Ataba', then 10 min walk or short taxi to Al-Azhar Mosque.",
    insiderTip:
      "Stop by El Fishawy Café (operating continuously since 1797) for fresh mint tea and shisha, and remember that bargaining is expected in the shopping alleys.",
    highlights: [
      "El Fishawy 200-year-old mirror cafe",
      "Qalawun Complex and Sultan Barquq Madrasa",
      "Bab Zuweila historic city gate",
      "Handcrafted brass lamps and silver artisans",
    ],
  },
  {
    id: "karnak-temple",
    title: "Karnak Temple & Luxor Temples",
    category: "Historical Sites",
    city: "Luxor",
    location: "East Bank, Luxor",
    image: luxorImg,
    badge: "World's Largest Temple",
    description:
      "A vast open-air museum built over 2,000 years by more than 30 successive pharaohs in honor of Amun-Ra.",
    longHistory:
      "Karnak is the largest religious complex ever constructed in the ancient world. The Great Hypostyle Hall features 134 massive sandstone columns standing 21 meters high, resembling a petrified forest of papyrus plants.",
    tickets: {
      karnakGeneral: "EGP 450 (Foreigner) / EGP 230 (Student)",
      luxorTemple: "EGP 400 (Foreigner) / EGP 200 (Student)",
      avenueOfSphinxes: "Included in Temple ticket",
    },
    hours: "06:00 AM - 05:30 PM (Daily)",
    bestTime: "06:30 AM sunrise at Karnak, 06:00 PM night illumination at Luxor Temple",
    howToGetThere:
      "Located directly inside Luxor city; walkable or 5-minute horse carriage / taxi from any East Bank hotel.",
    insiderTip:
      "Walk the newly restored 2.7 km Avenue of Sphinxes connecting Karnak to Luxor Temple in the late afternoon.",
    highlights: [
      "Hypostyle Hall with 134 colossal columns",
      "Sacred Lake and monumental scarab beetle statue",
      "Obelisks of Queen Hatshepsut and Thutmose I",
      "Illuminated Avenue of Sphinxes",
    ],
  },
  {
    id: "valley-of-kings",
    title: "Valley of the Kings & Hatshepsut Temple",
    category: "Historical Sites",
    city: "Luxor",
    location: "West Bank, Luxor",
    image: sphinxImg,
    badge: "Royal Necropolis",
    description:
      "The subterranean burial place of New Kingdom Pharaohs, featuring vividly painted tomb walls preserved for 3,500 years.",
    longHistory:
      "Between 1539 and 1075 BC, tombs were hewn deep into the limestone cliffs of the Theban hills. Over 60 royal tombs have been discovered, including Tutankhamun (KV62), Ramses VI, and Seti I.",
    tickets: {
      generalPass: "EGP 600 (Includes entry to 3 standard tombs)",
      kingTutTomb: "EGP 500 extra",
      setiITomb: "EGP 1,800 extra (Exceptional preservation)",
      hatshepsutTemple: "EGP 360 (Foreigner)",
    },
    hours: "06:00 AM - 05:00 PM (Daily)",
    bestTime: "Early morning 06:00 AM before extreme desert heat",
    howToGetThere:
      "Take the public ferry (EGP 10) from Luxor East Bank to West Bank, then hire a licensed taxi or join a guided minivan.",
    insiderTip:
      "Your standard ticket allows entry to any 3 tombs open on that day. Ask your guide which 3 have the best-preserved colors.",
    highlights: [
      "Vivid astronomical ceilings in Tomb of Ramses IV & IX",
      "Terraced cliff temple of Queen Hatshepsut at Deir el-Bahari",
      "Colossi of Memnon statues",
      "Tutankhamun's original burial chamber",
    ],
  },
  {
    id: "philae-temple",
    title: "Philae Temple of Isis & Nubian Island",
    category: "Hidden Gems",
    city: "Aswan",
    location: "Agilkia Island, Aswan",
    image: nileImg,
    badge: "Island Sanctuary",
    description:
      "Picturesque Greco-Roman island temple dedicated to the goddess Isis, rescued from flooding by UNESCO and rebuilt stone-by-stone.",
    longHistory:
      "Perched on Agilkia Island in the reservoir of the Aswan Low Dam, Philae was the last stronghold of the ancient Egyptian religion, where hieroglyphic writing was practiced until 452 AD.",
    tickets: {
      general: "EGP 450 (Foreigner) / EGP 230 (Student)",
      boatTransfer: "Approx. EGP 300 - 400 per boat (Official Marina Rate)",
      egyptians: "EGP 60 (Adult) / EGP 30 (Student)",
    },
    hours: "07:00 AM - 05:00 PM (Daily)",
    bestTime: "Mid-morning or late afternoon by water",
    howToGetThere:
      "Taxi from downtown Aswan to Philae Marina (Shellal), followed by a scenic 10-minute motorboat to Agilkia Island.",
    insiderTip:
      "Combine Philae Temple in the morning with an afternoon Felucca ride to the colorful Nubian Village of Gharb Soheil.",
    highlights: [
      "Trajan's Kiosk (The Pharaoh's Bed)",
      "Pylon reliefs depicting goddess Isis and Osiris",
      "Sound and Light night show on the island",
      "Nubian traditional handicraft markets at the marina",
    ],
  },
  {
    id: "white-desert",
    title: "White Desert & Black Desert Safari",
    category: "Hidden Gems",
    city: "Cairo",
    location: "Farafra & Bahariya Oasis, Western Desert",
    image: safariImg,
    badge: "Natural Wonder",
    description:
      "Otherworldly wind-carved chalk rock sculptures, crystal mountain, volcanic cones, and serene desert night skies.",
    longHistory:
      "Formed millions of years ago when the area was an ancient seabed, wind erosion has sculpted chalk rock into surreal forms resembling giant mushrooms, ice cream cones, and resting camels.",
    tickets: {
      nationalParkFee: "USD 10 (Included in organized safari packages)",
      jeepSafari: "Ranging from $120 - $220 for 2-day all-inclusive",
    },
    hours: "Open 24/7 (Guided 4x4 expedition required)",
    bestTime: "October through April (Mild daytime, cool starry nights)",
    howToGetThere:
      "4 to 5-hour private transfer or bus from Cairo to Bahariya Oasis, then switch to a Bedouin 4x4 Land Cruiser.",
    insiderTip:
      "Bring warm clothing for the night — desert temperatures can drop rapidly after sunset even in spring.",
    highlights: [
      "Chalk mushroom and chicken rock formations",
      "Crystal Mountain natural calcite arch",
      "Traditional Bedouin barbecue under the Milky Way",
      "Sandboarding down the great dunes of Bahariya",
    ],
  },
];

const CITIES = [
  "All Cities",
  "Cairo",
  "Giza",
  "Luxor",
  "Aswan",
];

const CATEGORIES = [
  "All",
  "Historical Sites",
  "Museums",
  "Cultural Walks",
  "Food & Bazaars",
  "Hidden Gems",
];

export default function DiscoverEgyptPage() {
  const isMobile = useIsMobile(992);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || "All Cities"
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );

  // Selected place for modal
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Sync with URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCity !== "All Cities") params.set("city", selectedCity);
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCity, selectedCategory, setSearchParams]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCity("All Cities");
    setSelectedCategory("All");
  };

  const filteredPlaces = useMemo(() => {
    return PLACES_DATA.filter((place) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = place.title.toLowerCase().includes(q);
        const matchesCity = place.city.toLowerCase().includes(q);
        const matchesDesc = place.description.toLowerCase().includes(q);
        const matchesCategory = place.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCity && !matchesDesc && !matchesCategory) {
          return false;
        }
      }

      if (selectedCity !== "All Cities" && place.city !== selectedCity) {
        return false;
      }

      if (
        selectedCategory !== "All" &&
        !place.category.toLowerCase().includes(selectedCategory.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCity, selectedCategory]);

  const hasActiveFilters =
    searchQuery ||
    selectedCity !== "All Cities" ||
    selectedCategory !== "All";

  return (
    <div className={styles.container}>
      <DesktopNavbar />

      {/* MAIN CONTENT */}
      <main className={styles.main}>
        {/* FILTERS */}
        <div className={styles.filterCard}>
          <div className={styles.searchRow}>
            <div className={styles.dropdowns}>
              {/* City Filter */}
              <div className={styles.selectWrapper}>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className={styles.selectInput}
                  aria-label="Filter by City"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      📍 {city}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className={styles.selectIcon} />
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className={styles.categoryPills}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`${styles.pill} ${
                  selectedCategory === cat ? styles.pillActive : ""
                }`}
              >
                {cat === "All" ? "🏛️ All Places" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS HEADER */}
        <div className={styles.resultsHeader}>
          <div className={styles.resultsCount}>
            Showing {filteredPlaces.length}{" "}
            <span>
              {filteredPlaces.length === 1 ? "destination guide" : "destination guides"}
            </span>
          </div>

          {hasActiveFilters && (
            <button onClick={resetFilters} className={styles.resetBtn}>
              <RotateCcw size={14} /> Reset Filters
            </button>
          )}
        </div>

        {/* PLACES GRID */}
        {filteredPlaces.length > 0 ? (
          <div className={styles.grid}>
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                className={styles.card}
                onClick={() => setSelectedPlace(place)}
              >
                <div className={styles.cardImageWrapper}>
                  <img
                    src={place.image}
                    alt={place.title}
                    className={styles.cardImage}
                    loading="lazy"
                  />
                  <span className={styles.cardBadge}>{place.category}</span>
                  <span className={styles.cardCityBadge}>
                    <MapPin size={12} /> {place.city}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{place.title}</h3>
                  <p className={styles.cardDescription}>{place.description}</p>

                  {/* QUICK INFO BOX */}
                  <div className={styles.quickInfoBox}>
                    <div className={styles.infoRow}>
                      <Ticket size={16} className={styles.infoIcon} />
                      <div>
                        <span className={styles.infoLabel}>Tickets:</span>
                        <span>{place.tickets.general}</span>
                      </div>
                    </div>

                    <div className={styles.infoRow}>
                      <Clock size={16} className={styles.infoIcon} />
                      <div>
                        <span className={styles.infoLabel}>Hours:</span>
                        <span>{place.hours}</span>
                      </div>
                    </div>

                    <div className={styles.infoRow}>
                      <Car size={16} className={styles.infoIcon} />
                      <div>
                        <span className={styles.infoLabel}>Transport:</span>
                        <span>{place.howToGetThere}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <button
                      className={styles.guideBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlace(place);
                      }}
                    >
                      <Info size={14} />
                      <span>Full Guide</span>
                    </button>

                    <button
                      className={styles.toursBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user/trips?search=${encodeURIComponent(place.city)}`);
                      }}
                    >
                      <span>Find Tours</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Search size={28} />
            </div>
            <h3 className={styles.emptyTitle}>No Guides Found</h3>
            <p className={styles.emptyDesc}>
              No destination guides match your search criteria. Try selecting another city or clearing your search.
            </p>
            <button onClick={resetFilters} className={styles.emptyResetBtn}>
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* DETAIL MODAL */}
      {selectedPlace && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedPlace(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              onClick={() => setSelectedPlace(null)}
              aria-label="Close guide modal"
            >
              <X size={20} />
            </button>

            <img
              src={selectedPlace.image}
              alt={selectedPlace.title}
              className={styles.modalImage}
            />

            <div className={styles.modalBody}>
              <div className={styles.modalHeaderRow}>
                <div>
                  <h2 className={styles.modalTitle}>{selectedPlace.title}</h2>
                  <span style={{ fontSize: "0.9rem", color: "#003D5B", fontWeight: 700 }}>
                    📍 {selectedPlace.location}
                  </span>
                </div>
              </div>

              <p className={styles.modalOverview}>
                {selectedPlace.longHistory}
              </p>

              <div className={styles.modalGrid}>
                <div className={styles.modalInfoBlock}>
                  <div className={styles.modalBlockTitle}>
                    <Ticket size={16} /> 2026 Ticket Prices
                  </div>
                  <div className={styles.modalBlockText}>
                    <p>• <strong>General Admission:</strong> {selectedPlace.tickets.general}</p>
                    {selectedPlace.tickets.khufuInside && (
                      <p>• <strong>Khufu Interior:</strong> {selectedPlace.tickets.khufuInside}</p>
                    )}
                    {selectedPlace.tickets.kingTutTomb && (
                      <p>• <strong>Tutankhamun Tomb:</strong> {selectedPlace.tickets.kingTutTomb}</p>
                    )}
                    <p>• <strong>Egyptian Citizens:</strong> {selectedPlace.tickets.egyptians}</p>
                  </div>
                </div>

                <div className={styles.modalInfoBlock}>
                  <div className={styles.modalBlockTitle}>
                    <Clock size={16} /> Opening Hours & Timing
                  </div>
                  <div className={styles.modalBlockText}>
                    <p>• <strong>Daily Hours:</strong> {selectedPlace.hours}</p>
                    <p>• <strong>Best Visiting Time:</strong> {selectedPlace.bestTime}</p>
                  </div>
                </div>

                <div className={styles.modalInfoBlock}>
                  <div className={styles.modalBlockTitle}>
                    <Car size={16} /> How to Get There
                  </div>
                  <div className={styles.modalBlockText}>
                    {selectedPlace.howToGetThere}
                  </div>
                </div>

                <div className={styles.modalInfoBlock}>
                  <div className={styles.modalBlockTitle}>
                    <Lightbulb size={16} /> Egyptologist Insider Tip
                  </div>
                  <div className={styles.modalBlockText}>
                    {selectedPlace.insiderTip}
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className={styles.modalInfoBlock}>
                <div className={styles.modalBlockTitle}>
                  <Sparkles size={16} /> Must-See Highlights Inside
                </div>
                <div className={styles.modalBlockText}>
                  <ul style={{ paddingLeft: 18, margin: 0 }}>
                    {selectedPlace.highlights.map((h, idx) => (
                      <li key={idx} style={{ marginBottom: 4 }}>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  className={styles.modalTourButton}
                  onClick={() => {
                    const searchCity = selectedPlace.city;
                    setSelectedPlace(null);
                    navigate(`/user/trips?search=${encodeURIComponent(searchCity)}`);
                  }}
                >
                  <span>Find Guided Tours to {selectedPlace.title}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
