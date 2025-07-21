// app/admin/page.tsx
'use client';
import { Card, Row, Col } from 'antd';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Total Users" bordered={false}>123 Users</Card>
        </Col>
        <Col span={8}>
          <Card title="Total Orders" bordered={false}>456 Orders</Card>
        </Col>
        <Col span={8}>
          <Card title="Total Products" bordered={false}>789 Products</Card>
        </Col>
      </Row>
    </div>
  );
}
