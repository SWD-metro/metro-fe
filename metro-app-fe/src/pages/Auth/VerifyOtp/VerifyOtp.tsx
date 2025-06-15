import { MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
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
      console.error("No data");
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
        console.error("OTP failed");
        return;
      }

      const registerResponse = await registerMutation.mutateAsync(registerData);

      if (registerResponse?.data.data) {
        console.log("Registration successful!");
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
            className="!rounded-md !py-2 !px-3"
          />
        </Form.Item>
        <div className="flex justify-between">
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
            className="!mt-3"
          >
            VERIFY
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default VerifyOtpPage;
