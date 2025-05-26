import React, { JSX } from "react";
import { Col, Row, Button, Dropdown, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import metroImage from "src/assets/app-metro-mb.jpg";
import enFlag from "src/assets/svg/en.svg";
import viFlag from "src/assets/svg/vi.svg";
import background1 from "src/assets/stats_section.jpg";
import background2 from "src/assets/feature_section.png";

const AuthLayout: React.FC = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

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
    <div className="min-h-screen">
      <Row className="min-h-screen">
        <Col
          xs={24}
          lg={14}
          style={{
            backgroundImage: `url(${background1})`,
          }}
        >
          <div
            className="flex-1 flex items-center justify-center"
            style={{
              transform:
                window.innerWidth < 768
                  ? "translateY(20px)"
                  : "translateY(100px)",
            }}
          >
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl mx-auto">
              <div className="flex justify-between items-center py-4 mb-4 sm:mb-6">
                <Button
                  type="primary"
                  icon={<LeftOutlined />}
                  onClick={handleBackHome}
                  size="large"
                />

                <LanguageDropdown />
              </div>

              <div className="bg-white/90 border !border-blue-600 rounded-xl p-4 sm:p-6 lg:p-8">
                <Outlet />
              </div>
            </div>
          </div>
        </Col>

        <Col xs={0} lg={10} className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-br"
            style={{
              backgroundImage: `url(${background2})`,
            }}
          >
            <div className="absolute inset-0 bg-black/10">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="relative h-full flex items-center justify-center p-6">
              <div className="relative w-full max-w-2xl">
                <img
                  src={metroImage}
                  alt="Metro App"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  style={{ maxHeight: "85vh" }}
                />

                <div className="absolute -inset-4 bg-white/10 rounded-2xl blur-xl -z-10"></div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AuthLayout;
