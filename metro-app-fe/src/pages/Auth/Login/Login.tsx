import React, { useState } from "react";
import { Form, Input, Button, Typography, Divider, Checkbox } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { Link as RouterLink } from "react-router-dom";
import path from "src/constants/path";

const { Title, Text } = Typography;
const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async () => {
    setLoading(true);
  };

  return (
    <>
      <div className="text-center mb-6">
        <Title level={3} className="!text-cyan-800 mb-2">
          Đăng nhập
        </Title>
      </div>
      <Form name="login" onFinish={onFinish} size="large" layout="vertical">
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Tên đăng nhập"
            className="rounded-lg h-12"
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Mật khẩu"
            className="rounded-lg h-12"
          />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-between items-center">
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            <RouterLink
              to={path.forgotPassword}
              className="text-blue-600 hover:text-blue-800"
            >
              Quên mật khẩu?
            </RouterLink>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            shape="round"
            loading={loading}
            style={{ width: "70%", margin: "0 auto", display: "block" }}
          >
            Đăng nhập
          </Button>
        </Form.Item>

        <Divider className="text-gray-400 !my-2">Hoặc</Divider>

        <Button
          icon={<GoogleOutlined className="me-2" />}
          shape="round"
          style={{ width: "70%", margin: "0 auto", display: "block" }}
        >
          Đăng nhập với Google
        </Button>

        <div className="text-center space-y-2 pt-5">
          <div>
            <Text className="text-gray-600">
              Chưa có tài khoản?{" "}
              <RouterLink
                to={path.register}
                className="text-blue-600 hover:text-blue-800 font-medium no-underline"
              >
                Đăng ký ngay
              </RouterLink>
            </Text>
          </div>
        </div>
      </Form>
    </>
  );
};

export default LoginPage;
