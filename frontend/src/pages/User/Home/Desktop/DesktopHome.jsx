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

import pyramids from "../../../../assets/images/explore/pyramids.jpg";

const DesktopHome = () => {
  return (
    <div>
      <DesktopNavbar />
        <HeroSearch />
        <RecommendedTours />





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