"use client";

import React, { useState } from "react";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { AxiosError } from "axios";
import apiClient from "../../../../lib/apiClient";

const Register = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: {
    username: string;
    phone_number: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);

    try {
      // Pastikan field-nya konsisten seperti Login
      const response = await apiClient.post("/auth/register", {
        username: values.username,
        phone_number: values.phone_number,
        email: values.email,
        password: values.password,
      });

      message.success("Pendaftaran berhasil! Silakan login...");
      setTimeout(() => {
        window.location.href = "/login"; // Sama seperti Login
      }, 1500);
    } catch (err) {
      let errorMessage = "Terjadi kesalahan saat mendaftar.";
      if (err instanceof AxiosError) {
        errorMessage =
          err.response?.data?.message ||
          "Pendaftaran gagal. Silakan coba lagi.";
      }
      message.error(errorMessage);
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
        <Typography.Text strong>Welcome To FootStop!</Typography.Text>
        <Typography.Paragraph style={{ fontSize: 12 }}>
          Buat akunmu dan nikmati semua fitur dan diskon.
        </Typography.Paragraph>

        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 20 }}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Masukkan username Anda!" }]}
          >
            <Input placeholder="Contoh: FarhanKebab" />
          </Form.Item>

          <Form.Item
            label="Nomor HP"
            name="phone_number"
            rules={[{ required: true, message: "Masukkan nomor HP Anda!" }]}
          >
            <Input placeholder="Contoh: 0812345678910" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Masukkan alamat email yang valid!",
              },
            ]}
          >
            <Input placeholder="Contoh: kamu@example.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                min: 6,
                message: "Password minimal 6 karakter!",
              },
            ]}
          >
            <Input.Password placeholder="Ketik password kamu di sini" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              block
              htmlType="submit"
              loading={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              Create Account
            </Button>
          </Form.Item>

          <Typography.Text>
            Sudah punya akun?{" "}
            <a href="/login" className="text-red-600">
              Login di sini!
            </a>
          </Typography.Text>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
