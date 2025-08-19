"use client";

import React, { useState, useEffect, useCallback } from "react";
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

  // Fungsi untuk mengambil data dari backend dengan useCallback
  const fetchOrders = useCallback(
    async (page = 1, pageSize = 10) => {
      setLoading(true);
      try {
        console.log("Fetching orders with params:", { page, limit: pageSize });

        const response = await getAllOrders({ page, limit: pageSize });

        console.log("API Response:", response);

        // Handle berbagai format response
        let ordersData = [];
        let totalCount = 0;
        let currentPage = page;
        let limit = pageSize;

        if (response && typeof response === "object") {
          // Format 1: { data: [], page: 1, limit: 10, total: 100 }
          if (response.data && Array.isArray(response.data)) {
            ordersData = response.data;
            totalCount = response.total || response.data.length;
            currentPage = response.page || page;
            limit = response.limit || pageSize;
          }
          // Format 2: { orders: [], pagination: { ... } }
          else if (response.orders && Array.isArray(response.orders)) {
            ordersData = response.orders;
            totalCount = response.pagination?.total || response.orders.length;
            currentPage = response.pagination?.current || page;
            limit = response.pagination?.pageSize || pageSize;
          }
          // Format 3: Direct array
          else if (Array.isArray(response)) {
            ordersData = response;
            totalCount = response.length;
          }
          // Format 4: Response langsung adalah array orders
          else if (response.id_order) {
            ordersData = [response];
            totalCount = 1;
          }
        }

        console.log("Processed orders data:", ordersData);

        setOrders(ordersData);
        setPagination({
          current: currentPage,
          pageSize: limit,
          total: totalCount,
        });

        if (ordersData.length === 0) {
          messageApi.info("No orders found.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);

        // Handle different error types
        if (error && typeof error === "object") {
          const errorMessage =
            error.message ||
            error.response?.data?.message ||
            "Failed to fetch orders.";
          messageApi.error(errorMessage);
        } else {
          messageApi.error("Failed to fetch orders.");
        }

        // Reset data on error
        setOrders([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
      } finally {
        setLoading(false);
      }
    },
    [messageApi]
  );

  // Ambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchOrders(pagination.current, pagination.pageSize);
  }, [fetchOrders]);

  // Handler saat paginasi di tabel berubah
  const handleTableChange: TableProps<Order>["onChange"] = (newPagination) => {
    const page = newPagination?.current || 1;
    const pageSize = newPagination?.pageSize || 10;
    fetchOrders(page, pageSize);
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

  // Safe render functions
  const renderDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString();
    } catch (error) {
      console.warn("Invalid date:", date);
      return date || "-";
    }
  };

  const renderPrice = (price: string | number) => {
    try {
      const numericPrice = typeof price === "string" ? parseInt(price) : price;
      return `Rp ${numericPrice.toLocaleString()}`;
    } catch (error) {
      console.warn("Invalid price:", price);
      return `Rp ${price || 0}`;
    }
  };

  const renderCustomer = (user: any) => {
    return user?.username || "Unknown User";
  };

  // Definisi kolom untuk tabel
  const columns: TableProps<Order>["columns"] = [
    {
      title: "Order ID",
      dataIndex: "id_order",
      key: "id_order",
      width: 100,
    },
    {
      title: "Customer",
      dataIndex: ["user", "username"],
      key: "customer",
      render: (_, record) => renderCustomer(record.user),
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      key: "date",
      render: renderDate,
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "total",
      render: renderPrice,
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
      width: 120,
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => router.push(`/admin/orders/${record.id_order}`)}
          size="small"
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Typography.Title level={2}>Manage Orders</Typography.Title>
        <Button
          onClick={() => fetchOrders(pagination.current, pagination.pageSize)}
        >
          Refresh
        </Button>
      </div>

      {/* Debug info - hanya tampil di development */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
          <strong>Debug:</strong> Found {orders.length} orders, Total:{" "}
          {pagination.total}
        </div>
      )}

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id_order"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} orders`,
        }}
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
