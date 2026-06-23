import { useEffect, useState } from "react";

import MobileHome from "./Mobile/MobileHome";
import DesktopHome from "./Desktop/DesktopHome";

const Home = () => {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 992
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  return isMobile ? (
    <MobileHome />
  ) : (
    <DesktopHome />
  );
};

export default Home;