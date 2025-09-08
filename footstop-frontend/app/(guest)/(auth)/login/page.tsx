"use client";

import React, { useState } from "react";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import Image from "next/image";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success("Login berhasil! Mengarahkan ke dashboard...");
      setTimeout(() => router.push("/home"), 1000);
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Login gagal. Periksa email & password.");
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
        backgroundSize: "200px",
      }}
    >
      <Card
        className="shadow-xl rounded-3xl p-6"
        style={{ width: 380, textAlign: "center" }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-4">
          <Image
            src="/logo-shoes.svg"
            alt="Footstop Logo"
            width={40}
            height={40}
          />
          <Typography.Title
            level={2}
            style={{
              margin: 0,
              color: "#E53935",
              fontWeight: "bold",
              letterSpacing: 1,
            }}
          >
            FOOTSTOP
          </Typography.Title>
        </div>

        {/* Title & subtitle */}
        <Typography.Title
          level={4}
          style={{ marginBottom: 0, fontWeight: "bold", color: "#000" }}
        >
          Welcome Back!
        </Typography.Title>
        <Typography.Text type="secondary">
          Log in to your account.
        </Typography.Text>

        {/* Form */}
        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 20 }}>
          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              { required: true, type: "email", message: "Masukkan email valid!" },
            ]}
          >
            <Input placeholder="e.g farhankepap@example.com" size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Masukkan password!" }]}
          >
            <Input.Password placeholder="Type your Password Here!" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              block
              htmlType="submit"
              loading={loading}
              size="large"
              className="bg-red-600 hover:bg-red-700 rounded-md"
            >
              Log in
            </Button>
          </Form.Item>

          {/* Register & Forgot password */}
          <div className="flex flex-col items-center space-y-1 text-sm">
            <Typography.Text>
              Don’t have any account?{" "}
              <a href="/register" className="font-semibold text-red-600">
                Register Here!
              </a>
            </Typography.Text>
            <a href="/forgot-password" className="font-semibold text-black">
              Forgot Password?
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
