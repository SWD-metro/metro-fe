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
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation("auth");

  const onFinish = async () => {
    setLoading(true);
  };

  return (
    <>
      <div className="text-center mb-6">
        <Title level={3} className="!text-cyan-800 mb-2">
          {t("register.title")}
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
                { required: true, message: t("register.username.required") },
                { min: 3, message: t("register.username.minLength") },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder={t("register.username.placeholder")}
                className="rounded-lg h-12"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="full_name"
              rules={[
                { required: true, message: t("register.fullName.required") },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder={t("register.fullName.placeholder")}
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
                { type: "email", message: t("register.email.invalid") },
                { required: false },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder={t("register.email.placeholder")}
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
                  message: t("register.phone.invalid"),
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder={t("register.phone.placeholder")}
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
                { pattern: /^[0-9]{12}$/, message: t("register.cccd.invalid") },
              ]}
            >
              <Input
                prefix={<IdcardOutlined className="text-gray-400" />}
                placeholder={t("register.cccd.placeholder")}
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
                { required: true, message: t("register.password.required") },
                { min: 6, message: t("register.password.minLength") },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder={t("register.password.placeholder")}
                className="rounded-lg h-12"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: t("register.confirmPassword.required"),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      t("register.confirmPassword.notMatch")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder={t("register.confirmPassword.placeholder")}
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
                  message: t("register.agreement.required"),
                },
              ]}
            >
              <Checkbox>{t("register.agreement.text")}</Checkbox>
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
                {t("register.registerButton")}
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <div className="text-center">
          <Text className="text-gray-600">
            {t("register.hasAccount")}
            <RouterLink
              to={path.login}
              className="text-blue-600 hover:text-blue-800 font-medium no-underline"
            >
              {t("register.loginNow")}
            </RouterLink>
          </Text>
        </div>
      </Form>
    </>
  );
};

export default RegisterPage;
