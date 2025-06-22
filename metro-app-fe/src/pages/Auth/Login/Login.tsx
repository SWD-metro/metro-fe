import React, { useContext } from "react";
import { Form, Input, Button, Typography, Divider, Checkbox } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import path from "src/constants/path";
import { useTranslation } from "react-i18next";
import { useLoginMutation } from "src/queries/useAuth";
import { LocalLoginRequest } from "src/types/auth.type";
import { AppContext } from "src/contexts/app.context";
import toast from "react-hot-toast";

const { Title, Text } = Typography;
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const loginMutation = useLoginMutation();

  const handleGoogleLogin = () => {
    const googleLoginUrl = import.meta.env.VITE_GOOGLE_AUTHORIZED_URL;

    if (googleLoginUrl) {
      window.location.href = googleLoginUrl;
    } else {
      toast.error("Cannot find url gg login :))");
    }
  };

  const onFinish = async (data: LocalLoginRequest) => {
    if (loginMutation.isPending) return;
    try {
      const result = await loginMutation.mutateAsync(data);
      if (result?.data?.data) {
        toast.success("Đăng nhập thành công!", {
          duration: 3000,
          style: {
            borderRadius: "8px",
            background: "#4BB543",
            color: "#fff",
            fontWeight: "500",
          },
        });
        setIsAuthenticated(true);
        setProfile(result.data.data);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Đăng nhập thất bại!");
    }
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
          name="usernameOrEmail"
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
            style={{ width: "70%", margin: "0 auto", display: "block" }}
          >
            {t("login.loginButton")}
          </Button>
        </Form.Item>
      </Form>

      <Divider className="text-gray-400 !my-2">{t("login.divider")}</Divider>

      <Button
        icon={<GoogleOutlined className="me-2" />}
        shape="round"
        style={{ width: "70%", margin: "0 auto", display: "block" }}
        onClick={handleGoogleLogin}
      >
        {t("login.googleLogin")}
      </Button>

      <div className="text-center space-y-2 pt-5">
        <div>
          <Text className="text-gray-600">
            {t("login.noAccount")}
            <RouterLink
              to={path.register}
              className="text-blue-600 ms-3 hover:text-blue-800 font-medium no-underline"
            >
              {t("login.registerNow")}
            </RouterLink>
          </Text>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
