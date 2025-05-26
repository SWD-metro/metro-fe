import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import MetroIcon from "../../components/IconCustom/MetroIcon";
import "./MainLayout.scss";
const MainLayout: React.FC = () => {
  const [showMetro, setShowMetro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMetro(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {showMetro ? (
        <div className="metro-splash-screen">
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
