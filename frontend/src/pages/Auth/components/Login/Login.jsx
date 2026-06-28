
import useIsMobile from "../../../../hooks/useIsMobile";
import DesktopLogin from "./Desktop/DesktopLogin";
import MobileLogin from "./Mobile/MobileLogin";

function Login() {
  const isMobile = useIsMobile(992);

  return isMobile ? <MobileLogin /> : <DesktopLogin />;
}

export default Login;
