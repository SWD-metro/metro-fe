import React, { useState } from "react";
import { Form, Input, Button, Typography, Divider, Checkbox } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { Link as RouterLink } from "react-router-dom";
import path from "src/constants/path";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;
const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("auth");

  const onFinish = async () => {
    setLoading(true);
  };

  return (
    <>
      <div className="text-center mb-6">
        <Title level={3} className="!text-cyan-800 mb-2">
          {t("login.title")}
        </Title>
      </div>
      <Form name="login" onFinish={onFinish} size="large" layout="vertical">
        <Form.Item
          label={
            <label className="text-base font-medium text-cyan-800">
              {t("login.username.label")}
            </label>
          }
          name="username"
          rules={[
            { required: true, message: t("login.username.usernameRequired") },
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder={t("login.username.placeholder")}
            className="rounded-lg h-12"
          />
        </Form.Item>

        <Form.Item
          label={
            <label className="text-base font-medium text-cyan-800">
              {t("login.password.label")}
            </label>
          }
          name="password"
          rules={[
            { required: true, message: t("login.password.passwordRequired") },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder={t("login.password.placeholder")}
            className="rounded-lg h-12"
          />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-between items-center">
            <Checkbox>{t("login.rememberMe")}</Checkbox>
            <RouterLink
              to={path.forgotPassword}
              className="text-blue-600 hover:text-blue-800"
            >
              {t("login.forgotPassword")}
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
            {t("login.loginButton")}
          </Button>
        </Form.Item>

        <Divider className="text-gray-400 !my-2">{t("login.divider")}</Divider>

        <Button
          icon={<GoogleOutlined className="me-2" />}
          shape="round"
          style={{ width: "70%", margin: "0 auto", display: "block" }}
        >
          {t("login.googleLogin")}
        </Button>

        <div className="text-center space-y-2 pt-5">
          <div>
            <Text className="text-gray-600">
              {t("login.noAccount")}
              <RouterLink
                to={path.register}
                className="text-blue-600 hover:text-blue-800 font-medium no-underline"
              >
                {t("login.registerNow")}
              </RouterLink>
            </Text>
          </div>
        </div>
      </Form>
    </>
  );
};

export default LoginPage;
