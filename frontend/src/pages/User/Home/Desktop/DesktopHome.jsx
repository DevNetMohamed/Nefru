import DesktopNavbar from "../components/DesktopNavbar/DesktopNavbar";
// import HeroSection from "../components/HeroSection/HeroSection";
// import FeaturedExperiences from "./components/FeaturedExperiences/FeaturedExperiences";
// import TourCard from "../../../../components/ui/TourCard/TourCard";
// import TopTrips from "./components/TopTrips/TopTrips";
// import ExploreEgypt from "./components/ExploreEgypt/ExploreEgypt";
// import TopGuides from "./components/TopGuides/TopGuides";
// import WhyNefru from "./components/WhyNefru/WhyNefru";
// import Newsletter from "./components/Newsletter/Newsletter";
import Footer from "./components/Footer/Footer"
import HeroSearch from "../components/HeroSearch/HeroSearch";
import RecommendedTours from "../../../../components/ui/RecommendedTourCard/RecommendedTours";
import AvailableToday from "../Desktop/components/AvailableToday/AvailableToday"
import DiscoverEgypt from "../Desktop/components/DiscoverEgypt/DiscoverEgypt"
import ToursNearYou from "../Desktop/components/ToursNearYou/ToursNearYou"
import TrustedGuides from "../Desktop/components/TrustedGuides/TrustedGuides"

// import pyramids from "../../../../assets/images/explore/pyramids.jpg";




import { useEffect, useState } from "react";
import axios from "axios";
const DesktopHome = () => {
const [featuredTrips, setFeaturedTrips] = useState([]);
  
 useEffect(() => {
  const fetchHomeData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/home"
      );

      setFeaturedTrips(response.data.data.featuredTrips);
    } catch (error) {
      console.error(error);
    }
  };

  fetchHomeData();
}, []);


  return (
    <div>
      <DesktopNavbar />
    <HeroSearch />
    <RecommendedTours trips={featuredTrips} />
    <AvailableToday />
    <DiscoverEgypt />
    <ToursNearYou />
    <TrustedGuides />
    <Footer />



      <Footer />
      {/* <HeroSection /> 
      <FeaturedExperiences />
       <TopTrips />
       <ExploreEgypt />
        <TopGuides />

         <WhyNefru />
        <Newsletter /> */}
    </div>
  );
};

export default DesktopHome;