import React, { useState } from "react";
import { Layout, Collapse, Row, Col } from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  MinusOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  CreditCardOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import metroMap from "src/assets/metro_map.jpg";
import statsBackground from "src/assets/stats_section.jpg";
import featuresBackground from "src/assets/feature_section.png";
import aboutUs from "src/assets/about-us.png";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import path from "src/constants/path";

const { Content } = Layout;

interface InfoItem {
  key: string;
  label: string;
  content: string;
}

interface MenuItem {
  icon: React.ReactNode;
  title: string;
  bgColor: string;
  path: string;
}

const HomePage: React.FC = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: false });
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const menuItems: MenuItem[] = [
    {
      icon: <CarOutlined />,
      title: t("menu.map"),
      bgColor: "bg-cyan-800",
      path: path.mapRoute,
    },
    {
      icon: <CarOutlined />,
      title: t("menu.route"),
      bgColor: "bg-yellow-500",
      path: "",
    },
    {
      icon: <CreditCardOutlined />,
      title: t("menu.buyTicket"),
      bgColor: "bg-red-400",
      path: path.buyTicket,
    },
    {
      icon: <InfoCircleOutlined />,
      title: t("menu.intructions"),
      bgColor: "bg-cyan-400",
      path: path.services,
    },
  ];

  const infoItems: InfoItem[] = [
    {
      key: "1",
      label: t("information.schedule"),
      content: t("information.scheduleContent"),
    },
    {
      key: "2",
      label: t("information.ticketPrice"),
      content: t("information.ticketPriceContent"),
    },
    {
      key: "3",
      label: t("information.freeTicket"),
      content: t("information.freeTicketContent"),
    },
    {
      key: "4",
      label: t("information.luggage"),
      content: t("information.luggageContent"),
    },
  ];

  const handleCollapseChange = (keys: string | string[]) => {
    setActiveKeys(Array.isArray(keys) ? keys : [keys]);
  };

  const customExpandIcon = ({ isActive }: { isActive?: boolean }) => (
    <div className="flex items-center justify-center w-6 h-6">
      {isActive ? (
        <MinusOutlined className="!text-cyan-200 text-sm" />
      ) : (
        <PlusOutlined className="!text-cyan-200 text-sm" />
      )}
    </div>
  );

  const items = infoItems.map((item) => ({
    key: item.key,
    label: (
      <span className="text-white font-medium text-base">{item.label}</span>
    ),
    children: (
      <div className="text-cyan-100 text-base leading-relaxed pl-2  whitespace-pre-line">
        {item.content}
      </div>
    ),
  }));

  return (
    <div className="metro-homepage">
      <Layout>
        <Content>
          <section
            className="relative py-6 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${statsBackground})` }}
          >
            <div className="max-w-6xl mx-auto ">
              <Row gutter={[32, 32]} justify="center" align="middle">
                {menuItems.map((item, index) => (
                  <Col
                    key={index}
                    xs={24}
                    sm={12}
                    lg={6}
                    className="!flex !justify-center"
                  >
                    <div
                      className={`${item.bgColor} rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:opacity-90 transition-opacity shadow-lg min-h-[140px] min-w-[140px] w-full max-w-[220px]`}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <div className="text-white text-4xl mb-3">
                        {item.icon}
                      </div>
                      <div className="text-white text-sm font-medium text-center leading-tight">
                        {item.title}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </section>

          <section
            className="relative py-6 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${featuresBackground})` }}
          >
            <div className="relative z-10 max-w-6xl mx-auto px-4">
              <div className="text-center mb-12 pt-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 uppercase tracking-wider">
                  {t("features.title")}
                </h1>
                <p className="text-lg lg:text-xl text-white font-light max-w-2xl mx-auto">
                  {t("features.subtitle")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                <div className="group">
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-center transform transition-all duration-300 hover:-translate-y-2 hover:bg-opacity-20 border border-white border-opacity-20">
                    <SafetyCertificateOutlined className="text-5xl text-cyan-400 mb-6 block" />
                    <h3 className="text-xl font-semibold text-black mb-4">
                      {t("features.safety.title")}
                    </h3>
                    <p className="text-black text-opacity-90 leading-relaxed">
                      {t("features.safety.description")}
                    </p>
                  </div>
                </div>

                <div className="group">
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-center transform transition-all duration-300 hover:-translate-y-2 hover:bg-opacity-20 border border-white border-opacity-20">
                    <ClockCircleOutlined className="text-5xl text-cyan-400 mb-6 block" />
                    <h3 className="text-xl font-semibold  text-black mb-4">
                      {t("features.punctual.title")}
                    </h3>
                    <p className="text-black text-opacity-90 leading-relaxed">
                      {t("features.punctual.description")}
                    </p>
                  </div>
                </div>

                <div className="group">
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-center transform transition-all duration-300 hover:-translate-y-2 hover:bg-opacity-20 border border-white border-opacity-20">
                    <EnvironmentOutlined className="text-5xl text-cyan-400 mb-6 block" />
                    <h3 className="text-xl font-semibold text-black mb-4">
                      {t("features.environment.title")}
                    </h3>
                    <p className="text-black text-opacity-90 leading-relaxed">
                      {t("features.environment.description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="relative py-16 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${statsBackground})` }}
            ref={ref}
          >
            <div className="relative z-10 max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center p-6">
                  <div className="bg-white bg-opacity-10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <EnvironmentOutlined className="text-3xl text-cyan-500" />
                  </div>
                  <div className="text-5xl font-bold text-cyan-800 mb-2">
                    {inView ? <CountUp end={14} duration={2} /> : 0}
                  </div>
                  <div className="text-sm text-cyan-600 uppercase tracking-wider font-semibold">
                    {t("stats.stations")}
                  </div>
                </div>

                <div className="text-center p-6">
                  <div className="bg-white bg-opacity-10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <ThunderboltOutlined className="text-3xl text-cyan-400" />
                  </div>
                  <div className="text-5xl font-bold text-cyan-800 mb-2">
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
                  <div className="text-sm text-cyan-600 uppercase tracking-wider font-semibold">
                    {t("stats.totalLength")}
                  </div>
                </div>

                <div className="text-center p-6">
                  <div className="bg-white bg-opacity-10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <TeamOutlined className="text-3xl text-cyan-400" />
                  </div>
                  <div className="text-5xl font-bold text-cyan-800 mb-2">
                    {inView ? (
                      <CountUp end={100000} separator="," duration={2} />
                    ) : (
                      0
                    )}
                  </div>
                  <div className="text-sm text-cyan-600 uppercase tracking-wider font-semibold">
                    {t("stats.passengersPerDay")}
                  </div>
                </div>

                <div className="text-center p-6">
                  <div className="bg-white bg-opacity-10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <GlobalOutlined className="text-3xl text-cyan-400" />
                  </div>
                  <div className="text-5xl font-bold text-cyan-800 mb-2">
                    {inView ? <CountUp end={5} duration={2} /> : `0`}
                  </div>
                  <div className="text-sm text-cyan-600 uppercase tracking-wider font-semibold">
                    {t("stats.frequency")}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 border-t-4 border-cyan-500">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4 uppercase tracking-wider">
                  {t("metroMap.title")}
                </h2>
                <p className="text-lg lg:text-xl text-gray-600 font-light max-w-2xl mx-auto">
                  {t("metroMap.subtitle")}
                </p>
              </div>

              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl border-4 border-cyan-400 overflow-hidden">
                  <img
                    src={metroMap}
                    alt="Metro Map"
                    className="w-full h-96 lg:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-cyan-400 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                  {t("metroMap.line1")}
                </div>
              </div>
            </div>
          </section>

          <section
            className="relative bg-cover bg-center bg-no-repeat py-12"
            style={{ backgroundImage: `url(${featuresBackground})` }}
          >
            <div className="max-w-6xl mx-auto">
              <Row gutter={[32, 32]} align="middle">
                <Col xs={24} md={24} lg={12}>
                  <div className="p-4 lg:p-8 flex flex-col justify-start">
                    <div className="mb-2">
                      <span className="text-white text-sm font-bold">
                        {t("information.title")}
                      </span>
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-8">
                      {t("information.subtitle")}
                    </h1>

                    <div className="space-y-1">
                      <Collapse
                        items={items}
                        activeKey={activeKeys}
                        onChange={handleCollapseChange}
                        expandIcon={customExpandIcon}
                        ghost
                        size="large"
                      />
                    </div>
                  </div>
                </Col>

                <Col xs={24} md={24} lg={12}>
                  <div className="flex items-center justify-center h-full">
                    <img
                      src={aboutUs}
                      alt="Hình ảnh tàu Metro"
                      className="object-cover w-full h-auto max-h-[500px] rounded-lg shadow-lg"
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </section>
        </Content>
      </Layout>
    </div>
  );
};

export default HomePage;
