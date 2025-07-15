'use client';
import { useRouter } from 'next/router';
import { useState } from 'react';
import apiClient from '../../../../lib/apiClient';
import { AxiosError } from 'axios';
import { message, Form, Input, Button } from 'antd';
import { useAuth } from '../../../../context/AuthContext';
import { TokenUtil } from '#/utils/token';
TokenUtil.loadToken();

const AccountPage = () => {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await apiClient.patch(
        `/users/${user?.id_user}`,
        {
          ...values,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      message.success('Profile berhasil diupdate');
      router.push('/profile');
    } catch (err) {
      console.error(err);
      message.error('Gagal mengupdate profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ ...user }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Nama"
        name="username"
        rules={[{ required: true, message: 'Harap isi nama Anda!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Harap isi email Anda!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="No. Handphone"
        name="phone_number"
        rules={[{ required: true, message: 'Harap isi no. HP Anda!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Simpan
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AccountPage;
