import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth";

export function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: Array<"admin" | "client">;
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
