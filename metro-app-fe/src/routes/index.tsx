import React from "react";
import { useRoutes } from "react-router-dom";
import path from "src/constants/path";
import AuthLayout from "src/layouts/AuthLayout";
import MainLayout from "src/layouts/MainLayout";
import LoginPage from "src/pages/Auth/Login";
import RegisterPage from "src/pages/Auth/Register";
import HomePage from "src/pages/Client/HomePage";
import WhatToKnow from "src/pages/Client/WhatToKnow";
import Home from "src/pages/dashboard/Home";

const RouteElements: React.FC = () => {
  const routeElements = useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: path.whatToKnow,
          element: <WhatToKnow />,
        },
      ],
    },
    {
      path: "auth",
      element: <AuthLayout />,
      children: [
        {
          path: path.login,
          element: <LoginPage />,
        },
        {
          path: path.register,
          element: <RegisterPage />,
        },
      ],
    },
    {
      path: "admin",
      element: <Home />,
    }
  ]);

  return routeElements;
};

export default RouteElements;
