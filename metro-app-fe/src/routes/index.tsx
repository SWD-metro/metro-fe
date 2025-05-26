import React from "react";
import { useRoutes } from "react-router-dom";
import path from "src/constants/path";
import MainLayout from "src/layouts/MainLayout";
import HomePage from "src/pages/Client/HomePage";
import WhatToKnow from "src/pages/Client/WhatToKnow";

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
  ]);

  return routeElements;
};

export default RouteElements;
