"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Form, Input, Button, Card, Typography, App, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { resetPassword } from "../../../../lib/services/authService";

const ResetPasswordPageContent = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { message: messageApi } = App.useApp();
  const [token, setToken] = useState<string | null>(null);

  // Ambil token dari parameter URL saat komponen dimuat
  useEffect(() => {
    const resetToken = searchParams?.get("token");
    if (resetToken) {
      setToken(resetToken);
    } else {
      // Jika tidak ada token, jangan tampilkan form
      messageApi.error(
        "Invalid or missing reset token. Please request a new one."
      );
    }
  }, [searchParams, messageApi]);

  const onFinish = async (values: { password: string }) => {
    if (!token) return; // Pengaman tambahan
    setLoading(true);
    try {
      await resetPassword(token, values.password);
      messageApi.success(
        "Password has been reset successfully! Redirecting to login..."
      );
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to reset password.";
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Jika tidak ada token di URL, jangan render form-nya
  if (!token) {
    return (
      <Card className="text-center">
        <Typography.Title level={4} type="danger">
          Invalid Link
        </Typography.Title>
        <Typography.Paragraph>
          The password reset link is invalid or missing.
        </Typography.Paragraph>
        <Button type="primary" onClick={() => router.push("/forgot-password")}>
          Request a New Link
        </Button>
      </Card>
    );
  }

  return (
    <Card style={{ width: 400 }}>
      <Typography.Title level={3} className="text-center mb-6">
        Set a New Password
      </Typography.Title>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          name="password"
          label="New Password"
          rules={[
            {
              required: true,
              min: 6,
              message: "Password must be at least 6 characters!",
            },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter your new password"
          />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm New Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your new password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm your new password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <App>
        <ResetPasswordPageContent />
      </App>
    </div>
  );
}
