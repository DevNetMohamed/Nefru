import useIsMobile from "../../../../hooks/useIsMobile";
import DesktopApplicationReceived from "./Desktop/DesktopApplicationReceived";
import MobileApplicationReceived from "./Mobile/MobileApplicationReceived";

function ApplicationReceived() {
  const isMobile = useIsMobile(992);

  return isMobile ? <MobileApplicationReceived /> : <DesktopApplicationReceived />;
}

export default ApplicationReceived;
