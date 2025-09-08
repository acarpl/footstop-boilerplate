"use client";

import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, App } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { requestPasswordReset } from "../../../../lib/services/authService";

const ForgotPasswordPageContent = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { message: messageApi } = App.useApp();

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      await requestPasswordReset(values.email);
      setSubmitted(true);
    } catch (error) {
      setSubmitted(true);
      console.error("Forgot password error:", error); // Log error
    } finally {
      setLoading(false);
    }
  };

  // pesan setelah form disubmit
  if (submitted) {
    return (
      <Card className="text-center">
        <MailOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
        <Typography.Title level={4} className="mt-4">
          Check Your Email
        </Typography.Title>
        <Typography.Paragraph>
          If an account with that email exists, we&apos;ve sent a link to reset
          your password. Please check your inbox and spam folder.
        </Typography.Paragraph>
      </Card>
    );
  }

  return (
    <Card style={{ width: 400 }}>
      <Typography.Title level={3} className="text-center mb-2">
        Forgot Your Password?
      </Typography.Title>
      <Typography.Text type="secondary" className="block text-center mb-6">
        No worries! Enter your email and we&apos;ll send you a reset link.
      </Typography.Text>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please enter a valid email!",
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="you@example.com" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Send Reset Link
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <App>
        <ForgotPasswordPageContent />
      </App>
    </div>
  );
}
