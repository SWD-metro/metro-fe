import React from "react";
import { Button, Col, Row } from "antd";
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
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import path from "src/constants/path";

type StepsListProps = {
  steps: string[];
  isLight?: boolean;
};

const ServicePage: React.FC = () => {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  return (
    <div>
      <section
        className="relative py-5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${statsBackground})` }}
      >
        <div className="relative z-10 max-w-6xl mx-auto p-5">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4 uppercase tracking-wide">
              {t("services.title")}
            </h1>
            <p className="text-lg text-black mb-5 font-light">
              {t("services.subtitle")}
            </p>
            <p className="text-xl text-red-400 font-semibold mb-5">
              {t("services.promo")}
            </p>
          </div>

          <div className="relative p-8 border border-cyan-600 rounded-3xl mb-8 bg-white bg-opacity-10 backdrop-blur-sm">
            <Row gutter={[60, 60]} align="middle">
              <Col xs={24} md={12}>
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-black mb-5 flex items-center justify-center gap-3">
                    <GlobalOutlined className="text-blue-400 text-3xl" />
                    {t("services.methods.website.title")}
                  </h3>
                  <p className="text-black text-base mb-5 leading-relaxed">
                    {t("services.methods.website.description")}
                  </p>

                  <div className="bg-white rounded-2xl p-6 border border-cyan-600 relative mb-6">
                    <div className="mb-4 pb-3 border-b-2 border-dashed border-cyan-600 relative z-10">
                      <div className="font-bold text-cyan-800 text-lg">
                        {t("services.methods.website.ticket.title")}
                      </div>
                      <div className="text-cyan-800">
                        {t("services.methods.website.ticket.type")}
                      </div>
                    </div>

                    <div className="my-4 bg-gray-50 rounded-lg inline-block relative z-10">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=METRO-TICKET-12345&bgcolor=ffffff&color=000000"
                        alt="QR Code Vé Tàu"
                        className="w-48 h-36 rounded-lg"
                      />
                    </div>

                    <div className="mt-4 pt-3 border-t-2 border-dashed border-cyan-600 relative z-10">
                      <div className="font-bold text-cyan-800">
                        {t("services.methods.website.ticket.route")}
                      </div>
                      <div className="text-cyan-600">
                        {" "}
                        {t("services.methods.website.ticket.validity")}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4">
                    <Button
                      type="primary"
                      size="large"
                      icon={<CreditCardOutlined />}
                      onClick={() => navigate(path.buyTicket)}
                    >
                      {t("services.methods.website.buttons.buy")}
                    </Button>
                    <Button
                      size="large"
                      icon={<QrcodeOutlined />}
                      onClick={() => navigate(path.myTicket)}
                    >
                      {t("services.methods.website.buttons.myTickets")}
                    </Button>
                  </div>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <div className="font-bold text-red-400 text-lg mb-5">
                    {t("services.methods.website.steps.title")}
                  </div>
                  <StepsList
                    steps={
                      t("services.methods.website.steps.items", {
                        returnObjects: true,
                      }) as string[]
                    }
                  />
                </div>
              </Col>
            </Row>
          </div>

          <div
            className="relative p-8 border border-cyan-600 rounded-3xl bg-cover bg-center"
            style={{ backgroundImage: `url(${statsBackground})` }}
          >
            <div className="relative z-10">
              <Row gutter={[60, 60]} align="middle">
                <Col xs={24} md={12}>
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-2xl border border-white border-opacity-20">
                    <div className="font-bold text-red-400 text-lg mb-5">
                      {t("services.methods.app.benefits.title")}
                    </div>
                    <StepsList
                      steps={
                        t("services.methods.app.benefits.items", {
                          returnObjects: true,
                        }) as string[]
                      }
                      isLight={true}
                    />
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-black mb-5 flex items-center justify-center gap-3">
                      <MobileOutlined className="text-blue-400 text-3xl" />
                      {t("services.methods.app.title")}
                    </h3>
                    <p className="text-black text-base mb-5 leading-relaxed">
                      {t("services.methods.app.description")}
                    </p>

                    <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                      <img
                        src={metromb}
                        alt="Metro App Screenshot"
                        className="w-40 h-72 object-cover rounded-2xl border-2 border-cyan-400"
                      />
                      <div className="text-left">
                        <h5 className="text-black text-xl mb-4 font-semibold">
                          {t("services.methods.app.features.title")}
                        </h5>
                        <ul className="space-y-2">
                          {(
                            t("services.methods.app.features.items", {
                              returnObjects: true,
                            }) as string[]
                          ).map((feature, index) => (
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
                        icon={<AppleOutlined />}
                      >
                        App Store
                      </Button>
                      <Button size="large" icon={<AndroidOutlined />}>
                        Google Play
                      </Button>
                    </div>
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
          <div className="flex-shrink-0 w-5 h-5 bg-cyan-800 text-white rounded-full flex items-center justify-center text-xs font-bold">
            {index + 1}
          </div>
          <div
            className={`text-base ${
              isLight ? "text-cyan-600" : "text-cyan-800"
            }`}
          >
            {step}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicePage;
