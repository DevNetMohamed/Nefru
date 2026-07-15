import useIsMobile from "../../../../hooks/useIsMobile";
import DesktopResetPassword from "./Desktop/DesktopResetPassword";
import MobileResetPassword from "./Mobile/MobileResetPassword";

function ResetPassword() {
  const isMobile = useIsMobile(992);

  return isMobile ? <MobileResetPassword /> : <DesktopResetPassword />;
}

export default ResetPassword;
