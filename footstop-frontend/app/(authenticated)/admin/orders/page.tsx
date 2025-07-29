'use client';

import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, message, Spin, Typography, Modal, Select } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { getAllOrders, updateOrderStatus } from '../../../../lib/services/adminService';
import type { TableProps } from 'antd';

// Definisikan tipe data
interface Order {
  id_order: number;
  order_date: string;
  total_price: string;
  status_pengiriman: string;
  user: {
    username: string;
    email: string;
  };
  address: string;
  order_details: any[]; // Bisa dibuat lebih spesifik
}

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await getAllOrders({ page, limit: pageSize });
      setOrders(response.data);
      setPagination({
        current: response.page,
        pageSize: response.limit,
        total: response.total,
      });
    } catch (error) {
      message.error('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(pagination.current, pagination.pageSize);
  }, []);

  const handleTableChange: TableProps<Order>['onChange'] = (newPagination) => {
    fetchOrders(newPagination.current, newPagination.pageSize);
  };

  const showDetailsModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };
  
  const handleStatusChange = async (newStatus: string) => {
    if (!selectedOrder) return;
    try {
        await updateOrderStatus(selectedOrder.id_order, newStatus);
        message.success("Order status updated successfully!");
        setIsModalVisible(false);
        fetchOrders(pagination.current, pagination.pageSize); // Refresh tabel
    } catch (error) {
        message.error("Failed to update order status.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'orange';
      case 'Dibayar': return 'blue';
      case 'Dikirim': return 'cyan';
      case 'Selesai': return 'green';
      case 'Dibatalkan': return 'red';
      default: return 'default';
    }
  };

  const columns: TableProps<Order>['columns'] = [
    { title: 'Order ID', dataIndex: 'id_order', key: 'id_order' },
    { title: 'Customer', dataIndex: ['user', 'username'], key: 'customer' },
    { title: 'Date', dataIndex: 'order_date', key: 'date', render: (date) => new Date(date).toLocaleDateString() },
    { title: 'Total', dataIndex: 'total_price', key: 'total', render: (price) => `Rp ${parseInt(price).toLocaleString()}` },
    {
      title: 'Status',
      dataIndex: 'status_pengiriman',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button icon={<EyeOutlined />} onClick={() => showDetailsModal(record)}>View Details</Button>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={2} className="mb-6">Manage Orders</Typography.Title>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id_order"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: true }}
      />
      <Modal
        title={`Order Details #${selectedOrder?.id_order}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null} // Kita buat footer kustom jika perlu
      >
        {selectedOrder && (
          <div>
            <p><strong>Customer:</strong> {selectedOrder.user.username} ({selectedOrder.user.email})</p>
            <p><strong>Shipping Address:</strong> {selectedOrder.address}</p>
            <p><strong>Order Date:</strong> {new Date(selectedOrder.order_date).toLocaleString()}</p>
            <Typography.Title level={5} className="mt-4">Update Status</Typography.Title>
            <Select 
                defaultValue={selectedOrder.status_pengiriman} 
                style={{ width: '100%' }}
                onChange={handleStatusChange}
            >
                <Select.Option value="Dibayar">Dibayar</Select.Option>
                <Select.Option value="Dikirim">Dikirim</Select.Option>
                <Select.Option value="Selesai">Selesai</Select.Option>
                <Select.Option value="Dibatalkan">Dibatalkan</Select.Option>
            </Select>
          </div>
        )}
      </Modal>
    </div>
  );
}