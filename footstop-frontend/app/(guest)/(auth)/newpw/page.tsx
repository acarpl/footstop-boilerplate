"use client";

import React, { useState } from "react";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";

const NewPassword = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { resetPassword } = useAuth(); // fungsi reset password di context

  const onFinish = async (values: { password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(values.password); // kirim ke backend untuk update password
      message.success("Password successfully updated!");
      setTimeout(() => router.push("/login"), 1000);
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Failed to reset password.");
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
          New Password
        </Typography.Title>

        {/* Form */}
        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 20 }}>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your new password!" }]}
          >
            <Input.Password placeholder="Password123" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[{ required: true, message: "Please confirm your password!" }]}
          >
            <Input.Password placeholder="Password123" />
          </Form.Item>

          <Form.Item style={{ marginTop: 20 }}>
            <Button
              type="primary"
              block
              htmlType="submit"
              loading={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              Log in
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

export default NewPassword;
