// app/admin/layout.tsx
'use client';
import { Layout, Menu } from 'antd';
import { UserOutlined, ShoppingCartOutlined, AppstoreOutlined, DashboardOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Header, Content, Sider } = Layout;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  const menuItems = [
    { key: '/admin', icon: <DashboardOutlined />, label: <Link href="/admin">Dashboard</Link> },
    { key: '/admin/users', icon: <UserOutlined />, label: <Link href="/admin/users">Users</Link> },
    { key: '/admin/orders', icon: <ShoppingCartOutlined />, label: <Link href="/admin/orders">Orders</Link> },
    { key: '/admin/products', icon: <AppstoreOutlined />, label: <Link href="/admin/products">Products</Link> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div className="text-white text-center text-xl py-4 font-bold">Admin Panel</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[path]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className="bg-white shadow-md text-xl px-6 py-2">Footstop Admin Panel</Header>
        <Content className="p-6 bg-gray-50">{children}</Content>
      </Layout>
    </Layout>
  );
}
