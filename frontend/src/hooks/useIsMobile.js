import { useEffect, useState } from "react";

export default function useIsMobile(breakpoint = 992) {
  const getIsMobile = () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < breakpoint;
  };

  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return isMobile;
}
