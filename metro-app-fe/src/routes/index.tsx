import React from "react";
import { useRoutes } from "react-router-dom";
import LayoutDefault from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import WhatToKnow from "../pages/WhatToKnow";
import path from "../constants/path";

const RouteElements: React.FC = () => {
  const routeElements = useRoutes([
    {
      path: "/",
      element: <LayoutDefault />,
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
