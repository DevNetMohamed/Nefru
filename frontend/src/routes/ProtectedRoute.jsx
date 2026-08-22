import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function getHomePathByRole(role) {
  if (role === "admin") return "/admin/overview";
  if (role === "guide") return "/guide/dashboard";
  return "/user/home";
}

export default function ProtectedRoute({ allowedRoles }) {
  const { initialized, isAuthenticated, user } = useSelector(
    (state) => state.auth,
  );

  if (!initialized) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  const role = user.role;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={getHomePathByRole(role)} replace />;
  }

  return <Outlet />;
}
