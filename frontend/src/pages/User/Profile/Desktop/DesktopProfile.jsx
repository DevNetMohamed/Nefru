import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logoutUser } from "../../../../store/slices/authSlice";
import ProfileSidebar from "./components/ProfileSidebar";
import styles from "./DesktopProfile.module.css";

export default function DesktopProfile({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login", { replace: true });
  };

  return (
    <main className={styles.page}>
      <ProfileSidebar onLogout={handleLogout} />

      <section className={styles.content}>{children}</section>
    </main>
  );
}
