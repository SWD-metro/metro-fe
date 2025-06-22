import React, { useContext } from "react";
import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";
import path from "src/constants/path";
import { AppContext } from "src/contexts/app.context";

interface ProtectedRouteProps {
  allowedRoles: string[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = path.login,
}) => {
  const { isAuthenticated, profile } = useContext(AppContext);

  if (!isAuthenticated) {
    toast.error("Vui lòng đăng nhập !!!");
    return <Navigate to={redirectPath} replace />;
  }

  if (profile && !allowedRoles.includes(profile.role)) {
    redirectPath = profile.role === "ROLE_ADMIN" ? path.admin : path.home;
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
