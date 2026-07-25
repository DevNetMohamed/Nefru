import DesktopNavbar from "../components/DesktopNavbar/DesktopNavbar";
import Footer from "./components/Footer/Footer";
import HeroSearch from "../components/HeroSearch/HeroSearch";
import RecommendedTours from "../../../../components/ui/RecommendedTourCard/RecommendedTours";
import AvailableToday from "../Desktop/components/AvailableToday/AvailableToday";
import DiscoverEgypt from "../Desktop/components/DiscoverEgypt/DiscoverEgypt";
import ToursNearYou from "../Desktop/components/ToursNearYou/ToursNearYou";
import TrustedGuides from "../Desktop/components/TrustedGuides/TrustedGuides";

import { useEffect, useState } from "react";
import axios from "axios";

const DesktopHome = () => {
  const [homeData, setHomeData] = useState({
    featuredTrips: [],
    availableToday: [],
    trustedGuides: [],
    toursNearYou: [],
  });

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
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <DesktopNavbar />
      <HeroSearch />
      <RecommendedTours trips={homeData.featuredTrips} />
      <AvailableToday tours={homeData.availableToday} />
      <DiscoverEgypt />
      <ToursNearYou tours={homeData.toursNearYou} />
      <TrustedGuides guides={homeData.trustedGuides} />
      <Footer />
    </div>
  );
};

export default DesktopHome;