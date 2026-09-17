import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

export const AdminRoute = ({ requireSuperAdmin = false }) => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireSuperAdmin && user?.role !== "super_admin") {
    return <Navigate to="/weekly-plan" replace />;
  }

  const hasAdminAccess = user?.role === "admin" || user?.role === "super_admin";
  if (!hasAdminAccess) {
    return <Navigate to="/weekly-plan" replace />;
  }

  return <Outlet />;
};