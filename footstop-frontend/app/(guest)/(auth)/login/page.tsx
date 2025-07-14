// app/(guest)/(auth)/login/page.tsx

'use client';

import React, { useState } from 'react';
import { Button, Card, Checkbox, Form, Input, Typography, message } from 'antd';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useAuth } from '../../../../context/AuthContext'; // Sesuaikan path jika perlu

const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Gunakan router Next.js untuk navigasi
  const { login } = useAuth(); // Ambil fungsi login dari AuthContext

  // Fungsi yang dijalankan saat form berhasil disubmit
  const onFinish = async (values: { email: string; password: string; }) => {
    setLoading(true);
    try {
      // Panggil fungsi login terpusat dari context.
      // Fungsi ini akan menangani panggilan API dan pembaruan state global.
      await login(values.email, values.password);

      // Jika promise di atas berhasil (tidak melempar error), maka login sukses.
      message.success('Login successful! Redirecting...');

      // Redirect ke halaman utama setelah jeda singkat
      setTimeout(() => {
        // Menggunakan router.push lebih disarankan daripada window.location.href
        // untuk navigasi di dalam aplikasi Next.js
        router.push('/home'); 
      }, 1000);

    } catch (err) {
      // Tangani error jika promise dari fungsi login di-reject
      let errorMessage = 'An unexpected error occurred.';
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || 'Login failed. Please check credentials.';
      }
      message.error(errorMessage);
      setLoading(false); // Pastikan loading dihentikan jika gagal
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: '#963535',
        backgroundImage: 'url(/backgrounds/footstop-pattern.svg)',
        backgroundSize: 'contain',
      }}
    >
      <Card
        className="shadow-xl rounded-2xl"
        style={{ width: 350, textAlign: 'center' }}
      >
        <Typography.Title level={3} style={{ color: '#E53935' }}>
          FOOTSTOP
        </Typography.Title>
        <Typography.Text strong>Welcome Back!</Typography.Text>
        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              { required: true, type: 'email', message: 'Please enter a valid email address!' },
            ]}
          >
            <Input placeholder="e.g., you@example.com" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password placeholder="Type your password here" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
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
            Don't have an account?{' '}
            <a href="/register" className="text-red-600">
              Register here!
            </a>
          </Typography.Text>
        </Form>
      </Card>
    </div>
  );
};

export default Login;