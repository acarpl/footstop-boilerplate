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
          Welcome To FootStop!
        </Typography.Title>
        <Typography.Text type="secondary">
          Create your account and enjoy all the features and discounts.
        </Typography.Text>

        {/* Form */}
        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 20 }}>
          {/* Name */}
          <Form.Item
            label="Name"
            name="username"
            rules={[{ required: true, message: "Masukkan nama!" }]}
          >
            <Input placeholder="e.g Farhan Kebab" size="large" />
          </Form.Item>

          {/* Phone Number */}
          <Form.Item
            label="Phone Number"
            name="phone_number"
            rules={[{ required: true, message: "Masukkan nomor telepon!" }]}
          >
            <Input placeholder="e.g +62 123 4567 8910" size="large" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              { required: true, type: "email", message: "Masukkan email valid!" },
            ]}
          >
            <Input placeholder="e.g farhankepap@example.com" size="large" />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Masukkan password!" }]}
          >
            <Input.Password placeholder="Type your Password Here!" size="large" />
          </Form.Item>

          {/* Tombol Register */}
          <Form.Item>
            <Button
              type="primary"
              block
              htmlType="submit"
              loading={loading}
              size="large"
              className="bg-red-600 hover:bg-red-700 rounded-md"
            >
              Create Account!
            </Button>
          </Form.Item>

          {/* Login link */}
          <Typography.Text>
            Already have account?{" "}
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
