import DesktopNavbar from "../components/DesktopNavbar/DesktopNavbar";
import Footer from "./components/Footer/Footer";
import HeroSearch from "../components/HeroSearch/HeroSearch";
import HeroSearchSkeleton from "../components/HeroSearch/HeroSearchSkeleton";

import RecommendedTours from "../../../../components/ui/RecommendedTourCard/RecommendedTours";
import AvailableToday from "../Desktop/components/AvailableToday/AvailableToday";
import DiscoverEgypt from "../Desktop/components/DiscoverEgypt/DiscoverEgypt";
import ToursNearYou from "../Desktop/components/ToursNearYou/ToursNearYou";
import TrustedGuides from "../Desktop/components/TrustedGuides/TrustedGuides";

import { useEffect, useState } from "react";
import axios from "axios";
import backgroundVideo from "../../../../assets/videos/Golden_Egyptian.mp4";

const DesktopHome = () => {
  const [homeData, setHomeData] = useState({
    featuredTrips: [],
    availableToday: [],
    trustedGuides: [],
    toursNearYou: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/home");

        if (response.data?.data) {
          setHomeData({
            featuredTrips: response.data.data.featuredTrips || [],
            availableToday: response.data.data.availableToday || [],
            trustedGuides: response.data.data.trustedGuides || [],
            toursNearYou: response.data.data.toursNearYou || [],
          });
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="relative min-h-screen">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10 opacity-25 blur-[3px]">
      
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      <div className="relative z-10">

        <DesktopNavbar />

        {loading ? (
          <HeroSearchSkeleton />
        ) : (
          <HeroSearch />
        )}

        <RecommendedTours trips={homeData.featuredTrips} />

        <AvailableToday tours={homeData.availableToday} />

        <DiscoverEgypt />

        <ToursNearYou tours={homeData.toursNearYou} />

        <TrustedGuides guides={homeData.trustedGuides} />

        <Footer />
      </div>
    </div>
  );
};

export default DesktopHome;
