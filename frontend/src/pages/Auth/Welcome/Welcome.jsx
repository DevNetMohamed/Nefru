import useIsMobile from "../../../hooks/useIsMobile";
import DesktopWelcome from "./Desktop/DesktopWelcome";
import MobileWelcome from "./Mobile/MobileWelcome";

export default function Welcome() {
  const isMobile = useIsMobile(992);

  return isMobile ? <MobileWelcome /> : <DesktopWelcome />;
}
