"use client";

import React, { useState } from "react";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { forgotPassword } = useAuth(); // pastikan ada fungsi forgotPassword di context

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      await forgotPassword(values.email); 
      message.success("Recovery password has been sent to your email!");
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Failed to send recovery email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: "#963535",
        backgroundImage: "url(/backgrounds/footstop-pattern.svg)",
        backgroundSize: "contain",
      }}
    >
      <Card
        className="shadow-xl rounded-2xl"
        style={{ width: 350, textAlign: "center" }}
      >
        {/* Logo & Title */}
        <Typography.Title
          level={3}
          style={{ color: "#E53935", marginBottom: 0 }}
        >
          FOOTSTOP
        </Typography.Title>
        <Typography.Title level={5} style={{ marginTop: 0 }}>
          Forgot Password?
        </Typography.Title>

        {/* Form */}
        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 20 }}>
          <Form.Item
            label="E-mail"
            name="email"
            rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}
          >
            <Input placeholder="e.g farhankepap@example.com" />
          </Form.Item>

          <Typography.Text type="secondary">
            Send recovery password
          </Typography.Text>

          <Form.Item style={{ marginTop: 20 }}>
            <Button
              type="primary"
              block
              htmlType="submit"
              loading={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              Send
            </Button>
          </Form.Item>
        </Form>

        {/* Footer Links */}
        <Typography.Text>
          Go back to{" "}
          <a href="/login" className="text-black font-semibold">
            Login
          </a>{" "}
          or{" "}
          <a href="/register" className="text-black font-semibold">
            Register
          </a>
        </Typography.Text>
      </Card>
    </div>
  );
};

export default ForgotPassword;
