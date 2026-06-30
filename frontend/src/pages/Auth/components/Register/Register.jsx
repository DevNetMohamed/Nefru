import useIsMobile from "../../../../hooks/useIsMobile";
import DesktopRegister from "./Desktop/DesktopRegister";
import MobileRegister from "./Mobile/MobileRegister";

function Register() {
  const isMobile = useIsMobile(992);

  return isMobile ? <MobileRegister /> : <DesktopRegister />;
}

export default Register;
