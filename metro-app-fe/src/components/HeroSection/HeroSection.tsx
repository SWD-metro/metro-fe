import React, { useState, useEffect } from "react";
import { Typography, Button, Carousel, Space } from "antd";
import { EnvironmentOutlined, ClockCircleOutlined } from "@ant-design/icons";
import background1 from "src/assets/background1.jpg";
import background2 from "src/assets/background2.jpg";
import background3 from "src/assets/background3.jpg";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Title, Paragraph } = Typography;

const HeroSection: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const { pathname } = useLocation();
  const { t } = useTranslation("home");
  const isHome: boolean = pathname === "/";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const heroImages: Array<{ url: string; title: string }> = [
    {
      url: background1,
      title: "Background",
    },
    {
      url: background2,
      title: "Background",
    },
    {
      url: background3,
      title: "Background",
    },
  ];

  const heroOverlayStyle: React.CSSProperties = {
    background:
      "linear-gradient(45deg, rgba(68, 80, 85, 0.8), rgba(72, 85, 128, 0.6))",
  };

  const heroButtonPrimaryStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
    border: "none",
  };

  const heroButtonSecondaryStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.2)",
    border: "2px solid rgba(197, 28, 28, 0.5)",
    backdropFilter: "blur(10px)",
    color: "white",
  };

  const currentTimeStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  };

  const titleAfterStyle: React.CSSProperties = {
    content: '""',
    display: "block",
    width: "100%",
    height: "10px",
    marginTop: "15px",
    backgroundColor: "yellow",
  };

  const fadeInUpKeyframes: string = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  const animationStyles: React.CSSProperties = {
    animation: "fadeInUp 1s ease-out",
  };

  const subtitleAnimationStyles: React.CSSProperties = {
    animation: "fadeInUp 1s ease-out 0.3s both",
  };

  const buttonsAnimationStyles: React.CSSProperties = {
    animation: "fadeInUp 1s ease-out 0.6s both",
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fadeInUpKeyframes }} />

      <div
        className={`relative overflow-hidden rounded-b-[50px] shadow-[0_10px_30px_rgba(0,0,0,0.3)] ${
          isHome ? "h-[55vh]" : "h-[15vh]"
        }`}
      >
        <Carousel autoplay effect="fade" dots={false} speed={1000}>
          {heroImages.map((image, index) => (
            <div key={index}>
              <img
                src={image.url}
                alt={image.title}
                className={`w-full object-cover ${
                  isHome ? "h-[55vh]" : "h-[15vh]"
                }`}
              />
            </div>
          ))}
        </Carousel>

        <div
          className="absolute inset-0 flex items-center justify-center z-[2]"
          style={heroOverlayStyle}
        >
          {isHome && (
            <div className="text-center text-white max-w-[800px] px-5">
              <div className="relative">
                <Title
                  className="!text-5xl !font-bold !mb-2.5 !text-white !leading-tight"
                  style={{
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
                    ...animationStyles,
                  }}
                >
                  {t("hero.title")}
                </Title>
                <div
                  className="w-full h-2.5 mt-4 mb-2 bg-yellow-400"
                  style={titleAfterStyle}
                />
              </div>

              <>
                <Paragraph
                  className="!text-xl !mb-7 opacity-90 !text-white"
                  style={subtitleAnimationStyles}
                >
                  {t("hero.subtitle")}
                </Paragraph>

                <Space
                  size="large"
                  className="mb-4"
                  style={buttonsAnimationStyles}
                >
                  <Button
                    type="primary"
                    size="large"
                    className="!h-[50px] !px-7 !text-base !rounded-[25px] !mx-2.5 transform transition-all duration-300 hover:!-translate-y-1 hover:!shadow-[0_8px_25px_rgba(0,0,0,0.3)] !shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
                    style={heroButtonPrimaryStyle}
                    icon={<EnvironmentOutlined />}
                  >
                    {t("hero.btn1")}
                  </Button>

                  <Button
                    size="large"
                    className="!h-[50px] !px-7 !text-base !rounded-[25px] !mx-2.5 transform transition-all duration-300 hover:!-translate-y-1 hover:!shadow-[0_8px_25px_rgba(0,0,0,0.3)] !shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
                    style={heroButtonSecondaryStyle}
                    icon={<ClockCircleOutlined />}
                  >
                    {t("hero.btn2")}
                  </Button>
                </Space>

                <div
                  className="inline-block !p-[15px_30px] !rounded-[50px] text-base"
                  style={currentTimeStyle}
                >
                  <ClockCircleOutlined style={{ marginRight: 8 }} />
                  {t("hero.now")}: {currentTime.toLocaleString("vi-VN")}
                </div>
              </>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HeroSection;
