import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { DEV_AUTH_BYPASS } from "../config/devAccess";

export default function RequireApprovedGuide() {
  const { initialized, isAuthenticated, user, profile } = useSelector(
    (state) => state.auth,
  );

  // TEMPORARY DEVELOPMENT BYPASS:
  // Unapproved guides can access these pages while the project is in development.
  // Set VITE_DEV_AUTH_BYPASS=false to restore the approval check locally.
  // Production builds always enforce the verification logic below.
  if (DEV_AUTH_BYPASS) return <Outlet />;

  if (!initialized) return null;
  if (!isAuthenticated || !user) return <Navigate to="/auth/login" replace />;
  if (user.role !== "guide") return <Navigate to="/user/home" replace />;

  if (profile?.verificationStatus !== "approved") {
    return <Navigate to="/guide/verification" replace />;
  }

  return <Outlet />;
}
