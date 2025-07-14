'use client';

import React, { useState } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Typography,
  message,
} from 'antd';
import { useRouter } from 'next/navigation';
import apiClient from '../../../../lib/apiClient';
import { AxiosError } from 'axios';
import { useAuth } from '../../../../context/AuthContext';
import { TokenUtil } from '#/utils/token';

const Login = () => {
  const [loading, setLoading] = useState(false); // Untuk tombol "Log In"
  const router = useRouter(); // Router dari Next.js (app directory)
  const { login } = useAuth(); // Ambil fungsi login dari context

  // Fungsi yang dijalankan saat form berhasil disubmit
  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true); // Mulai loading saat login diproses

    try {
      // Kirim permintaan login ke backend
      const response = await apiClient.post('/auth/login', {
        email: values.email,
        password: values.password,
      });

      // Jika sukses, tampilkan notifikasi
      message.success('Login berhasil! Mengarahkan ke dashboard...');
      TokenUtil.setAccessToken(response.data.accessToken);
      TokenUtil.persistToken();

      // Redirect ke halaman dashboard setelah 1 detik
      setTimeout(() => {
        window.location.href = '/home';
      }, 1000);
    } catch (err) {
      // Tangani error dari Axios jika login gagal
      let errorMessage = 'Terjadi kesalahan saat login.';

      if (err instanceof AxiosError) {
        // Ambil pesan error dari response backend jika ada
        errorMessage =
          err.response?.data?.message ||
          'Login gagal. Periksa kembali email dan password Anda.';
      }

      message.error(errorMessage);
      setLoading(false); // Hentikan loading jika gagal
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
        {/* Judul Brand */}
        <Typography.Title level={3} style={{ color: '#E53935' }}>
          FOOTSTOP
        </Typography.Title>

        {/* Subjudul */}
        <Typography.Text strong>Welcome Back!</Typography.Text>

        {/* Form Login */}
        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 20 }}
        >
          {/* Input Email */}
          <Form.Item
            label="email"
            name="email"
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Masukkan alamat email yang valid!',
              },
            ]}
          >
            <Input placeholder="contoh: kamu@example.com" />
          </Form.Item>

          {/* Input Password */}
          <Form.Item
            label="password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Masukkan password Anda!',
              },
            ]}
          >
            <Input.Password placeholder="Ketik password kamu di sini" />
          </Form.Item>

          {/* Checkbox Remember Me */}
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Ingat saya</Checkbox>
          </Form.Item>

          {/* Tombol Login */}
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

          {/* Link ke halaman register */}
          <Typography.Text>
            Belum punya akun?{' '}
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