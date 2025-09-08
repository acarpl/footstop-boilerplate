"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Spin,
  Avatar,
  Tabs,
  Divider,
} from "antd";
import { UserOutlined, EditOutlined, LogoutOutlined } from "@ant-design/icons";
import apiClient from "../../../lib/apiClient";
import { AxiosError } from "axios";

const { Title, Text, Paragraph } = Typography;

const ProfilePage: React.FC = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Sync user data ke form */
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
      });
    }
  }, [user, form]);

  /** Handle form submit */
  const onFinish = async (values: {
    username: string;
    phone_number: string;
  }) => {
    setIsSubmitting(true);
    try {
      await apiClient.patch("/users/me", values);
      message.success("Profile updated successfully!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || "Failed to update profile."
          : "Failed to update profile.";
      message.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Logout */
  const handleLogout = () => {
    logout();
    message.success("Logged out successfully!");
  };

  /** Tabs content */
  const tabItems = useMemo(
    () => [
      {
        key: "edit",
        label: (
          <span>
            <EditOutlined /> Edit Information
          </span>
        ),
        children: (
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Phone Number" name="phone_number">
              <Input />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                block
              >
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        ),
      },
      {
        key: "logout",
        label: (
          <span>
            <LogoutOutlined /> Logout
          </span>
        ),
        children: (
          <div className="text-center p-6">
            <Paragraph>Are you sure you want to log out?</Paragraph>
            <Button danger type="primary" onClick={handleLogout}>
              Yes, Logout
            </Button>
          </div>
        ),
      },
      {
        key: "ForgotPassword",
        label: (
          <span>
            <LogoutOutlined /> Forgot Password
          </span>
        ),
        children: (
          <div className="text-center p-6">
            <Paragraph>Are you sure you want to reset your password?</Paragraph>
            <Button danger type="primary" href="/forgot-password">
              Yes, Reset Password
            </Button>
          </div>
        ),
      },
    ],
    [form, isSubmitting, handleLogout]
  );

  /** Loading state */
  if (authLoading) {
    return (
      <div className="text-center p-20">
        <Spin size="large" />
      </div>
    );
  }

  /** Not logged in */
  if (!user) {
    return <Text>Please log in to view this page.</Text>;
  }

  return (
    <div className="w-full max-w-screen-md mx-auto px-4 py-8 mt-20">
      <Card>
        <div className="text-center mb-6">
          <Avatar size={96} icon={<UserOutlined />} />
          <Title level={4} className="mt-4 mb-0">
            {user.username}
          </Title>
          <Text type="secondary">{user.email}</Text>
          <Divider />
        </div>

        <Tabs defaultActiveKey="edit" items={tabItems} />
      </Card>
    </div>
  );
};

export default ProfilePage;
