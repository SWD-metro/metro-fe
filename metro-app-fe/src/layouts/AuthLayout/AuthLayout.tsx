import React, { JSX } from "react";
import { Button, Dropdown, Menu } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import enFlag from "src/assets/svg/en.svg";
import viFlag from "src/assets/svg/vi.svg";
import background1 from "src/assets/background2.jpg";
import logo from "src/assets/HCMC_Metro_Logo.png";
import background from "src/assets/stats_section.jpg";
import path from "src/constants/path";
import { RollbackOutlined } from "@ant-design/icons";

const AuthLayout: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const location = useLocation();
  const isRegister = location.pathname === "/auth/register";

  const handleBackHome = () => {
    navigate("/");
  };

  const renderFlag = (language: string | undefined): JSX.Element => {
    return (
      <img
        style={{ height: 25, width: 25 }}
        src={language === "en" ? enFlag : viFlag}
        alt={language}
      />
    );
  };

  const LanguageDropdown: React.FC = () => (
    <Dropdown
      overlay={
        <Menu className="!p-2 !rounded-[10px] !shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
          <Menu.Item
            key="en"
            onClick={() => i18n.changeLanguage("en")}
            className="!p-[8px_12px] !font-medium hover:!bg-gray-100"
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <img
              src={enFlag}
              alt="en"
              style={{ height: 20, width: 20, marginRight: 8 }}
            />
            <span>English</span>
          </Menu.Item>
          <Menu.Item
            key="vi"
            onClick={() => i18n.changeLanguage("vi")}
            className="!p-[8px_12px] !font-medium hover:!bg-gray-100"
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <img
              src={viFlag}
              alt="vi"
              style={{ height: 20, width: 20, marginRight: 8 }}
            />
            <span>Tiếng Việt</span>
          </Menu.Item>
        </Menu>
      }
    >
      <Button type="text" className="mb-5">
        {renderFlag(i18n.resolvedLanguage)}{" "}
        {i18n.resolvedLanguage === "en" ? "EN" : "VN"}
      </Button>
    </Dropdown>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${background1})`,
          }}
        />
      </div>

      <div
        className={`relative z-10 w-full ${
          isRegister ? "max-w-2xl" : "max-w-xl"
        }`}
      >
        <div
          className="rounded-2xl shadow-xl p-8 backdrop-blur-sm"
          style={{
            backgroundImage: `url(${background})`,
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <Button
              type="primary"
              onClick={handleBackHome}
              size="large"
              icon={<RollbackOutlined style={{ fontSize: 24 }} />}
              className="!flex items-center justify-center !w-12 !h-12 rounded-full shadow hover:shadow-md transition-all duration-200"
            />

            <Link to={path.home} className="ms-8">
              <img src={logo} alt="Logo" className="w-[120px]" />
            </Link>

            <LanguageDropdown />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
