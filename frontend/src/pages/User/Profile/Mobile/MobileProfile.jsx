import { useLocation } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";

import ProfileMobileHeader from "./components/ProfileMobileHeader";
import styles from "./MobileProfile.module.css";

const headerConfig = {
  "/user/profile": {
    title: "Tourist Profile",
    backTo: "/user/home",
    action: {
      to: "/user/profile/edit",
      label: "Edit profile",
      icon: FiEdit2,
    },
  },
  "/user/profile/edit": {
    title: "Edit Profile",
    backTo: "/user/profile",
  },
  "/user/profile/change-password": {
    title: "Change Password",
    backTo: "/user/profile",
  },
  "/user/profile/bookings": {
    title: "My Bookings",
    backTo: "/user/profile",
  },
  "/user/profile/payments": {
    title: "Payment Methods",
    backTo: "/user/profile",
  },
  "/user/profile/reviews": {
    title: "Reviews Written",
    backTo: "/user/profile",
  },
  "/user/profile/support": {
    title: "Help & Support",
    backTo: "/user/profile",
  },
};

function normalizePath(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export default function MobileProfile({ children }) {
  const { pathname } = useLocation();
  const currentPath = normalizePath(pathname);
  const header = headerConfig[currentPath] || {
    title: "Tourist Profile",
    backTo: "/user/profile",
  };

  return (
    <main className={styles.page}>
      <ProfileMobileHeader title={header.title} backTo={header.backTo} action={header.action} />
      <div className={styles.content}>{children}</div>
    </main>
  );
}
