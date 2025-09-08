"use client";

import React, { useState } from "react";
import { Button, Card, Checkbox, Form, Input, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";

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
      message.error(
        err?.response?.data?.message || "Login gagal. Periksa email & password."
      );
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
        <Typography.Title level={3} style={{ color: "#E53935" }}>
          FOOTSTOP
        </Typography.Title>
        <Typography.Text strong>Welcome Back!</Typography.Text>

        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 20 }}>
          <Form.Item
            label="email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Masukkan email valid!",
              },
            ]}
          >
            <Input placeholder="contoh: kamu@example.com" />
          </Form.Item>

          <Form.Item
            label="password"
            name="password"
            rules={[{ required: true, message: "Masukkan password!" }]}
          >
            <Input.Password placeholder="Ketik password kamu di sini" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <a className="text-red-600 text-sm" href="/forgot-password">
              Forgot password?
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              block
              htmlType="submit"
              loading={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              Log In
            </Button>
          </Form.Item>

          <Typography.Text>
            Belum punya akun?{" "}
            <a href="/register" className="text-red-600">
              Daftar di sini!
            </a>
          </Typography.Text>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
