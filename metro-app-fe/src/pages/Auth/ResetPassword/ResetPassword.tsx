import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import path from "src/constants/path";
import { useTranslation } from "react-i18next";

const ResetPassword: React.FC = () => {
  const [isSuccessChange, setSuccessChange] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

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
            {t("resetPassword.success.message")}
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
            {t("resetPassword.success.backToLogin")}
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
                {t("resetPassword.newPassword.label")}
              </label>
            }
            rules={[
              {
                required: true,
                message: t("resetPassword.newPassword.required"),
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              size="large"
              placeholder={t("resetPassword.newPassword.placeholder")}
              className="rounded-lg h-12"
              disabled={isLoading}
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label={
              <label className="text-base font-medium text-cyan-800">
                {t("resetPassword.confirmPassword.label")}
              </label>
            }
            rules={[
              {
                required: true,
                message: t("resetPassword.confirmPassword.required"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t("resetPassword.confirmPassword.notMatch"))
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              size="large"
              placeholder={t("resetPassword.confirmPassword.placeholder")}
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
              {t("resetPassword.confirmButton")}
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};
export default ResetPassword;
