import { Button, Col, Divider, Row, Typography } from "antd";
import React from "react";
import {
  AndroidOutlined,
  AppleOutlined,
  CreditCardOutlined,
  GlobalOutlined,
  MobileOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import "./WhatToKnow.scss";

const { Title, Paragraph, Text } = Typography;

const WhatToKnow: React.FC = () => {
  return (
    <div className="whatToKnow">
      <div className="ticket-section">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Title className="section-title-dark">Mua Vé Điện Tử</Title>
          <Paragraph className="section-subtitle-dark">
            Hai cách tiện lợi để mua vé Metro - Nhận vé điện tử dạng mã QR để
            quét khi lên tàu
          </Paragraph>
          <Paragraph className="section-highlight">
            🎉 Chỉ từ <strong>7.000 đồng/lượt</strong> – Giải pháp tiết kiệm,
            nhanh chóng và hiện đại cho mỗi hành trình của bạn!
          </Paragraph>

          <div className="ticket-method">
            <Row gutter={[60, 60]} align="middle">
              <Col xs={24} md={12}>
                <Title level={3} className="method-title">
                  <GlobalOutlined className="method-icon" />
                  Mua Vé Qua Website
                </Title>
                <Paragraph className="method-description">
                  Mua vé trực tuyến qua website, thanh toán online và nhận vé
                  điện tử ngay lập tức
                </Paragraph>
                <div className="sample-ticket">
                  <div className="ticket-header">
                    <Text strong style={{ color: "#667eea", fontSize: "18px" }}>
                      VÉ METRO HCMC
                    </Text>
                    <br />
                    <Text type="secondary">Vé điện tử</Text>
                  </div>
                  <div className="ticket-qr">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=METRO-TICKET-12345&bgcolor=ffffff&color=000000"
                      alt="QR Code Vé Tàu"
                      style={{
                        width: "200px",
                        height: "150px",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                  <div className="ticket-info">
                    <Text strong>Ga Bến Thành → Ga Suối Tiên</Text>
                    <br />
                    <Text type="secondary">Hạn sử dụng: 1 ngày</Text>
                  </div>
                </div>
                <div className="method-buttons">
                  <Button
                    type="primary"
                    size="large"
                    className="method-button method-button-primary"
                    icon={<CreditCardOutlined />}
                  >
                    Mua Vé Online
                  </Button>
                  <Button
                    size="large"
                    className="method-button method-button-outline"
                    icon={<QrcodeOutlined />}
                  >
                    Vé Của Tôi
                  </Button>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className="method-steps">
                  <Text strong style={{ color: "#ffd700", fontSize: "18px" }}>
                    Cách mua vé:
                  </Text>
                  <ul style={{ marginTop: 20 }}>
                    <li>Truy cập website Metro HCMC</li>
                    <li>Chọn ga đi và ga đến</li>
                    <li>Thanh toán qua thẻ/ví điện tử</li>
                    <li>Nhận vé QR qua email/SMS</li>
                    <li>Quét QR khi lên tàu</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>

          <Divider
            style={{
              borderColor: "rgba(255,255,255,0.2)",
              margin: "20px 0",
            }}
          />

          <div className="ticket-method">
            <Row gutter={[60, 60]} align="middle">
              <Col xs={24} md={12} order={2}>
                <Title level={3} className="method-title">
                  <MobileOutlined className="method-icon" />
                  Tải Ứng Dụng Metro HCMC
                </Title>
                <Paragraph className="method-description">
                  Trải nghiệm đầy đủ với ứng dụng di động - Mua vé, tra cứu lịch
                  trình, định vị ga tàu
                </Paragraph>
                <div className="app-preview">
                  <img
                    src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=600&fit=crop"
                    alt="Metro App Screenshot"
                    className="app-screenshot"
                  />
                  <div className="app-features">
                    <Title level={5}>Tính năng nổi bật:</Title>
                    <ul>
                      <li>🎫 Mua vé trực tuyến</li>
                      <li>🕐 Tra cứu lịch tàu</li>
                      <li>📍 Định vị ga gần nhất</li>
                      <li>💳 Thanh toán nhanh gọn</li>
                      <li>🔔 Nhận thông báo tức thì</li>
                      <li>📊 Lịch sử di chuyển</li>
                    </ul>
                  </div>
                </div>
                <Row gutter={[20, 20]} className="download-buttons">
                  <Col span={12}>
                    <Button
                      block
                      size="large"
                      className="download-button ios"
                      icon={<AppleOutlined />}
                    >
                      App Store
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button
                      block
                      size="large"
                      className="download-button android"
                      icon={<AndroidOutlined />}
                    >
                      Google Play
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} md={12} order={1}>
                <div className="method-steps">
                  <Text strong style={{ color: "#ffd700", fontSize: "18px" }}>
                    Tại sao chọn App:
                  </Text>
                  <ul style={{ marginTop: 20 }}>
                    <li>Mua vé mọi lúc mọi nơi</li>
                    <li>Lưu thông tin thanh toán</li>
                    <li>Nhận thông báo tàu trễ</li>
                    <li>Tích điểm thành viên</li>
                    <li>Hỗ trợ đa ngôn ngữ</li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatToKnow;
