import { Outlet } from "react-router-dom";

import useIsMobile from "../../../hooks/useIsMobile";
import DesktopProfile from "./Desktop/DesktopProfile";
import MobileProfile from "./Mobile/MobileProfile";

export default function Profile() {
  const isMobile = useIsMobile(992);

  return isMobile ? (
    <MobileProfile>
      <Outlet />
    </MobileProfile>
  ) : (
    <DesktopProfile>
      <Outlet />
    </DesktopProfile>
  );
}
