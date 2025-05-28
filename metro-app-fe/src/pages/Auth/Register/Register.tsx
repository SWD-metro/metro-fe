import React, { useState } from "react";
import { Form, Input, Button, Typography, Checkbox, Row, Col } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Link as RouterLink } from "react-router-dom";
import path from "src/constants/path";

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async () => {
    setLoading(true);
  };

  return (
    <>
      <div className="text-center mb-6">
        <Title level={3} className="!text-cyan-800 mb-2">
          Đăng ký tài khoản
        </Title>
      </div>

      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        size="large"
        layout="vertical"
        scrollToFirstError
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Tên đăng nhập"
                className="rounded-lg h-12"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="full_name"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Họ và tên"
                className="rounded-lg h-12"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="email"
              rules={[
                { type: "email", message: "Email không hợp lệ!" },
                { required: false },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Email"
                className="rounded-lg h-12"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              rules={[
                {
                  pattern: /^[0-9]{10,11}$/,
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="Số điện thoại"
                className="rounded-lg h-12"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item
              name="cccd"
              rules={[
                { pattern: /^[0-9]{12}$/, message: "CCCD phải có 12 chữ số!" },
              ]}
            >
              <Input
                prefix={<IdcardOutlined className="text-gray-400" />}
                placeholder="Số CCCD (không bắt buộc)"
                className="rounded-lg h-12"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Mật khẩu"
                className="rounded-lg h-12"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Mật khẩu xác nhận không khớp!");
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Xác nhận mật khẩu"
                className="rounded-lg h-12"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  required: true,
                  message: "Vui lòng đồng ý với điều khoản sử dụng!",
                },
              ]}
            >
              <Checkbox>
                Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                shape="round"
                loading={loading}
                style={{ width: "70%", margin: "0 auto", display: "block" }}
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <div className="text-center">
          <Text className="text-gray-600">
            Đã có tài khoản?{" "}
            <RouterLink
              to={path.login}
              className="text-blue-600 hover:text-blue-800 font-medium no-underline"
            >
              Đăng nhập ngay
            </RouterLink>
          </Text>
        </div>
      </Form>
    </>
  );
};

export default RegisterPage;
