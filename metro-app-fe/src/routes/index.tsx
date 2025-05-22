import React from "react";
import { useRoutes } from "react-router-dom";
import LayoutDefault from "../layouts/MainLayout";
import { Suspense } from "react";
import HomePage from "../pages/HomePage";

const RouteElements: React.FC = () => {
  const routeElements = useRoutes([
    {
      path: "",
      index: true,
      element: (
        <LayoutDefault>
          <Suspense>
            <HomePage />
          </Suspense>
        </LayoutDefault>
      ),
    },
  ]);

  return routeElements;
};

export default RouteElements;
