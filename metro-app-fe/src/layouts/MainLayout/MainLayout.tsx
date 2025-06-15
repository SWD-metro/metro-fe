import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Footer from "src/components/Footer";
import Header from "src/components/Header";
import MetroIcon from "src/components/IconCustom/MetroIcon";
import background from "src/assets/stats_section.jpg";
import { AppContext } from "src/contexts/app.context";
import path from "src/constants/path";
const MainLayout: React.FC = () => {
  const { profile } = useContext(AppContext);

  const [showMetro, setShowMetro] = useState(() => {
    return !sessionStorage.getItem("metro-show");
  });

  useEffect(() => {
    if (showMetro) {
      const timer = setTimeout(() => {
        setShowMetro(false);
        sessionStorage.setItem("metro-show", "true");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showMetro]);

  if (profile?.role === "ROLE_ADMIN") {
    return <Navigate to={path.admin} replace />;
  }
  return (
    <>
      {showMetro ? (
        <div
          className="w-full h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${background})`,
          }}
        >
          <MetroIcon width={550} />
        </div>
      ) : (
        <>
          <Header />
          <Outlet />
          <Footer />
        </>
      )}
    </>
  );
};

export default MainLayout;
