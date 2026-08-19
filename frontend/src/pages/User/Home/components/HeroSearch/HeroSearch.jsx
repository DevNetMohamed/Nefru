import { useEffect, useState } from "react";
import styles from "./HeroSearch.module.css";

import cairo from "../../../../../assets/images/hero/cairo.jpg";
import luxor from "../../../../../assets/images/hero/luxor.jpeg";
import aswan from "../../../../../assets/images/hero/aswan.jpeg";
import alexandria from "../../../../../assets/images/hero/alexandria.jpg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import SearchModal from "@/components/Search/SearchModal";

const images = [cairo, luxor, aswan, alexandria];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

const GREETING_EMOJI = { "Good Morning": "☀️", "Good Afternoon": "🌤️", "Good Evening": "🌙" };

function HeroSearch() {

  const [openSearch, setOpenSearch] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Bug #3 fixed: added null guard for state.auth
  const { profile } = useSelector((state) => state.auth || {});
  const fullName = profile?.fullName || "Explorer";

  // Bug #11 fixed: dynamic time-aware greeting
  const greeting = getGreeting();
  const greetingEmoji = GREETING_EMOJI[greeting];


  return (
    <section className={styles.hero} id="Home">
      <div className={styles.left}>
        {/* Bug #11 fixed: dynamic greeting */}
        <span className={styles.greeting}>{greeting}, {fullName} {greetingEmoji}</span>

        <h1>
          Where do you want to
          <br />
          explore today?
        </h1>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search tours, places, or guides..."
            readOnly
            onClick={() => setOpenSearch(true)}
          />
          {/* Bug #6 fixed: added onClick to Find Available Tours button */}
          <button onClick={() => setOpenSearch(true)}>Find Available Tours</button>
        </div>

        <div className={styles.destinations}>
          <span>Popular destinations</span>

          {/* Bug #12 fixed: destination buttons now navigate to discover page */}
          <button onClick={() => navigate("/user/discover")}>Giza Pyramids</button>
          <button onClick={() => navigate("/user/discover")}>Old Cairo</button>
          <button onClick={() => navigate("/user/discover")}>Alexandria</button>
          <button onClick={() => navigate("/user/discover")}>Khan El-Khalili</button>
          <button onClick={() => navigate("/user/discover")}>Food Tours</button>
        </div>
      </div>

      <div className={styles.right}>
        <img src={images[currentImage]} alt="Egypt Destination" />
      </div>
                  <SearchModal
              open={openSearch}
              onOpenChange={setOpenSearch}
            />
            
    </section>

    
  );
}

export default HeroSearch;
