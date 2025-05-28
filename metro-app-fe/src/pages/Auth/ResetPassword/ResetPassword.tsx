import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import path from "src/constants/path";

const ResetPassword: React.FC = () => {
  const [isSuccessChange, setSuccessChange] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const backToLogin = () => {
    navigate(path.login);
  };

  const onFinish = async () => {
    setSuccessChange(true);
    setLoading(false);
  };
  return (
    <>
      {isSuccessChange ? (
        <>
          <label className="block !text-lg italic text-center text-cyan-800 mb-6">
            Password changed successfully. You may close this window.
          </label>
          <Button
            block
            shape="round"
            type="primary"
            size="large"
            htmlType="submit"
            loading={isLoading}
            className="rounded-full"
            onClick={backToLogin}
          >
            Back to login
          </Button>
        </>
      ) : (
        <Form
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
          className="space-y-4"
        >
          <Form.Item
            name="newPassword"
            label={
              <label className="text-base font-medium text-cyan-800">
                New Password
              </label>
            }
            rules={[
              {
                required: true,
                message: "Please input your new password",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              size="large"
              placeholder="New password"
              className="rounded-lg h-12"
              disabled={isLoading}
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label={
              <label className="text-base font-medium text-cyan-800">
                Confirm Password
              </label>
            }
            rules={[
              {
                required: true,
                message: "Please input your confirm password",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              size="large"
              placeholder="Confirm password"
              className="rounded-lg h-12"
              disabled={isLoading}
            />
          </Form.Item>
          <Form.Item style={{ marginTop: "15px" }}>
            <Button
              block
              shape="round"
              size="large"
              type="primary"
              htmlType="submit"
              loading={isLoading}
            >
              Confirm
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};
export default ResetPassword;
