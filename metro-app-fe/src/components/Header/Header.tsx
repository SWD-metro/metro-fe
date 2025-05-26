import React, { useState, type JSX } from "react";
import { Button, Drawer, Dropdown, Menu } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import viFlag from "../../assets/svg/vi.svg";
import enFlag from "../../assets/svg/en.svg";
import logo from "../../assets/HCMC_Metro_Logo.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import path from "../../constants/path";
import HeroSection from "../HeroSection";

const Header: React.FC = () => {
  const { i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const renderFlag = (language: string | undefined): JSX.Element => {
    return (
      <img
        style={{ height: 25, width: 25 }}
        src={language === "en" ? enFlag : viFlag}
        alt={language}
      />
    );
  };

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = (): void => {
    setMobileMenuOpen(false);
  };

  const languageDropdownStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    boxShadow: "none",
    border: "none",
  };

  const menuItems: Array<{ key: string; label: string; to?: string }> = [
    { key: "home", label: "HOME", to: path.home },
    { key: "whatToKnow", label: "WHAT TO KNOW", to: path.whatToKnow },
    { key: "time", label: "STOP & TIMETABLE" },
    { key: "buy", label: "BUY TICKET" },
    { key: "contact", label: "CONTACT US" },
    { key: "login", label: "LOGIN", to: path.login },
  ];

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
      <Button
        type="text"
        style={{
          ...languageDropdownStyle,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {renderFlag(i18n.resolvedLanguage)}
      </Button>
    </Dropdown>
  );

  return (
    <>
      <header className="absolute top-[2%] w-full z-[100] px-7 text-center">
        <div className="flex justify-between items-center mx-auto flex-wrap">
          <div className="text-center flex flex-col items-center">
            <Link to="/">
              <img src={logo} alt="Logo" className="w-[120px]" />
            </Link>
          </div>

          <Menu
            mode="horizontal"
            className="hidden lg:flex w-[70%] !bg-transparent !border-b-0 justify-end items-center gap-1 mr-20"
            selectable={false}
          >
            {menuItems.map((item) => (
              <Menu.Item
                key={item.key}
                className="!text-base !font-medium !text-white hover:!text-[#007acc]"
              >
                {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
              </Menu.Item>
            ))}
            <Menu.Item key="lang">
              <LanguageDropdown />
            </Menu.Item>
          </Menu>

          <div className="flex items-center gap-4 lg:hidden">
            <LanguageDropdown />
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={toggleMobileMenu}
              className="!text-white !text-xl !p-2"
            />
          </div>
        </div>

        <Drawer
          title={
            <div className="flex justify-between items-center">
              <img src={logo} alt="Logo" className="w-[80px]" />
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={closeMobileMenu}
                className="!text-gray-600"
              />
            </div>
          }
          placement="right"
          onClose={closeMobileMenu}
          open={mobileMenuOpen}
          width={280}
          className="lg:hidden"
          closable={false}
          headerStyle={{
            borderBottom: "1px solid #f0f0f0",
            padding: "16px 24px",
          }}
          bodyStyle={{
            padding: "20px 0",
          }}
        >
          <div className="flex flex-col space-y-1">
            {menuItems.map((item) => (
              <div key={item.key}>
                {item.to ? (
                  <Link
                    to={item.to}
                    onClick={closeMobileMenu}
                    className="block px-6 py-4 text-gray-700 hover:bg-gray-50 hover:text-[#007acc] transition-colors duration-200 font-medium"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <div className="block px-6 py-4 text-gray-700 hover:bg-gray-50 hover:text-[#007acc] transition-colors duration-200 font-medium cursor-pointer">
                    {item.label}
                  </div>
                )}
              </div>
            ))}

            <div className="px-6 py-4 border-t border-gray-100 mt-4">
              <div className="text-sm text-gray-500 mb-3 font-medium">
                Language / Ngôn ngữ
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    i18n.changeLanguage("en");
                    closeMobileMenu();
                  }}
                  className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors duration-200 ${
                    i18n.resolvedLanguage === "en"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <img src={enFlag} alt="en" className="w-5 h-5" />
                  <span className="font-medium">English</span>
                </button>
                <button
                  onClick={() => {
                    i18n.changeLanguage("vi");
                    closeMobileMenu();
                  }}
                  className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors duration-200 ${
                    i18n.resolvedLanguage === "vi"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <img src={viFlag} alt="vi" className="w-5 h-5" />
                  <span className="font-medium">Tiếng Việt</span>
                </button>
              </div>
            </div>
          </div>
        </Drawer>
      </header>
      <HeroSection />
    </>
  );
};

export default Header;
