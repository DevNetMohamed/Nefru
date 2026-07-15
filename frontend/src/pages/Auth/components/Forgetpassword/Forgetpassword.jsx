import useIsMobile from "../../../../hooks/useIsMobile";
import DesktopForgetpassword from "./Desktop/DesktopForgetpassword";
import MobileForgetpassword from "./Mobile/MobileForgetpassword";

function Forgetpassword() {
  const isMobile = useIsMobile(992);

  return isMobile ? <MobileForgetpassword /> : <DesktopForgetpassword />;
}

export default Forgetpassword;
