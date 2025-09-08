"use client";

import React, { useState } from "react";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import Image from "next/image";

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
      await register(values);
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
      <Card
        className="shadow-xl rounded-3xl"
        style={{ width: 450, textAlign: "center", padding: "16px 38px"}}
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

        {/* Title & subtitle */}
        <div style={{ textAlign: "left", marginBottom: 16 }}>
        <Typography.Title
          level={4}
          style={{ marginBottom: 4, fontWeight: "bold", color: "#000" }}
        >
          Selamat Datang di FootStop!
        </Typography.Title>
        <Typography.Text type="secondary">
          Buat akunmu dan nikmati fitur dan juga dikon!
        </Typography.Text>
        </div>
        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 16 }}
        >
          {/* Username */}
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Masukkan username!" }]}
            style={{ marginBottom: 12 }}
          >
            <Input placeholder="Username kamu" />
          </Form.Item>

          {/* Phone Number */}
          <Form.Item
            label="Nomor Telepon"
            name="phone_number"
            rules={[{ required: true, message: "Masukkan nomor telepon!" }]}
            style={{ marginBottom: 12 }}
          >
            <Input placeholder="0812xxxxxxx" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, type: "email", message: "Masukkan email valid!" },
            ]}
            style={{ marginBottom: 12 }}
          >
            <Input placeholder="contoh: kamu@example.com" />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Masukkan password!" }]}
            style={{ marginBottom: 20 }}
          >
            <Input.Password placeholder="Password kamu" />
          </Form.Item>

          {/* Tombol Register */}
          <Form.Item style={{ marginBottom: 8 }}>
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

          {/* Login link */}
          <Typography.Text style={{ fontSize: 13 }}>
            Sudah punya akun?{" "}
            <a href="/login" className="font-semibold text-black">
              Login Here!
            </a>
          </Typography.Text>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
