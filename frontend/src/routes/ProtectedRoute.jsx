import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { DEV_AUTH_BYPASS } from "../config/devAccess";

function getHomePathByRole(role) {
  if (role === "admin") return "/admin/overview";
  if (role === "guide") return "/guide/dashboard";
  return "/user/home";
}

export default function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();
  const { initialized, isAuthenticated, user } = useSelector(
    (state) => state.auth,
  );

  // TEMPORARY DEVELOPMENT BYPASS:
  // Protected pages are accessible without login or role checks during development.
  // Set VITE_DEV_AUTH_BYPASS=false to restore the real guards locally.
  // Production builds always enforce the authentication logic below.
  if (DEV_AUTH_BYPASS) return <Outlet />;

  if (!initialized) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to={`/auth/login?returnTo=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  const role = user.role;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={getHomePathByRole(role)} replace />;
  }

  return <Outlet />;
}
