import React, { useContext } from "react";
import { Form, Input, Button, Typography, Checkbox, Row, Col } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import path from "src/constants/path";
import { useTranslation } from "react-i18next";
import { RegisterRequest } from "src/types/user.type";
import { AppContext } from "src/contexts/app.context";
import {
  useCheckEmail,
  useCheckUserName,
  useSendOtpMutation,
} from "src/queries/useAuth";

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation("auth");
  const agreementChecked = Form.useWatch("agreement", form);
  const { setRegisterData } = useContext(AppContext);
  const navigate = useNavigate();
  const sendOtpMutation = useSendOtpMutation();

  const checkEmail = useCheckEmail(form.getFieldValue("email"), true);
  const checkUserName = useCheckUserName(form.getFieldValue("username"), true);

  const onFinish = async (body: RegisterRequest) => {
    if (sendOtpMutation.isPending) return;

    try {
      const [emailResult, usernameResult] = await Promise.all([
        checkEmail.refetch(),
        checkUserName.refetch(),
      ]);

      if (emailResult.data?.data.data) {
        form.setFields([{ name: "email", errors: ["Email đã được sử dụng"] }]);
        return;
      }

      if (usernameResult.data?.data.data) {
        form.setFields([
          { name: "username", errors: ["Tên đăng nhập đã được sử dụng"] },
        ]);
        return;
      }
      const otpRequest = {
        email: body.email,
        purpose: "REGISTER",
      };

      await sendOtpMutation.mutateAsync(otpRequest);

      setRegisterData(body);
      navigate(path.verifyOtp);
    } catch (error) {
      console.log(error);
    }
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
              label={
                <label className="text-base font-medium text-cyan-800">
                  {t("login.username.label")}
                </label>
              }
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
              label={
                <label className="text-base font-medium text-cyan-800">
                  Email
                </label>
              }
              name="email"
              rules={[
                { type: "email", message: t("register.email.invalid") },
                { required: true },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder={t("register.email.placeholder")}
                className="rounded-lg h-12"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label={
                <label className="text-base font-medium text-cyan-800">
                  {t("login.password.label")}
                </label>
              }
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
              label={
                <label className="text-base font-medium text-cyan-800">
                  {t("register.confirmPassword.placeholder")}
                </label>
              }
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
                disabled={!agreementChecked}
                style={{ width: "70%", margin: "0 auto", display: "block" }}
              >
                {sendOtpMutation.isPending
                  ? "Đang xử lý..."
                  : t("register.registerButton")}
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <div className="text-center">
          <Text className="text-gray-600">
            {t("register.hasAccount")}
            <RouterLink
              to={path.login}
              className="text-blue-600 hover:text-blue-800 font-medium no-underline ms-3"
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
