import React from "react";
import { Row, Col, Typography, Space, Button, Card, Divider } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import aboutUs from "src/assets/about-us.png";
import statsBackground from "src/assets/stats_section.jpg";
import aboutLogo from "src/assets/about-logo.png";
import { useTranslation } from "react-i18next";

const { Title, Paragraph, Text } = Typography;

const AboutUsPage: React.FC = () => {
  const { t } = useTranslation("home");
  return (
    <div
      className="min-h-screen py-6"
      style={{ backgroundImage: `url(${statsBackground})` }}
    >
      <div className="w-[85%] mx-auto px-4 sm:px-6">
        <Divider className="!my-4 !border-cyan-800 !text-cyan-400 !text-lg !font-semibold">
          <span className="px-4">✦✦✦</span>
        </Divider>
        <Row gutter={[32, 32]} align="middle" className="mb-12">
          <Col span={24} md={12}>
            <div className="relative rounded-lg overflow-hidden shadow-sm">
              <img
                src={aboutUs}
                alt="Hành Trình Phát Triển"
                className="w-[90%] h-auto object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <Title level={3} className="text-white mb-0">
                  {t("aboutus.developmentJourney.metroLine")}
                </Title>
              </div>
            </div>
          </Col>
          <Col span={24} md={12}>
            <Space direction="vertical" size="middle" className="w-full">
              <Title level={1} className="!text-cyan-800">
                {t("aboutus.developmentJourney.title")}
              </Title>
              <Paragraph className="text-gray-700 !text-xl leading-relaxed">
                {t("aboutus.developmentJourney.paragraph1")}
              </Paragraph>
              <Paragraph className="text-gray-700 !text-xl leading-relaxed">
                {t("aboutus.developmentJourney.paragraph2")}
              </Paragraph>
              <Paragraph className="text-gray-700 !text-xl leading-relaxed">
                {t("aboutus.developmentJourney.paragraph3")}
              </Paragraph>
            </Space>
          </Col>
        </Row>

        <Divider className="!my-8 !border-cyan-800 !text-cyan-400 !text-lg !font-semibold">
          <span className="px-4">✦✦✦</span>
        </Divider>

        <Title level={1} className="text-center !text-cyan-800 mb-10">
          {t("aboutus.pageTitle")}
        </Title>
        <Row gutter={[32, 32]} align="middle" className="mb-16">
          <Col span={24} md={12}>
            <Space direction="vertical" size="large" className="w-full">
              <div>
                <Title level={3} className="!text-cyan-800 mb-2">
                  {t("aboutus.mission.title")}
                </Title>
                <Paragraph className="text-gray-700 !text-lg leading-relaxed">
                  {t("aboutus.mission.description")}
                </Paragraph>
              </div>
              <div>
                <Title level={3} className="!text-cyan-800 mb-2">
                  {t("aboutus.vision.title")}
                </Title>
                <Paragraph className="text-gray-700 !text-lg leading-relaxed">
                  {t("aboutus.vision.description")}
                </Paragraph>
              </div>
            </Space>
          </Col>
          <Col span={24} md={12}>
            <div className="relative">
              <img
                src={aboutLogo}
                alt="Hành Trình Phát Triển"
                className="w-[80%] h-auto object-cover"
              />
            </div>
          </Col>
        </Row>
        <Card className="shadow-md rounded-lg">
          <Title level={2} className="text-center !text-cyan-800 !mb-10">
            {t("aboutus.contact.title")}
          </Title>
          <Row gutter={[32, 32]}>
            <Col span={24} md={12}>
              <div className="flex items-start space-x-4 p-4 border-1 bg-white rounded-lg shadow-sm mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <EnvironmentOutlined className="text-xl text-blue-600" />
                </div>
                <div>
                  <Text strong className="!text-cyan-600 !text-xl block">
                    {t("aboutus.contact.address.label")}
                  </Text>
                  <Text className="!text-cyan-800 font-bold">
                    {t("aboutus.contact.address.value")}
                  </Text>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 border-1 bg-white rounded-lg shadow-sm mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <PhoneOutlined className="text-xl text-green-600" />
                </div>
                <div>
                  <Text strong className="!text-cyan-600 !text-xl block">
                    {t("aboutus.contact.phone.label")}
                  </Text>
                  <Text className="!text-cyan-800 font-bold">
                    {t("aboutus.contact.phone.value")}
                  </Text>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 border-1 bg-white rounded-lg shadow-sm mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <MailOutlined className="text-xl text-orange-600" />
                </div>
                <div>
                  <Text strong className="!text-cyan-600 !text-xl block">
                    {t("aboutus.contact.email.label")}
                  </Text>
                  <Text className="!text-cyan-800 font-bold">
                    {t("aboutus.contact.email.value")}
                  </Text>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 border-1 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <ClockCircleOutlined className="text-xl text-purple-600" />
                </div>
                <div>
                  <Text strong className="!text-cyan-600 !text-xl block">
                    {t("aboutus.contact.workingHours.label")}
                  </Text>
                  <Text className="!text-cyan-800 font-bold">
                    {t("aboutus.contact.workingHours.value")}
                  </Text>
                </div>
              </div>
            </Col>

            <Col span={24} md={12}>
              <div className="bg-white p-6 rounded-lg shadow-sm border-1 h-full">
                <div className="mb-4">
                  <Text strong className="!text-cyan-800 block mb-1">
                    {t("aboutus.contact.contactForm.fullName.label")}
                  </Text>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                    placeholder={t(
                      "aboutus.contact.contactForm.fullName.placeholder"
                    )}
                  />
                </div>

                <div className="mb-4">
                  <Text strong className="!text-cyan-800 block mb-1">
                    Email *
                  </Text>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                    placeholder={t(
                      "aboutus.contact.contactForm.email.placeholder"
                    )}
                  />
                </div>

                <div className="mb-4">
                  <Text strong className="!text-cyan-800 block mb-1">
                    {t("aboutus.contact.contactForm.phone.label")}
                  </Text>
                  <input
                    type="tel"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                    placeholder={t(
                      "aboutus.contact.contactForm.phone.placeholder"
                    )}
                  />
                </div>

                <div className="mb-4">
                  <Text strong className="!text-cyan-800 block mb-1">
                    {t("aboutus.contact.contactForm.message.label")}
                  </Text>
                  <textarea
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none resize-none"
                    placeholder={t(
                      "aboutus.contact.contactForm.message.placeholder"
                    )}
                  />
                </div>

                <Button type="primary" size="large" className="w-full !h-12">
                  {t("aboutus.contact.contactForm.submitButton")}
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default AboutUsPage;
