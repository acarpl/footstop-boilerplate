// app/(authenticated)/dashboard/page.tsx

'use client';

import React from 'react';
import { useAuth } from '../../../../context/AuthContext'; // Sesuaikan path jika perlu
import { Card, Typography, Button, List, Tag, Row, Col, Avatar } from 'antd';
import { ShoppingCart, User as UserIcon, Archive, Edit } from 'lucide-react';
import Link from 'next/link';

// Data dummy untuk riwayat pesanan, ganti dengan data API nanti
const recentOrders = [
  { id: 'ORD-123', date: '2024-06-25', total: 500000, status: 'Shipped' },
  { id: 'ORD-122', date: '2024-06-20', total: 1250000, status: 'Processing' },
  { id: 'ORD-120', date: '2024-06-15', total: 780000, status: 'Delivered' },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();

  // Tampilkan loading state jika data user belum siap
  if (loading) {
    return <div>Loading your dashboard...</div>;
  }

  // Tampilkan pesan jika karena suatu hal user tidak ditemukan setelah loading
  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
      <Typography.Title level={2}>
        Welcome back, {user.username}!
      </Typography.Title>
      <Typography.Paragraph>
        Here's your personal dashboard. You can manage your orders and account details here.
      </Typography.Paragraph>

      {/* Bagian Pintasan (Shortcuts) */}
      <Row gutter={[16, 16]} className="mt-8">
        <Col xs={24} sm={12} md={6}>
          <Link href="/cart">
            <Card hoverable className="text-center">
              <ShoppingCart size={48} className="mx-auto text-blue-500 mb-2" />
              <Typography.Title level={5}>My Cart</Typography.Title>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Link href="/orders">
            <Card hoverable className="text-center">
              <Archive size={48} className="mx-auto text-green-500 mb-2" />
              <Typography.Title level={5}>Order History</Typography.Title>
            </Card>
          </Link>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Link href="/profile">
            <Card hoverable className="text-center">
              <UserIcon size={48} className="mx-auto text-purple-500 mb-2" />
              <Typography.Title level={5}>My Profile</Typography.Title>
            </Card>
          </Link>
        </Col>
      </Row>

      {/* Bagian Riwayat Pesanan Terbaru */}
      <div className="mt-12">
        <Typography.Title level={3}>Recent Orders</Typography.Title>
        <Card>
          <List
            itemLayout="horizontal"
            dataSource={recentOrders}
            renderItem={(order) => (
              <List.Item
                actions={[<Link href={`/orders/${order.id}`}>View Details</Link>]}
              >
                <List.Item.Meta
                  title={`Order #${order.id}`}
                  description={`Date: ${order.date} - Total: Rp ${order.total.toLocaleString()}`}
                />
                <div>
                  <Tag color={order.status === 'Delivered' ? 'green' : order.status === 'Shipped' ? 'blue' : 'orange'}>
                    {order.status}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
}