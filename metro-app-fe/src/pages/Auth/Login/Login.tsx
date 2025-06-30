import React, { useContext } from "react";
import { Form, Input, Button, Typography, Checkbox } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookFilled,
} from "@ant-design/icons";
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
      toast.error("Cannot find url google login");
    }
  };
  const handleFacebookLogin = () => {
    const facebookLoginUrl = import.meta.env.VITE_FACEBOOK_AUTHORIZED_URL;

    if (facebookLoginUrl) {
      window.location.href = facebookLoginUrl;
    } else {
      toast.error("Cannot find url facebook login");
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
    <div className="w-full  border-gray-100">
      <div className="text-center mb-8">
        <Title
          level={3}
          className="!text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-2xl font-bold mb-2"
        >
          {t("login.title")}
        </Title>
        <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
      </div>

      <Form
        name="login"
        onFinish={onFinish}
        size="large"
        layout="vertical"
        className="space-y-6"
      >
        <Form.Item
          label={
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              {t("login.username.label")}
            </label>
          }
          name="usernameOrEmail"
          rules={[
            { required: true, message: t("login.username.usernameRequired") },
          ]}
          className="mb-0"
        >
          <Input
            prefix={<UserOutlined className="!text-gray-400 !mr-2" />}
            placeholder={t("login.username.placeholder")}
            className="!rounded-xl !h-12 !border-gray-200 hover:!border-cyan-400 focus:!border-cyan-500 !transition-colors !duration-200 !shadow-sm"
          />
        </Form.Item>

        <Form.Item
          label={
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              {t("login.password.label")}
            </label>
          }
          name="password"
          rules={[
            { required: true, message: t("login.password.passwordRequired") },
          ]}
          className="mb-0"
        >
          <Input.Password
            prefix={<LockOutlined className="!text-gray-400 !mr-2" />}
            placeholder={t("login.password.placeholder")}
            className="!rounded-xl !h-12 !border-gray-200 hover:!border-cyan-400 focus:!border-cyan-500 !transition-colors !duration-200 !shadow-sm"
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <div className="flex justify-between items-center pt-2">
            <Checkbox className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
              {t("login.rememberMe")}
            </Checkbox>
            <RouterLink
              to={path.forgotPassword}
              className="text-sm text-cyan-600 hover:text-cyan-700 font-medium transition-colors duration-200 no-underline"
            >
              {t("login.forgotPassword")}
            </RouterLink>
          </div>
        </Form.Item>

        <Form.Item className="mb-0 pt-4">
          <Button
            type="primary"
            htmlType="submit"
            className="w-full !h-12 !bg-gradient-to-r !from-cyan-500 !to-blue-600 hover:!from-cyan-600 hover:!to-blue-700 !border-none !rounded-xl !font-semibold !text-white !shadow-lg hover:!shadow-xl !transform hover:!-translate-y-0.5 !transition-all !duration-200"
          >
            {t("login.loginButton")}
          </Button>
        </Form.Item>
      </Form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">
            {t("login.divider")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Button
          icon={<GoogleOutlined className="!text-red-500" />}
          className="!h-12 !rounded-xl !border-gray-200 hover:!border-red-300 hover:!bg-red-50 !transition-all !duration-200 !font-medium !shadow-sm hover:!shadow-md"
          onClick={handleGoogleLogin}
        >
          <span className="!text-cyan-800">Google</span>
        </Button>
        <Button
          icon={<FacebookFilled className="!text-blue-600" />}
          className="!h-12 !rounded-xl !border-gray-200 hover:!border-blue-300 hover:!bg-blue-50 !transition-all !duration-200 !font-medium !shadow-sm hover:!shadow-md"
          onClick={handleFacebookLogin}
        >
          <span className="!text-cyan-800">Facebook</span>
        </Button>
      </div>

      <div className="text-center">
        <Text className="text-gray-600 text-sm">
          {t("login.noAccount")}
          <RouterLink
            to={path.register}
            className="ml-2 text-cyan-600 hover:text-cyan-700 font-semibold no-underline transition-colors duration-200"
          >
            {t("login.registerNow")}
          </RouterLink>
        </Text>
      </div>
    </div>
  );
};

export default LoginPage;
