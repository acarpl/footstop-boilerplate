"use client";

import React, { useState } from "react";
import { Button, Card, Checkbox, Form, Input, Typography, message } from "antd";
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
        className="shadow-xl rounded-3xl"
        style={{ width: 400, textAlign: "center", padding: "10px 18px" }}
      >
        <div className="flex flex-col items-center mb-4">
          <Image
            src="/icons/logo-shoe.svg"
            alt="Footstop Logo"
            width={40}
            height={40}
          />
          <Image
            src="/icons/FOOTSTOP.svg"
            alt="Footstop Logo"
            width={200}
            height={200}
          />
        </div>

        <Typography.Title
          level={3}
          style={{ marginBottom: 1, fontWeight: "bold", color: "#000" }}
        >
          Welcome Back!
        </Typography.Title>
        <Typography.Text type="secondary">
          Log in to your account.
        </Typography.Text>

        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 16 }}>
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
            style={{ marginBottom: 12 }}
          >
            <Input placeholder="contoh: kamu@example.com" />
          </Form.Item>

          <Form.Item
            label="password"
            name="password"
            rules={[{ required: true, message: "Masukkan password!" }]}
            style={{ marginBottom: 12 }}
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

          <Form.Item style={{ marginBottom: 0, textAlign: "center" }}>
            <Typography.Text style={{ fontSize: 13 }}>
              Belum punya akun?{" "}
              <a href="/register" className="text-red-600 font-semibold">
                Daftar di sini!
              </a>
            </Typography.Text>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
