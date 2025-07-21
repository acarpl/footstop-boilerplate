"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import {
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  CiOutlined,
} from '@ant-design/icons'; // Import ikon yang relevan
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Avatar, Typography } from 'antd'; // Import komponen yang dibutuhkan
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import Image from 'next/image';

const { Content, Sider } = Layout;

// Tipe untuk props layout kita
interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { user, logout } = useAuth(); // Ambil data user dan fungsi logout

  // Dapatkan token tema dari Ant Design
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Definisikan item menu untuk sidebar navigasi
  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <AppstoreOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'My Profile',
    },
    {
      key: '/orders',
      icon: <CiOutlined />,
      label: 'Order History',
    },
    {
      key: '/cart',
      icon: <ShoppingCartOutlined />,
      label: 'My Cart',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true, // Memberi warna merah untuk item berbahaya/destruktif
    },
  ];
  
  // Fungsi yang menangani klik pada item menu
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      // Jika item yang diklik adalah 'logout', panggil fungsi logout
      logout();
    } else {
      // Jika tidak, arahkan ke path sesuai dengan key item menu
      router.push(e.key);
    }
  };

  return (
    // Struktur Layout utama dari Ant Design
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar Navigasi */}
      <Sider 
        width={250} 
        style={{ background: colorBgContainer }}
        breakpoint="lg" // Sidebar akan collapse di layar kecil
        collapsedWidth="0" // Akan hilang sepenuhnya saat collapse
      >
        {/* User Profile di atas Sidebar */}
        <div className="p-4 text-center border-b">
          <Avatar size={64} icon={<UserOutlined />} src={null} />
          <Typography.Title level={5} className="mt-2 mb-0">
            {user?.username || 'User'}
          </Typography.Title>
          <Typography.Text type="secondary">{user?.email || 'email@example.com'}</Typography.Text>
        </div>
        
        {/* Komponen Menu Ant Design */}
        <Menu
          mode="inline"
          // Tentukan item yang aktif berdasarkan URL saat ini
          defaultSelectedKeys={[ '/uploads']} 
          style={{ height: '100%', borderRight: 0 }}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      {/* Konten Utama */}
      <Layout style={{ padding: '24px' }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* DI SINI KONTEN HALAMAN (DASHBOARD, PROFILE, DLL) AKAN DIRENDER */}
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AuthenticatedLayout;