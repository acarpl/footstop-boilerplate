'use client';

import React from 'react';
import { useRouter, usePathname } from "next/navigation";
import {
  UserOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Avatar, Typography, Spin, Button } from 'antd';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '#/components/Navbar';

const {  Header, Content, Sider } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  const { token: { colorBgContainer } } = theme.useToken();

  // Menu navigasi untuk sidebar admin
  const menuItems: MenuProps['items'] = [
    { key: '/admin/dashboard', icon: <AppstoreOutlined />, label: 'Dashboard' },
    { key: '/admin/users', icon: <UserOutlined />, label: 'Manage Users' },
    { key: '/admin/products', icon: <ShoppingOutlined />, label: 'Manage Products' },
    { key: '/admin/orders', icon: <UnorderedListOutlined />, label: 'Manage Orders' },
    { key: '/admin/categories', icon: <UnorderedListOutlined />, label: 'Manage Categories' },
    { key: '/admin/brands', icon: <UnorderedListOutlined />, label: 'Manage Brands' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      logout();
    } else {
      router.push(e.key);
    }
  };
  
  // Selagi memverifikasi sesi, tampilkan loading
  if (loading) {
      return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
  }

  // Lapisan keamanan kedua: jika setelah loading user bukan admin, tolak akses.
  if (user?.role?.nama_role !== 'admin') {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <Typography.Title level={3}>Access Denied</Typography.Title>
            <Typography.Text>You do not have permission to view this page.</Typography.Text>
            <Button onClick={() => router.push('/')} className="mt-4">Go to Homepage</Button>
        </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="light" breakpoint="lg" collapsedWidth="0">
        <div className="p-4 text-center border-b">
            <Typography.Title level={4} className="text-red-600">Footstop Admin</Typography.Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 16px', background: colorBgContainer, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <div className='flex items-center gap-2'>
                <Avatar icon={<UserOutlined />} />
                <Typography.Text strong>{user.username}</Typography.Text>
            </div>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}