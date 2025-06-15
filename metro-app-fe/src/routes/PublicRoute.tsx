import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import path from "src/constants/path";
import { AppContext } from "src/contexts/app.context";

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, profile } = useContext(AppContext);

  if (isAuthenticated) {
    if (profile?.role === "ROLE_ADMIN")
      return <Navigate to={path.admin} replace />;
    return <Navigate to={path.home} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
