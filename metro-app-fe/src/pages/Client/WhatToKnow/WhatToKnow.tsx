import React from "react";
import { Button, Col, Divider, Row } from "antd";
import {
  AndroidOutlined,
  AppleOutlined,
  CreditCardOutlined,
  GlobalOutlined,
  MobileOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import statsBackground from "src/assets/stats_section.jpg";
import metromb from "src/assets/app-metro-mb.jpg";

type StepsListProps = {
  steps: string[];
  isLight?: boolean;
};

const WhatToKnow: React.FC = () => {
  return (
    <div className="whatToKnow">
      <section
        className="relative py-5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${statsBackground})` }}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-600"></div>
        <div className="relative z-10 max-w-6xl mx-auto p-5">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4 uppercase tracking-wide">
              Mua Vé Điện Tử
            </h1>
            <p className="text-lg text-black mb-5 font-light">
              Hai cách tiện lợi để mua vé Metro - Nhận vé điện tử dạng mã QR để
              quét khi lên tàu
            </p>
            <p className="text-xl text-red-400 font-semibold mb-5">
              🎉 Chỉ từ <strong>7.000 đồng/lượt</strong> – Giải pháp tiết kiệm,
              nhanh chóng và hiện đại cho mỗi hành trình của bạn!
            </p>
          </div>

          <div className="relative p-8 border border-blue-600 rounded-3xl mb-8 bg-white bg-opacity-10 backdrop-blur-sm">
            <Row gutter={[60, 60]} align="middle">
              <Col xs={24} md={12}>
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-black mb-5 flex items-center justify-center gap-3">
                    <GlobalOutlined className="text-blue-400 text-3xl" />
                    Mua Vé Qua Website
                  </h3>
                  <p className="text-black text-base mb-5 leading-relaxed">
                    Mua vé trực tuyến qua website, thanh toán online và nhận vé
                    điện tử ngay lập tức
                  </p>

                  <div className="bg-white rounded-2xl p-6 border border-blue-600 relative mb-6">
                    <div className="mb-4 pb-3 border-b-2 border-dashed border-blue-600 relative z-10">
                      <div className="font-bold text-blue-600 text-lg">
                        VÉ METRO HCMC
                      </div>
                      <div className="text-gray-500">Vé điện tử</div>
                    </div>

                    <div className="my-4 bg-gray-50 rounded-lg inline-block relative z-10">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=METRO-TICKET-12345&bgcolor=ffffff&color=000000"
                        alt="QR Code Vé Tàu"
                        className="w-48 h-36 rounded-lg"
                      />
                    </div>

                    <div className="mt-4 pt-3 border-t-2 border-dashed border-blue-600 relative z-10">
                      <div className="font-bold text-gray-800">
                        Ga Bến Thành → Ga Suối Tiên
                      </div>
                      <div className="text-gray-500">Hạn sử dụng: 1 ngày</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4">
                    <Button
                      type="primary"
                      size="large"
                      className="h-11 px-6 text-sm font-semibold rounded-full border-none bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all duration-300"
                      icon={<CreditCardOutlined />}
                    >
                      Mua Vé Online
                    </Button>
                    <Button
                      size="large"
                      className="h-11 px-6 text-sm font-semibold rounded-full bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transform hover:-translate-y-0.5 transition-all duration-300"
                      icon={<QrcodeOutlined />}
                    >
                      Vé Của Tôi
                    </Button>
                  </div>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <div className="font-bold text-yellow-500 text-lg mb-5">
                    Cách mua vé:
                  </div>
                  <StepsList
                    steps={[
                      "Truy cập website Metro HCMC",
                      "Chọn ga đi và ga đến",
                      "Thanh toán qua thẻ/ví điện tử",
                      "Nhận vé QR qua email/SMS",
                      "Quét QR khi lên tàu",
                    ]}
                  />
                </div>
              </Col>
            </Row>
          </div>

          <div className="my-8">
            <Divider style={{ borderColor: "rgba(255,255,255,0.2)" }} />
          </div>

          <div
            className="relative p-8 border border-blue-600 rounded-3xl bg-cover bg-center"
            style={{ backgroundImage: `url(${statsBackground})` }}
          >
            <div className="relative z-10">
              <Row gutter={[60, 60]} align="middle">
                <Col xs={24} md={12} className="order-2 md:order-2">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-black mb-5 flex items-center justify-center gap-3">
                      <MobileOutlined className="text-blue-400 text-3xl" />
                      Tải Ứng Dụng Metro HCMC
                    </h3>
                    <p className="text-black text-base mb-5 leading-relaxed">
                      Trải nghiệm đầy đủ với ứng dụng di động - Mua vé, tra cứu
                      lịch trình, định vị ga tàu
                    </p>

                    <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                      <img
                        src={metromb}
                        alt="Metro App Screenshot"
                        className="w-36 h-72 object-cover rounded-3xl border-4 border-blue-600 shadow-2xl"
                      />
                      <div className="text-left">
                        <h5 className="text-black text-xl mb-4 font-semibold">
                          Tính năng nổi bật:
                        </h5>
                        <ul className="space-y-2">
                          {[
                            "🎫 Mua vé trực tuyến",
                            "🕐 Tra cứu lịch tàu",
                            "📍 Định vị ga gần nhất",
                            "💳 Thanh toán nhanh gọn",
                            "🔔 Nhận thông báo tức thì",
                            "📊 Lịch sử di chuyển",
                          ].map((feature, index) => (
                            <li
                              key={index}
                              className="text-black py-2 text-base border-b border-gray-600 hover:text-blue-400 transition-colors duration-300 cursor-pointer"
                            >
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Button
                        type="primary"
                        size="large"
                        className="h-11 rounded-2xl font-semibold text-sm bg-gray-800 text-white border-none hover:bg-gray-700 transform hover:-translate-y-0.5 transition-all duration-300"
                        icon={<AppleOutlined />}
                      >
                        App Store
                      </Button>
                      <Button
                        size="large"
                        className="h-11 rounded-2xl font-semibold text-sm bg-blue-600 text-white border-none hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all duration-300"
                        icon={<AndroidOutlined />}
                      >
                        Google Play
                      </Button>
                    </div>
                  </div>
                </Col>

                <Col xs={24} md={12} className="order-1 md:order-1">
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20">
                    <div className="font-bold text-yellow-400 text-lg mb-5">
                      Tại sao chọn App:
                    </div>
                    <StepsList
                      steps={[
                        "Mua vé mọi lúc mọi nơi",
                        "Lưu thông tin thanh toán",
                        "Nhận thông báo tàu trễ",
                        "Tích điểm thành viên",
                        "Hỗ trợ đa ngôn ngữ",
                      ]}
                      isLight={true}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const StepsList = ({ steps, isLight = false }: StepsListProps) => {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-4 py-2">
          <div className="flex-shrink-0 w-5 h-5 bg-blue-600 text-black rounded-full flex items-center justify-center text-xs font-bold">
            {index + 1}
          </div>
          <div
            className={`text-base ${isLight ? "text-black" : "text-gray-700"}`}
          >
            {step}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WhatToKnow;
