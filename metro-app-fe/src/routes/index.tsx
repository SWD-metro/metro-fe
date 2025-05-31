import React from "react";
import { useRoutes } from "react-router-dom";
import path from "src/constants/path";
import AuthLayout from "src/layouts/AuthLayout";
import MainLayout from "src/layouts/MainLayout";
import ForgotPassword from "src/pages/Auth/ForgotPassword";
import LoginPage from "src/pages/Auth/Login";
import RegisterPage from "src/pages/Auth/Register";
import ResetPassword from "src/pages/Auth/ResetPassword";
import AboutUsPage from "src/pages/Client/AboutUs";
import HomePage from "src/pages/Client/HomePage";
import ServicePage from "src/pages/Client/Services";
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
          path: path.services,
          element: <ServicePage />,
        },
        {
          path: path.aboutUs,
          element: <AboutUsPage />,
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
        {
          path: path.forgotPassword,
          element: <ForgotPassword />,
        },
        {
          path: path.resetPassword,
          element: <ResetPassword />,
        },
      ],
    },
    {
      path: "admin",
      element: <Home />,
    },
  ]);

  return routeElements;
};

export default RouteElements;
