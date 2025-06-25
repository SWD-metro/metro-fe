import React, { useContext, useState } from "react";
import {
  Typography,
  Tabs,
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Divider,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { AppContext } from "src/contexts/app.context";

const { Title, Text } = Typography;

const MainContent: React.FC = () => {
  const [isEdit, setIsEdit] = useState(false);
  const { profile } = useContext(AppContext);

  const [form] = Form.useForm();

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
    form.resetFields();
  };
  const handleSave = () => {};

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
                  <Text className="text-purple-600 text-sm">Từ 15/03/2023</Text>
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
                          <UserOutlined className="mr-2 text-blue-500" />
                          Tên đầy đủ
                        </span>
                      }
                      name="name"
                      rules={[
                        { required: true, message: "Vui lòng nhập họ và tên!" },
                      ]}
                    >
                      <Input
                        placeholder="Nhập tên đầy đủ"
                        disabled={!isEdit}
                        className={`!h-12 !rounded-xl transition-all duration-300 ${
                          isEdit
                            ? "!border-blue-300 hover:!border-blue-400 focus:!border-blue-500 !shadow-lg"
                            : "!bg-gray-50 !border-gray-200"
                        }`}
                        prefix={<UserOutlined className="text-gray-400" />}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Form.Item
                      label={
                        <span className="text-gray-700 font-semibold">
                          <MailOutlined className="mr-2 text-red-500" />
                          Email
                        </span>
                      }
                      name="email"
                      rules={[
                        { type: "email", message: "Email không hợp lệ!" },
                      ]}
                    >
                      <Input
                        disabled
                        className="!h-12 !rounded-xl !bg-gray-50 !border-gray-200"
                        prefix={<MailOutlined className="text-gray-400" />}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                  {isEdit ? (
                    <>
                      <Button
                        onClick={handleCancel}
                        className="!h-12 !px-6 !rounded-xl !border-gray-300 hover:!border-gray-400 !text-gray-700 hover:!text-gray-800 !font-medium transition-all duration-300"
                        icon={<CloseOutlined />}
                      >
                        Hủy bỏ
                      </Button>
                      <Button
                        type="primary"
                        onClick={handleSave}
                        className="!h-12 !px-6 !rounded-xl !bg-gradient-to-r !from-blue-500 !to-purple-600 hover:!from-blue-600 hover:!to-purple-700 !border-none !font-medium !shadow-lg hover:!shadow-xl hover:!scale-105 transition-all duration-300"
                        icon={<SaveOutlined />}
                      >
                        Lưu thay đổi
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="primary"
                      onClick={handleEdit}
                      className="!h-12 !px-6 !rounded-xl !bg-gradient-to-r !from-blue-500 !to-purple-600 hover:!from-blue-600 hover:!to-purple-700 !border-none !font-medium !shadow-lg hover:!shadow-xl hover:!scale-105 transition-all duration-300"
                      icon={<EditOutlined />}
                    >
                      Cập nhật thông tin
                    </Button>
                  )}
                </div>
              </Form>
            </Card>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default MainContent;
