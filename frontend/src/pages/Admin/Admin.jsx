import SideBar from './components/Sidebar/Sidebar'
import styles from './Admin.module.css'
import Navbar from './components/Navbar/Navbar'
import AdminErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

import { useEffect, useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'

// Must match the pageOut animation duration in Admin.module.css.
const FADE_OUT_MS = 200;
const FADE_ANIMATION = (name, duration) =>
  `${name} ${duration}s ease-in-out both`;

export default function Admin() {
  const location = useLocation();
  const outlet = useOutlet();

  // Two-phase transition: keep the OUTGOING page mounted while it fades
  // out (frozen outlet), then swap to the new route and fade it in.
  const [rendered, setRendered] = useState({ location, outlet });

  const routeKey = (loc) => `${loc.pathname}${loc.search}`;
  // Derived, not stored: while the rendered route trails the router's
  // route we are in the fade-out phase.
  const fading = routeKey(rendered.location) !== routeKey(location);

  // Fade-out finished -> commit the new route content and fade it in.
  useEffect(() => {
    if (!fading) return;
    const timer = setTimeout(() => {
      setRendered({ location, outlet });
    }, FADE_OUT_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fading]);

  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>
        <SideBar />
      </div>
      <div className={styles.body}>
        <div className={styles.navbar}>
          <Navbar/>
        </div>
        <div className={styles.page}>
          {/* Keyed by the displayed route so the incoming page remounts
              and the fade-in animation replays on every switch. */}
          <div
            key={routeKey(rendered.location)}
            className={styles.pageTransition}
            style={{
              animation: fading
                ? FADE_ANIMATION("nefruPageOut", 0.2)
                : FADE_ANIMATION("nefruPageIn", 0.28),
              pointerEvents: fading ? "none" : undefined,
            }}
          >
            <AdminErrorBoundary>
              {rendered.outlet}
            </AdminErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  )
}
