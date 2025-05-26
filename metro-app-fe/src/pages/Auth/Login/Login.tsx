import React, { useState } from "react";
import { Form, Input, Button, Typography, Divider, Checkbox } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { Link as RouterLink } from "react-router-dom";
import path from "src/constants/path";

const { Title, Text, Link } = Typography;
const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async () => {
    setLoading(true);
  };

  return (
    <>
      <div className="text-center mb-6">
        <Title level={3} className="text-gray-800 mb-2">
          Đăng nhập
        </Title>
      </div>

      <Form name="login" onFinish={onFinish} size="large" layout="vertical">
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Tên đăng nhập"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Mật khẩu"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-between items-center">
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            <Link className="text-blue-600 hover:text-blue-800">
              Quên mật khẩu?
            </Link>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className=" h-12 rounded-lg bg-gradient-to-r from-blue-600 to-green-500 border-0 hover:from-blue-700 hover:to-green-600 shadow-lg"
            style={{ width: "50%", margin: "0 auto", display: "block" }}
          >
            Đăng nhập
          </Button>
        </Form.Item>

        <Divider>
          <Text className="text-gray-400">hoặc</Text>
        </Divider>

        <Button
          icon={<GoogleOutlined />}
          className="w-full h-12 rounded-lg border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md flex items-center justify-center text-gray-700"
          style={{ width: "50%", margin: "0 auto", display: "block" }}
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
