import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "src/components/Footer";
import Header from "src/components/Header";
import MetroIcon from "src/components/IconCustom/MetroIcon";
import background from "src/assets/stats_section.jpg";
const MainLayout: React.FC = () => {
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
