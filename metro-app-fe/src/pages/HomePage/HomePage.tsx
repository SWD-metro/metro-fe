import React from "react";
import { Layout, Typography, Row, Col, Timeline } from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

import newsSection from "../../assets/news_section.jpg";
import metroMap from "../../assets/metro_map.jpg";

import "./HomePage.scss";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const HomePage: React.FC = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: false });
  const newsData = [
    {
      title: "Tuyến Metro số 1 chính thức vận hành thương mại",
      time: "2024-12-19",
      color: "green",
    },
    {
      title: "Khai trương 14 ga tàu điện ngầm đầu tiên",
      time: "2024-12-15",
      color: "blue",
    },
    {
      title: "Lịch trình vận hành Metro Line 1 từ 6:00 - 22:00",
      time: "2024-12-10",
      color: "orange",
    },
    {
      title: "Giá vé Metro HCMC chính thức được công bố",
      time: "2024-12-05",
      color: "purple",
    },
  ];

  return (
    <div className="metro-homepage">
      <Layout>
        <Content className="main-content">
          <div className="features-section">
            <div
              style={{
                maxWidth: 1200,
                margin: "0 auto",
              }}
            >
              <Title className="section-title">Ưu Điểm Nổi Bật</Title>
              <Paragraph className="section-subtitle">
                Tại sao nên chọn Metro làm phương tiện di chuyển?
              </Paragraph>
              <Row gutter={[30, 30]}>
                <Col xs={24} md={8}>
                  <div className="feature-item">
                    <SafetyCertificateOutlined className="feature-icon" />
                    <Title level={4} className="feature-title">
                      An Toàn Tuyệt Đối
                    </Title>
                    <Paragraph className="feature-description">
                      Hệ thống an ninh hiện đại với camera giám sát 24/7, đảm
                      bảo an toàn tuyệt đối cho hành khách.
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="feature-item">
                    <ClockCircleOutlined className="feature-icon" />
                    <Title level={4} className="feature-title">
                      Đúng Giờ
                    </Title>
                    <Paragraph className="feature-description">
                      Tàu chạy đúng lịch trình với tần suất 3-5 phút/chuyến,
                      giúp tiết kiệm thời gian di chuyển.
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="feature-item">
                    <EnvironmentOutlined className="feature-icon" />
                    <Title level={4} className="feature-title">
                      Thân Thiện Môi Trường
                    </Title>
                    <Paragraph className="feature-description">
                      Sử dụng năng lượng điện sạch, góp phần giảm ô nhiễm không
                      khí và bảo vệ môi trường.
                    </Paragraph>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="stats-section" ref={ref}>
            <div
              className="stats-container"
              style={{ maxWidth: 1200, margin: "0 auto" }}
            >
              <Row gutter={[0, 40]}>
                <Col xs={24} sm={12} md={6}>
                  <div className="stats-item">
                    <EnvironmentOutlined className="stats-icon" />
                    <div className="stats-number">
                      {inView ? <CountUp end={14} duration={2} /> : 0}
                    </div>
                    <div className="stats-label">Ga Tàu Điện</div>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div className="stats-item">
                    <ThunderboltOutlined className="stats-icon" />
                    <div className="stats-number">
                      {inView ? (
                        <CountUp
                          end={19.7}
                          decimals={1}
                          suffix="km"
                          duration={2}
                        />
                      ) : (
                        "0km"
                      )}
                    </div>
                    <div className="stats-label">Tổng Chiều Dài</div>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div className="stats-item">
                    <TeamOutlined className="stats-icon" />
                    <div className="stats-number">
                      {inView ? (
                        <CountUp end={100000} separator="," duration={2} />
                      ) : (
                        0
                      )}
                    </div>
                    <div className="stats-label">Hành Khách/Ngày</div>
                  </div>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <div className="stats-item">
                    <GlobalOutlined className="stats-icon" />
                    <div className="stats-number">
                      {inView ? (
                        <CountUp end={5} suffix=" phút" duration={2} />
                      ) : (
                        "0 phút"
                      )}
                    </div>
                    <div className="stats-label">Phút/Chuyến</div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          <div className="map-section">
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <Title className="section-title">Bản Đồ Tuyến Metro</Title>
              <Paragraph className="section-subtitle">
                Khám phá các tuyến đường và ga tàu trên toàn thành phố
              </Paragraph>
              <div className="map-container">
                <img src={metroMap} alt="Metro Station" className="map-image" />
              </div>
            </div>
          </div>

          <div className="news-section">
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div className="news-content">
                <Row gutter={[60, 60]} align="middle">
                  <Col xs={24} md={12}>
                    <Title
                      className="section-title"
                      style={{ textAlign: "left", color: "white" }}
                    >
                      Tin Tức Mới Nhất
                    </Title>
                    <div className="timeline-container">
                      <Timeline>
                        {newsData.map((news, index) => (
                          <Timeline.Item key={index} color={news.color}>
                            <div>
                              <Title
                                level={5}
                                style={{ marginBottom: 5, color: "white" }}
                              >
                                {news.title}
                              </Title>
                              <Text style={{ color: "rgba(255,255,255,0.7)" }}>
                                {news.time}
                              </Text>
                            </div>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <img
                      src={newsSection}
                      alt="Metro Station"
                      className="news-image"
                    />
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default HomePage;
