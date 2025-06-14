import React from "react";
import { useRoutes } from "react-router-dom";
import path from "src/constants/path";
import AdminLayout from "src/layouts/adminLayout/AdminLayout";
import AuthLayout from "src/layouts/AuthLayout";
import MainLayout from "src/layouts/MainLayout";
import ForgotPassword from "src/pages/Auth/ForgotPassword";
import LoginPage from "src/pages/Auth/Login";
import RegisterPage from "src/pages/Auth/Register";
import ResetPassword from "src/pages/Auth/ResetPassword";
import VerifyOtpPage from "src/pages/Auth/VerifyOtp";
import AboutUsPage from "src/pages/Client/AboutUs";
import HomePage from "src/pages/Client/HomePage";
import UserProfile from "src/pages/Client/profile/UserProfile";
import ServicePage from "src/pages/Client/Services";
import StationMapPage from "src/pages/Client/StationMap";
import BuyTicketPage from "src/pages/Client/Ticket";
import Dashboard from "src/pages/dashboard/Dashboard";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

const RouteElements: React.FC = () => {
  const routeElements = useRoutes([
    {
      path: path.home,
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
        {
          path: path.buyTicket,
          element: <BuyTicketPage />,
        },
        {
          path: path.stationMap,
          element: <StationMapPage />,
        },
        {
          element: <ProtectedRoute allowedRoles={["ROLE_CUSTOMER"]} />,
          children: [
            {
              path: path.profile,
              element: <UserProfile />,
            },
          ],
        },
      ],
    },
    {
      path: path.auth,
      element: (
        <PublicRoute>
          <AuthLayout />
        </PublicRoute>
      ),
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
        {
          path: path.verifyOtp,
          element: <VerifyOtpPage />,
        },
      ],
    },
    {
      path: path.admin,
      element: <ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            {
              index: true,
              element: <Dashboard />,
            },
            {
              path: "profile",
              element: <UserProfile />,
            },
          ],
        },
      ],
    },
  ]);

  return routeElements;
};

export default RouteElements;
