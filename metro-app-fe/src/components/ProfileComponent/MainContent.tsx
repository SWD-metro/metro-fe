import React, { useContext } from "react";
import { Typography, Tabs, Form, Input, Card, Row, Col, Divider } from "antd";
import {
  UserOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { AppContext } from "src/contexts/app.context";
import { formatDDMMYY } from "src/utils/utils";

const { Title, Text } = Typography;

const MainContent: React.FC = () => {
  const { profile } = useContext(AppContext);

  const [form] = Form.useForm();

  return (
    <div className="p-6">
      <Tabs
        defaultActiveKey="1"
        className="bg-white/70 backdrop-blur-sm rounded-2xl border-4 border-gray-300 overflow-hidden"
        size="large"
      >
        <Tabs.TabPane
          tab={
            <span className="text-black font-semibold px-2">
              <UserOutlined className="mr-2" />
              Thông tin tài khoản
            </span>
          }
          key="1"
        >
          <div className="p-8">
            <Row gutter={[16, 16]} className="mb-8">
              <Col xs={24} sm={8}>
                <Card className="text-center border-1 hover:shadow-xl transition-all duration-300">
                  <CheckCircleOutlined className="text-3xl text-green-500 mb-2" />
                  <Title level={5} className="!mb-1 !text-green-700">
                    Đã xác thực
                  </Title>
                  <Text className="text-green-600 text-sm">Email</Text>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className="text-center border-1 hover:shadow-xl transition-all duration-300">
                  <CheckCircleOutlined className="text-3xl text-blue-500 mb-2" />
                  <Title level={5} className="!mb-1 !text-blue-700">
                    Bảo mật cao
                  </Title>
                  <Text className="text-blue-600 text-sm">2FA được bật</Text>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card className="text-center border-1  hover:shadow-xl transition-all duration-300">
                  <CalendarOutlined className="text-3xl text-purple-500 mb-2" />
                  <Title level={5} className="!mb-1 !text-purple-700">
                    Thành viên
                  </Title>
                  <Text className="text-purple-600 text-sm">
                    Từ{" "}
                    {profile?.createdAt ? formatDDMMYY(profile.createdAt) : ""}
                  </Text>
                </Card>
              </Col>
            </Row>

            <Divider className="!my-8 bg-amber-950" />

            <Card
              className="border-1 !border-black bg-white/80 backdrop-blur-sm"
              title={
                <div className="flex items-center">
                  <div className="w-1 h-6 bg-gradient-to-b !from-red-500 to-blue-500 rounded-full mr-3"></div>
                  <Title level={4} className="!mb-0 !text-gray-800">
                    Dữ liệu cá nhân
                  </Title>
                </div>
              }
            >
              <Form
                form={form}
                layout="vertical"
                initialValues={profile!}
                className="space-y-6"
              >
                <Row gutter={[24, 16]}>
                  <Col xs={24} lg={12}>
                    <Form.Item
                      label={
                        <span className="text-gray-700 font-semibold">
                          Tên đầy đủ
                        </span>
                      }
                      name="name"
                    >
                      <Input
                        className="!h-12 !rounded-xl transition-all duration-300 
                            !border-blue-300 hover:!border-blue-400 focus:!border-blue-500 !shadow-lg"
                        prefix={<UserOutlined className="text-gray-400" />}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Form.Item
                      label={
                        <span className="text-gray-700 font-semibold">
                          Email
                        </span>
                      }
                      name="email"
                    >
                      <Input
                        className="!h-12 !rounded-xl transition-all duration-300 
                            !border-blue-300 hover:!border-blue-400 focus:!border-blue-500 !shadow-lg"
                        prefix={<MailOutlined className="text-gray-400" />}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default MainContent;
