import useIsMobile from "../../../../../hooks/useIsMobile";
import DesktopProfileOverview from "../../Desktop/components/ProfileOverview";
import MobileProfileOverview from "./MobileProfileOverview";

export default function ProfileOverview() {
  const isMobile = useIsMobile(992);

  return isMobile ? <MobileProfileOverview /> : <DesktopProfileOverview />;
}
