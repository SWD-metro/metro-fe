import { MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import path from "src/constants/path";
import { AppContext } from "src/contexts/app.context";
import {
  useRegisterMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "src/queries/useAuth";
import { VerifyOtpRequest } from "src/types/auth.type";

const VerifyOtpPage: React.FC = () => {
  const { registerData } = useContext(AppContext);
  const verifyOtpMutation = useVerifyOtpMutation();
  const registerMutation = useRegisterMutation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(60);
  const sendOtpMutation = useSendOtpMutation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onFinish = async (values: { otp: string }) => {
    if (!registerData) {
      toast.error("Không có dữ liệu đăng ký");
      return;
    }
    if (verifyOtpMutation.isPending || registerMutation.isPending) return;
    try {
      const verifyBody: VerifyOtpRequest = {
        email: registerData.email,
        otp: values.otp,
        purpose: "REGISTER",
      };
      const verifyResponse = await verifyOtpMutation.mutateAsync(verifyBody);
      const { status, message: verifyMessage } = verifyResponse?.data || {};

      if (status !== 200 || verifyMessage !== "Token verified") {
        toast.error("OTP failed");
        return;
      }

      const registerResponse = await registerMutation.mutateAsync(registerData);

      if (registerResponse?.data.data) {
        toast.success("Đăng ký thành công!!!", {
          duration: 3000,
          style: {
            borderRadius: "8px",
            background: "#4BB543",
            color: "#fff",
            fontWeight: "500",
          },
        });
        navigate(path.login);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendOtpCode = async () => {
    if (countdown > 0 || !registerData) return;

    try {
      await sendOtpMutation.mutateAsync({
        email: registerData.email,
        purpose: "REGISTER",
      });

      setCountdown(60);
      form.resetFields(["otp"]);
      toast.success("Mã OTP đã được gửi đến email!!!", {
        duration: 3000,
        style: {
          borderRadius: "8px",
          background: "#4BB543",
          color: "#fff",
          fontWeight: "500",
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const isLoading = sendOtpMutation.isPending;
  const disableResendOTP = countdown > 0;
  return (
    <>
      <Form
        form={form}
        name="VerifyOTP"
        initialValues={{}}
        onFinish={onFinish}
        layout="vertical"
        requiredMark="optional"
      >
        <Typography className="text-center mb-2 text-base font-medium">
          Nhập mã 6 chữ số mà chúng tôi vừa gửi tới email của bạn:
        </Typography>
        <div className="w-48 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full mb-3"></div>
        <Typography className="text-center mb-2 text-base font-medium !text-blue-500">
          {registerData?.email}{" "}
        </Typography>
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: "Please input your verify code" },
            { min: 6, message: "Verify code is 6 digit number" },
            {
              pattern: /^\d+$/,
              message: "Verify code must contain only numbers",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            maxLength={6}
            size="large"
            placeholder="Verify code"
            className="!rounded-xl !h-12 !border-gray-200 hover:!border-cyan-400 focus:!border-cyan-500 !transition-colors !duration-200 !shadow-sm"
          />
        </Form.Item>
        <div className="flex justify-between my-3">
          <label className="text-lg font-medium">
            * This code is valid for 5 minutes
          </label>
          {!isLoading && (
            <span>
              {!disableResendOTP ? (
                <a
                  href="#"
                  onClick={sendOtpCode}
                  className="text-blue-600 font-medium ml-2 text-lg"
                >
                  Resend new code
                </a>
              ) : (
                <p className="text-blue-600 text-lg">{`Please wait for ${countdown}`}</p>
              )}
            </span>
          )}
        </div>
        <Form.Item>
          <Button
            block
            shape="round"
            type="primary"
            htmlType="submit"
            loading={verifyOtpMutation.isPending}
            className="w-full !h-12 !bg-gradient-to-r !from-cyan-500 !to-blue-600 hover:!from-cyan-600 hover:!to-blue-700 !border-none !rounded-xl !font-semibold !text-white !shadow-lg hover:!shadow-xl !transform hover:!-translate-y-0.5 !transition-all !duration-200"
          >
            VERIFY
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default VerifyOtpPage;
