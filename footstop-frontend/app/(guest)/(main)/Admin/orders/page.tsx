// app/admin/orders/page.tsx
'use client';
import { Table, Tag } from 'antd';
import { useEffect, useState } from 'react';

export default function OrderListPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Ganti dengan fetch dari NestJS
    setOrders([
      { key: '1', orderNumber: '#1234', customer: 'John Doe', status: 'Completed' },
      { key: '2', orderNumber: '#5678', customer: 'Jane Smith', status: 'Pending' },
    ]);
  }, []);

  const columns = [
    { title: 'Order #', dataIndex: 'orderNumber' },
    { title: 'Customer', dataIndex: 'customer' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={status === 'Completed' ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Order List</h1>
      <Table dataSource={orders} columns={columns} />
    </>
  );
}
