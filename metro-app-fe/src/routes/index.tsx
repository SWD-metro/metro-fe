import React from "react";
import { useRoutes } from "react-router-dom";
import path from "src/constants/path";
import AdminLayout from "src/layouts/adminLayout/AdminLayout";
import AuthLayout from "src/layouts/AuthLayout";
import MainLayout from "src/layouts/MainLayout";
import Dashboard from "src/pages/admin/Dashboard";
import Manage from "src/pages/admin/Manage";
import LoginPage from "src/pages/Auth/Login";
import RegisterPage from "src/pages/Auth/Register";
import VerifyOtpPage from "src/pages/Auth/VerifyOtp";
import AboutUsPage from "src/pages/Client/AboutUs";
import HomePage from "src/pages/Client/HomePage";
import ProfileLayout from "src/pages/Client/profile";
import ServicePage from "src/pages/Client/Services";
import StationMapPage from "src/pages/Client/StationMap";
import BuyTicketPage from "src/pages/Client/Ticket";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import OAuth2RedirectHandler from "src/pages/Auth/OAuth2";
import OrderPage from "src/pages/Client/OrderPage";
import PaymentResult from "src/pages/Client/PaymentResult";
import MainContent from "src/components/ProfileComponent/MainContent";
import MyTicket from "src/pages/Client/MyTicket";
import OrderHistory from "src/pages/Client/OrderHistory/OrderHistory";
import UserManagement from "src/components/managements/UserManagement";
import StationManagement from "src/components/managements/StationManagement";
import ScheduleManagement from "src/components/managements/ScheduleManagement";
import StudentRequestPage from "src/pages/Client/StudentRequest";
import VerifyStudentRequest from "src/pages/admin/VerityStudentRequest";
import FeedbackPage from "src/pages/Client/Feedback";
import ManageFeedbackPage from "src/pages/admin/ManageFeedback";

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
              element: <ProfileLayout />,
              children: [
                {
                  path: path.profile,
                  element: <MainContent />,
                },
                {
                  path: path.myTicket,
                  element: <MyTicket />,
                },
                {
                  path: path.orderHistory,
                  element: <OrderHistory />,
                },
                {
                  path: path.studentRequest,
                  element: <StudentRequestPage />,
                },
                {
                  path: path.feedback,
                  element: <FeedbackPage />,
                },
              ],
            },
            {
              path: path.orderPage,
              element: <OrderPage />,
            },
            {
              path: path.paymentResult,
              element: <PaymentResult />,
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
          path: path.verifyOtp,
          element: <VerifyOtpPage />,
        },
      ],
    },
    {
      path: path.oauth2,
      element: <OAuth2RedirectHandler />,
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
              element: <MainContent />,
            },
            {
              path: "dashboard",
              element: <Dashboard />,
            },
            {
              path: "user",
              element: <UserManagement />,
            },
            {
              path: "ticket",
              element: <Manage />,
            },
            {
              path: "routes",
              element: <StationManagement />,
            },
            {
              path: "verify-student-request",
              element: <VerifyStudentRequest />,
            },
            {
              path: "schedule",
              element: <ScheduleManagement />,
            },
            {
              path: "feedbacks",
              element: <ManageFeedbackPage />,
            },
          ],
        },
      ],
    },
  ]);

  return routeElements;
};

export default RouteElements;
