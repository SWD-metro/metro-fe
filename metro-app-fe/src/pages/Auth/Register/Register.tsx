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
import toast from "react-hot-toast";

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation("auth");
  const agreementChecked = Form.useWatch("agreement", form);
  const { setRegisterData } = useContext(AppContext);
  const navigate = useNavigate();
  const sendOtpMutation = useSendOtpMutation();

  const email = Form.useWatch("email", form);
  const username = Form.useWatch("username", form);

  const emailCheck = useCheckEmail(email, !!email);
  const usernameCheck = useCheckUserName(username, !!username);

  const onFinish = async (body: RegisterRequest) => {
    if (sendOtpMutation.isPending) return;
    try {
      const [emailResult, usernameResult] = await Promise.all([
        emailCheck.refetch(),
        usernameCheck.refetch(),
      ]);

      const errors = [];
      if (emailResult.data?.data?.data) {
        errors.push({ name: "email", errors: ["Email đã được sử dụng"] });
      }
      if (usernameResult.data?.data?.data) {
        errors.push({
          name: "username",
          errors: ["Tên đăng nhập đã được sử dụng"],
        });
      }
      if (errors.length > 0) {
        form.setFields(errors);
        toast.error("Vui lòng kiểm tra lại thông tin đăng ký");
        return;
      }

      const otpRequest = {
        email: body.email,
        purpose: "REGISTER",
      };

      const otpResponse = await sendOtpMutation.mutateAsync(otpRequest);

      if (otpResponse?.data.status === 200) {
        toast.success("Mã OTP đã được gửi đến email", {
          duration: 3000,
          style: {
            borderRadius: "8px",
            background: "#4BB543",
            color: "#fff",
            fontWeight: "500",
          },
        });
        setRegisterData(body);
        navigate(path.verifyOtp, { state: { email: body.email } });
      } else {
        toast.error("Không thể gửi OTP. Vui lòng thử lại");
      }
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
        <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
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
                className="!rounded-xl !h-12 !border-gray-200 hover:!border-cyan-400 focus:!border-cyan-500 !transition-colors !duration-200 !shadow-sm"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={
                <label className="text-base font-medium text-cyan-800">
                  {t("register.name.placeholder")}
                </label>
              }
              name="name"
              rules={[{ required: true, message: t("register.name.required") }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder={t("register.name.placeholder")}
                className="!rounded-xl !h-12 !border-gray-200 hover:!border-cyan-400 focus:!border-cyan-500 !transition-colors !duration-200 !shadow-sm"
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
                className="!rounded-xl !h-12 !border-gray-200 hover:!border-cyan-400 focus:!border-cyan-500 !transition-colors !duration-200 !shadow-sm"
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
                className="!rounded-xl !h-12 !border-gray-200 hover:!border-cyan-400 focus:!border-cyan-500 !transition-colors !duration-200 !shadow-sm"
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
                className="!rounded-xl !h-12 !border-gray-200 hover:!border-cyan-400 focus:!border-cyan-500 !transition-colors !duration-200 !shadow-sm"
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
                disabled={!agreementChecked}
                className="w-full !h-12 !bg-gradient-to-r !from-cyan-500 !to-blue-600 hover:!from-cyan-600 hover:!to-blue-700 !border-none !rounded-xl !font-semibold !text-white !shadow-lg hover:!shadow-xl !transform hover:!-translate-y-0.5 !transition-all !duration-200"
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
