import { Outlet } from "react-router-dom";

import GuideHeader from "../GuideHeader/GuideHeader";
import GuideMobileNav from "../GuideMobileNav/GuideMobileNav";
import GuideSidebar from "../GuideSidebar/GuideSidebar";
import styles from "./GuidePortalLayout.module.css";

export default function GuidePortalLayout() {
  return (
    <div className={styles.portal}>
      <GuideSidebar />

      <div className={styles.mainColumn}>
        <GuideHeader />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>

      <GuideMobileNav />
    </div>
  );
}
