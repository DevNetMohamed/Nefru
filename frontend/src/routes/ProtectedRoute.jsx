import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function getHomePathByRole(role) {
  if (role === "admin") return "/admin/overview";

  // مؤقتًا guide و tourist رايحين نفس user home
  // بعدين لما نعمل guide dashboard نغيرها
  if (role === "guide") return "/user/home";
  if (role === "tourist") return "/user/home";

  return "/user/home";
}

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  const role = user?.role;

  if (allowedRoles && !role) {
    // If allowedRoles provided but role is missing, redirect to login as a safe fallback
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to={getHomePathByRole(role)} replace />;
  }

  return <Outlet />;
}