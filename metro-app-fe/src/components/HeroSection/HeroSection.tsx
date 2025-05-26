import React, { useState, useEffect } from "react";
import { Typography, Button, Carousel, Space } from "antd";
import { EnvironmentOutlined, ClockCircleOutlined } from "@ant-design/icons";
import background1 from "../../assets/background1.jpg";
import background2 from "../../assets/background2.jpg";
import background3 from "../../assets/background3.jpg";
import { useLocation } from "react-router-dom";
import "./HeroSection.scss";

const { Title, Paragraph } = Typography;

const HeroSection: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const heroImages = [
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
  return (
    <>
      <div className={`hero-section ${isHome ? "hero-home" : "hero-subpage"}`}>
        <Carousel autoplay effect="fade" dots={false} speed={1000}>
          {heroImages.map((image, index) => (
            <div key={index}>
              <img
                src={image.url}
                alt={image.title}
                className="carousel-image"
              />
            </div>
          ))}
        </Carousel>
        <div className="hero-overlay">
          {isHome && (
            <div className="hero-content">
              <Title className="hero-title">METRO HỒ CHÍ MINH</Title>
              <>
                <Paragraph className="hero-subtitle">
                  Hệ thống giao thông công cộng hiện đại - Kết nối mọi điểm đến
                  trong thành phố
                </Paragraph>
                <Space size="large" className="hero-buttons">
                  <Button
                    type="primary"
                    size="large"
                    className="hero-button hero-button-primary"
                    icon={<EnvironmentOutlined />}
                  >
                    Xem Bản Đồ Tuyến
                  </Button>
                  <Button
                    size="large"
                    className="hero-button hero-button-secondary"
                    icon={<ClockCircleOutlined />}
                  >
                    Lịch Trình Tàu
                  </Button>
                </Space>
                <div className="current-time">
                  <ClockCircleOutlined style={{ marginRight: 8 }} />
                  Hiện tại: {currentTime.toLocaleString("vi-VN")}
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
