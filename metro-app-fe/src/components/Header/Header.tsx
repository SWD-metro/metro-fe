import React, { useState, type JSX } from "react";
import { Button, Drawer, Dropdown, Menu } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import viFlag from "src/assets/svg/vi.svg";
import enFlag from "src/assets/svg/en.svg";
import logo from "src/assets/HCMC_Metro_Logo.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import path from "src/constants/path";
import HeroSection from "../HeroSection";

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { t, i18n } = useTranslation("home");

  console.log("i18n", i18n);

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

  const menuItems: Array<{ key: string; label: string; to?: string }> = [
    { key: "home", label: t("header.home"), to: path.home },
    { key: "whatToKnow", label: t("header.whatToKnow"), to: path.services },
    { key: "time", label: t("header.stops") },
    { key: "buyTicket", label: t("header.tickets") },
    { key: "contact", label: t("header.contact"), to: path.aboutUs },
    { key: "login", label: t("header.login"), to: path.login },
  ];

  const changeLanguage = (lng: "en" | "vi") => {
    i18n.changeLanguage(lng);
  };

  const LanguageDropdown: React.FC = () => (
    <Dropdown
      menu={{
        items: [
          {
            key: "en",
            label: (
              <div className="flex items-center gap-2 py-1">
                <img src={enFlag} alt="en" className="w-5 h-5" />
                <span>English</span>
              </div>
            ),
            onClick: () => changeLanguage("en"),
          },
          {
            key: "vi",
            label: (
              <div className="flex items-center gap-2 py-1">
                <img src={viFlag} alt="vi" className="w-5 h-5" />
                <span>Tiếng Việt</span>
              </div>
            ),
            onClick: () => changeLanguage("vi"),
          },
        ],
      }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Button
        type="text"
        className="!bg-transparent !border-0 !shadow-none flex items-center mt-3 gap-2 !text-white hover:!text-[#007acc]"
      >
        {renderFlag(i18n.resolvedLanguage || "vi")}
        {i18n.resolvedLanguage === "en" ? "EN" : "VN"}
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
