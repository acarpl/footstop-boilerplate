'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext'; // Sesuaikan path
import { Form, Input, Button, Card, Typography, message, Spin } from 'antd';
import apiClient from '../../../lib/apiClient'; // Import apiClient

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Set nilai awal form ketika data user tersedia dari context
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        // Asumsi ada properti phone_number di objek user
        phone_number: user.phone_number, 
      });
    }
  }, [user, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Panggil endpoint PATCH yang baru kita buat
      await apiClient.patch('/users/me', values);
      message.success('Profile updated successfully!');
      // Mungkin Anda perlu memperbarui state user di AuthContext di sini
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Tampilkan loading spinner jika context masih memuat data user
  if (authLoading) {
    return <div className="text-center p-10"><Spin size="large" /></div>;
  }

  // Jika tidak ada user setelah loading, arahkan untuk login
  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="w-full max-w-screen-md mx-auto px-4 py-8">
      <Typography.Title level={2}>My Profile</Typography.Title>
      <Typography.Paragraph>
        Update your personal information here.
      </Typography.Paragraph>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            username: user.username,
            email: user.email,
            phone_number: user.phone_number,
          }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
          >
            <Input disabled /> {/* Email biasanya tidak boleh diubah */}
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone_number" // Pastikan nama ini cocok dengan DTO dan entity
          >
            <Input />
          </Form.Item>
          
          {/* Anda bisa menambahkan form untuk mengubah password di sini */}
          {/* Ini memerlukan endpoint terpisah yang lebih aman */}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}