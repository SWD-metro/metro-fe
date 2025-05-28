import { Button, Form, Input, Typography } from "antd";
import React from "react";
import { MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import path from "src/constants/path";

interface FormState {
  isEmailSent: boolean;
  isLoading: boolean;
}

const ForgotPassword: React.FC = () => {
  const [formState, setFormState] = React.useState<FormState>({
    isLoading: false,
    isEmailSent: false,
  });

  const onFinish = async () => {
    setFormState({
      isEmailSent: true,
      isLoading: false,
    });
  };

  return (
    <>
      <Form
        initialValues={{}}
        onFinish={onFinish}
        layout="vertical"
        validateTrigger="onChange"
        requiredMark="optional"
        className="space-y-6"
      >
        {formState.isEmailSent ? (
          <>
            <Form.Item>
              <div className="text-lg font-bold text-gray-800 text-center mb-2">
                Please check your email for password reset instructions
              </div>
            </Form.Item>
            <Form.Item>
              <Button
                block
                shape="round"
                size="large"
                type="primary"
                htmlType="submit"
                loading={formState.isLoading}
              >
                <Link to={path.login} aria-label="Go to login">
                  BACK TO LOGIN
                </Link>
              </Button>
            </Form.Item>
          </>
        ) : (
          <>
            <Typography className="text-lg font-bold text-gray-800 text-center mb-2">
              Please input your registered email to reset your password
            </Typography>
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please input your email",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                disabled={formState.isLoading}
                size="large"
                placeholder="Email"
                aria-label="Email address"
                autoComplete="email"
                className="h-12"
              />
            </Form.Item>
            <Form.Item>
              <Button
                block
                shape="round"
                size="large"
                type="primary"
                htmlType="submit"
                loading={formState.isLoading}
                aria-label="Send request to resend password"
                className="rounded-full h-12"
              >
                RESET
              </Button>
            </Form.Item>
          </>
        )}
      </Form>
    </>
  );
};
export default ForgotPassword;
