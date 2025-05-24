import React from "react";
import { Button, Dropdown, Menu } from "antd";
import viFlag from "../../assets/svg/vi.svg";
import enFlag from "../../assets/svg/en.svg";
import logo from "../../assets/HCMC_Metro_Logo.png";
import "./Header.scss";
import { useTranslation } from "react-i18next";

const Header: React.FC = () => {
  const { i18n } = useTranslation();
  const renderFlag = (language: string | undefined) => {
    return (
      <img
        style={{ height: 25, width: 25 }}
        src={language === "en" ? enFlag : viFlag}
        alt={language}
      />
    );
  };
  return (
    <>
      <header className="header">
        <div className="header-nav">
          <div className="header-logo">
            <img src={logo} alt="Logo" />
          </div>
          <Menu mode="horizontal" className="header-menu" selectable={false}>
            <Menu.Item key="home">HOME</Menu.Item>
            <Menu.Item key="time">STOP & TIMETABLE</Menu.Item>
            <Menu.Item key="news">NEWS</Menu.Item>
            <Menu.Item key="contact">WHAT TO KNOW</Menu.Item>
            <Menu.Item key="contact">CONTACT US</Menu.Item>
            <Menu.Item key="login">LOGIN</Menu.Item>
            <Menu.Item key="lang" className="header-lang">
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      key="en"
                      onClick={() => i18n.changeLanguage("en")}
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
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  {renderFlag(i18n.resolvedLanguage)}
                </Button>
              </Dropdown>
            </Menu.Item>
          </Menu>
        </div>
      </header>
    </>
  );
};
export default Header;
