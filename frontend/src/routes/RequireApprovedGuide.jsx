import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RequireApprovedGuide() {
  const { initialized, isAuthenticated, user, profile } = useSelector(
    (state) => state.auth,
  );

  if (!initialized) return null;
  if (!isAuthenticated || !user) return <Navigate to="/auth/login" replace />;
  if (user.role !== "guide") return <Navigate to="/user/home" replace />;

  if (profile?.verificationStatus !== "approved") {
    return <Navigate to="/guide/verification" replace />;
  }

  return <Outlet />;
}
