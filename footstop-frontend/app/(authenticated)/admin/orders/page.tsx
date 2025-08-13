"use client";

import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Spin, message, Typography, App } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { getAllOrders } from "../../../../lib/services/adminService"; // Sesuaikan path
import type { TableProps } from "antd";
import { useRouter } from "next/navigation";

// Definisikan tipe data yang diharapkan dari API
interface Order {
  id_order: number;
  orderDate: string;
  totalPrice: string;
  statusPengiriman: string;
  user: {
    username: string;
  };
}

const ManageOrdersPageContent = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const router = useRouter();
  const { message: messageApi } = App.useApp();

  // Fungsi untuk mengambil data dari backend
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
      messageApi.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  // Ambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchOrders(pagination.current, pagination.pageSize);
  }, []);

  // Handler saat paginasi di tabel berubah
  const handleTableChange: TableProps<Order>["onChange"] = (newPagination) => {
    fetchOrders(newPagination.current, newPagination.pageSize);
  };

  // Fungsi untuk memberi warna pada status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "Dibayar":
        return "blue";
      case "Dikirim":
        return "cyan";
      case "Selesai":
        return "green";
      case "Dibatalkan":
        return "red";
      default:
        return "default";
    }
  };

  // Definisi kolom untuk tabel
  const columns: TableProps<Order>["columns"] = [
    { title: "Order ID", dataIndex: "id_order", key: "id_order" },
    { title: "Customer", dataIndex: ["user", "username"], key: "customer" },
    {
      title: "Date",
      dataIndex: "orderDate",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "total",
      render: (price) => `Rp ${parseInt(price).toLocaleString()}`,
    },
    {
      title: "Status",
      dataIndex: "statusPengiriman",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => router.push(`/admin/orders/${record.id_order}`)} // Arahkan ke halaman detail nanti
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={2} className="mb-6">
        Manage Orders
      </Typography.Title>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id_order"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: true }}
      />
    </div>
  );
};

// Bungkus dengan <App> untuk konteks message
export default function ManageOrdersPage() {
  return (
    <App>
      <ManageOrdersPageContent />
    </App>
  );
}
