import React from "react";
import { Typography, Divider, Row, Col } from "antd";
import { PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const Footer: React.FC = () => {
  const { t } = useTranslation("home");
  const footerBackgroundStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
  };

  const topBorderStyle: React.CSSProperties = {
    background: "linear-gradient(90deg, #1890ff, #40a9ff, #1890ff)",
  };

  const contactItems: Array<{
    icon: React.ReactNode;
    label: string;
    highlight: string;
  }> = [
    {
      icon: <PhoneOutlined className="text-[#40a9ff] text-lg flex-shrink-0" />,
      label: "Hotline:",
      highlight: "1900-xxxx",
    },
    {
      icon: <MailOutlined className="text-[#40a9ff] text-lg flex-shrink-0" />,
      label: "Email:",
      highlight: "contact@metro.vn",
    },
  ];

  return (
    <>
      <footer className="text-white p-8 relative" style={footerBackgroundStyle}>
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={topBorderStyle}
        />

        <div className="max-w-[1200px] mx-auto">
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={12}>
              <div className="flex flex-col gap-6">
                <Title
                  level={3}
                  className="!text-white !mb-4 !font-bold !text-2xl md:!text-xl !leading-tight"
                >
                  {t("footer.title")}
                  <br />
                  <span className="text-[#40a9ff] text-lg md:text-base font-normal block mt-2">
                    {t("footer.subtitle")}
                  </span>
                </Title>

                <div className="flex flex-col gap-4 md:gap-3">
                  {contactItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 transition-transform duration-200 hover:translate-x-1 md:hover:transform-none"
                    >
                      {item.icon}
                      <Text className="!text-[#d1d5db] !text-base">
                        {item.label}
                        {item.highlight && (
                          <span className="text-white font-semibold ml-1">
                            {item.highlight}
                          </span>
                        )}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </Col>

            <Col xs={24} lg={12}>
              <div className="relative mt-4 lg:mt-0">
                <div className="bg-[#374151] rounded-xl overflow-hidden shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-[#374151] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
                  <div className="relative pb-[60%] h-0 overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/d/u/0/embed?mid=1bTGW1UXQB7O_B1UqLDQ5BX5iICtd-Rs&ehbc=2E312F&ll=10.903864470734938%2C106.74543857562064&z=13"
                      className="absolute top-0 left-0 w-full h-full border-none"
                      title="Metro HCMC Map"
                      loading="lazy"
                      style={{ filter: "contrast(1.1) brightness(0.9)" }}
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Divider className="!border-white !my-8" />

          <div className="text-center">
            <Text className="!text-white">
              {t("footer.copyright", {
                year: new Date().getFullYear(),
              })}
            </Text>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
