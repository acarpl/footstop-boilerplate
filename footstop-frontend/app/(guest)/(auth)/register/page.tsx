"use client";

import React, { useState } from "react";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const onFinish = async (values: {
    username: string;
    email: string;
    password: string;
    phone_number: string;
  }) => {
    setLoading(true);
    try {
      await register(values); // values sekarang termasuk phone_number
      message.success("Register berhasil! Mengarahkan ke dashboard...");
      setTimeout(() => router.push("/home"), 1000);
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Register gagal.");
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
      <Card className="shadow-xl rounded-2xl" style={{ width: 350, textAlign: "center" }}>
        <Typography.Title level={3} style={{ color: "#E53935" }}>FOOTSTOP</Typography.Title>
        <Typography.Text strong>Daftar akun baru</Typography.Text>

        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 20 }}>
          {/* Username */}
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Masukkan username!" }]}
          >
            <Input placeholder="Username kamu" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Masukkan email valid!" }]}
          >
            <Input placeholder="contoh: kamu@example.com" />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Masukkan password!" }]}
          >
            <Input.Password placeholder="Password kamu" />
          </Form.Item>

          {/* Phone Number */}
          <Form.Item
            label="Nomor Telepon"
            name="phone_number"
            rules={[{ required: true, message: "Masukkan nomor telepon!" }]}
          >
            <Input placeholder="0812xxxxxxx" />
          </Form.Item>

          {/* Tombol Register */}
          <Form.Item>
            <Button
              type="primary"
              block
              htmlType="submit"
              loading={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
