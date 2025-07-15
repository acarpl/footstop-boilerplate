// app/(authenticated)/profile/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext'; // Sesuaikan path
import { Form, Input, Button, Card, Typography, message, Spin, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import apiClient from '../../../lib/apiClient';
import { AxiosError } from 'axios';

const ProfilePage: React.FC = () => {
  // Ambil data user dan status loading dari AuthContext
  const { user, loading: authLoading } = useAuth(); 
  
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect ini sudah benar. Ia akan mengisi form saat data 'user' pertama kali tersedia.
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
      });
    }
  }, [user, form]);

  // Fungsi untuk menangani submit form (UPDATE data)
  const onFinish = async (values: { username: string; phone_number: string }) => {
    setIsSubmitting(true);
    try {
      // Panggil endpoint PATCH di backend untuk update
      await apiClient.patch('/users/me', values);
      
      message.success('Profile updated successfully! Refreshing data...');

      // SOLUSI: Lakukan refresh halaman penuh untuk mengambil data terbaru.
      // Ini adalah cara paling sederhana tanpa perlu refetchUser.
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Beri jeda agar user bisa membaca pesan sukses

    } catch (error) {
      // Penanganan error yang lebih baik
      let errorMessage = 'Failed to update profile.';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      message.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tampilan loading selagi AuthContext bekerja
  if (authLoading) {
    return <div className="text-center p-20"><Spin size="large" /></div>;
  }

  // Pengaman jika user tidak ada
  if (!user) {
    return <Typography.Text>Please log in to view this page.</Typography.Text>;
  }

  // Tampilan utama halaman profil
  return (
    <div className="w-full max-w-screen-md mx-auto px-4 py-8">
      <Typography.Title level={2}>My Profile</Typography.Title>
      <Typography.Paragraph>
        Manage your personal information and account settings.
      </Typography.Paragraph>

      <Card>
        <div className="text-center mb-8">
            {/* Menggunakan ikon default karena kita tidak punya profileImageUrl */}
            <Avatar size={96} icon={<UserOutlined />} />
            <Typography.Title level={4} className="mt-4 mb-0">{user.username}</Typography.Title>
            <Typography.Text type="secondary">{user.email}</Typography.Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
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
          >
            <Input disabled /> {/* Email tidak bisa diubah */}
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone_number"
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;