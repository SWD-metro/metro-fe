import React from "react";
import { Typography, Divider, Row, Col, Space } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import "./Footer.scss";

const { Title, Text } = Typography;
const Footer: React.FC = () => {
  return (
    <>
      <footer className="metro-footer">
        <div className="metro-footer-container">
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={12}>
              <div className="metro-footer-content">
                <Title level={3} className="metro-footer-title">
                  Metro Hồ Chí Minh
                  <br />
                  <span className="metro-footer-subtitle">
                    Kết nối thành phố, kết nối tương lai
                  </span>
                </Title>

                <div className="metro-footer-contact">
                  <div className="metro-footer-contact-item">
                    <PhoneOutlined className="metro-footer-icon" />
                    <Text className="metro-footer-contact-text">
                      Hotline:{" "}
                      <span className="metro-footer-contact-highlight">
                        1900-xxxx
                      </span>
                    </Text>
                  </div>

                  <div className="metro-footer-contact-item">
                    <MailOutlined className="metro-footer-icon" />
                    <Text className="metro-footer-contact-text">
                      Email:{" "}
                      <span className="metro-footer-contact-highlight">
                        contact@metro.vn
                      </span>
                    </Text>
                  </div>

                  <div className="metro-footer-contact-item">
                    <EnvironmentOutlined className="metro-footer-icon" />
                    <Text className="metro-footer-contact-text">
                      Xem bản đồ tuyến Metro HCMC
                    </Text>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="metro-footer-map-wrapper">
                <div className="metro-footer-map-container">
                  <div className="metro-footer-map">
                    <iframe
                      src="https://www.google.com/maps/d/u/0/embed?mid=1bTGW1UXQB7O_B1UqLDQ5BX5iICtd-Rs&ehbc=2E312F&ll=10.903864470734938%2C106.74543857562064&z=13"
                      className="metro-footer-iframe"
                      title="Metro HCMC Map"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Divider className="metro-footer-divider" />

          <div className="metro-footer-copyright">
            <Text className="metro-footer-copyright-text">
              © 2025 Metro HCMC. Tất cả quyền được bảo lưu.
            </Text>
          </div>

          <div className="metro-footer-links">
            <Space
              split={<span className="metro-footer-separator">•</span>}
              className="metro-footer-links-container"
            >
              <span>Chính sách bảo mật</span>
              <span>Điều khoản sử dụng</span>
              <span>Liên hệ hỗ trợ</span>
              <span>FAQ</span>
            </Space>
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;
