import React from "react";
import { Layout, Timeline } from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import newsSection from "src/assets/news_section.jpg";
import metroMap from "src/assets/metro_map.jpg";
import statsBackground from "src/assets/stats_section.jpg";
import featuresBackground from "src/assets/feature_section.png";
import { useTranslation } from "react-i18next";

const { Content } = Layout;

const HomePage: React.FC = () => {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: false });
  const { t } = useTranslation("home");
  const newsData = t("news.items", { returnObjects: true }) as Array<{
    title: string;
    time: string;
  }>;
  const newsColors = ["green", "blue", "orange", "purple"];

  return (
    <div className="metro-homepage">
      <Layout>
        <Content className="pt-2.5">
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

          <section className="bg-gradient-to-b from-gray-50 to-white py-16 border-t-4 border-cyan-500">
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
            className="relative bg-cover bg-center bg-no-repeat py-16"
            style={{ backgroundImage: `url(${featuresBackground})` }}
          >
            <div className="relative z-10 max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 uppercase tracking-wider">
                    {t("news.title")}
                  </h2>

                  <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20">
                    <Timeline className="custom-timeline">
                      {newsData.map((news, index) => (
                        <Timeline.Item
                          key={index}
                          color={newsColors[index % newsColors.length]}
                        >
                          <div className="bg-white bg-opacity-5 rounded-lg backdrop-blur-sm">
                            <h5 className="text-black font-semibold mb-2 text-lg">
                              {news.title}
                            </h5>
                            <span className="text-cyan-800 text-sm font-medium">
                              {news.time}
                            </span>
                          </div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </div>
                </div>

                <div className="relative">
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <img
                      src={newsSection}
                      alt="Metro News"
                      className="w-full h-80 lg:h-96 object-cover hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="bg-red-500 text-xs px-2 py-1 rounded-full font-semibold mb-2">
                        {t("news.latest")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Content>
      </Layout>
    </div>
  );
};

export default HomePage;
