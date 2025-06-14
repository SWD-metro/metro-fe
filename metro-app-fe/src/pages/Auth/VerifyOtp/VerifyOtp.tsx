import { MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import path from "src/constants/path";
import { AppContext } from "src/contexts/app.context";
import { useRegisterMutation, useVerifyOtpMutation } from "src/queries/useAuth";
import { VerifyOtpRequest } from "src/types/auth.type";

const VerifyOtpPage: React.FC = () => {
  const { registerData } = useContext(AppContext);
  const verifyOtpMutation = useVerifyOtpMutation();
  const registerMutation = useRegisterMutation();
  const navigate = useNavigate();

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

      await registerMutation.mutateAsync(registerData);

      console.log("Registration successful!");
      navigate(path.login);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Form
        name="VerifyOTP"
        initialValues={{}}
        onFinish={onFinish}
        layout="vertical"
        requiredMark="optional"
      >
        <Typography className="text-center mb-4 text-base font-medium">
          Enter 6 digit code we just sent to your email
          <span className="text-blue-500">{registerData?.email}</span>
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
        <div>
          <label className="text-sm font-medium">
            * This code is valid for 5 minutes
          </label>
          {/* {!isLoading && (
            <span>
              {!disableResendOTP ? (
                <a href="#" onClick={sendOtpCode} className="text-blue-600 hover:underline ml-2">
                  Resend new code
                </a>
              ) : (
                <p className="text-gray-500 text-sm">{`Please wait for 30s`}</p>
              )}
            </span>
          )} */}
        </div>
        <Form.Item>
          <Button block shape="round" type="primary" htmlType="submit">
            VERIFY
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default VerifyOtpPage;
