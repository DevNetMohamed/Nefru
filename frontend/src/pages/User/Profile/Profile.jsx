import { Outlet } from "react-router-dom";

import useIsMobile from "../../../hooks/useIsMobile";
import DesktopProfile from "./Desktop/DesktopProfile";
import MobileProfile from "./Mobile/MobileProfile";
import Footer from "../../../shared/components/Footer/Footer";
import DesktopNavbar from "../Home/components/DesktopNavbar/DesktopNavbar";
export default function Profile() {
  const isMobile = useIsMobile(992);

  return isMobile ? (
    <MobileProfile>
      <Outlet />
    </MobileProfile>
  ) : (
    <div>
      <DesktopNavbar />
      <DesktopProfile>
        <Outlet />
      </DesktopProfile>
      <Footer />
    </div>
  );
}
