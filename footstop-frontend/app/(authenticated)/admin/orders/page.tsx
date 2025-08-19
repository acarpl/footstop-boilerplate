"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Tag,
  Button,
  Spin,
  message,
  Typography,
  App,
  Select,
  Popconfirm,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../../../lib/services/adminService"; // Make sure to import updateOrderStatus
import type { TableProps } from "antd";
import { useRouter } from "next/navigation";

// Define order status options
const STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Dibayar", label: "Dibayar" },
  { value: "Dikirim", label: "Dikirim" },
  { value: "Selesai", label: "Selesai" },
  { value: "Dibatalkan", label: "Dibatalkan" },
];

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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const router = useRouter();
  const { message: messageApi } = App.useApp();

  const fetchOrders = useCallback(
    async (page = 1, pageSize = 10) => {
      setLoading(true);
      try {
        const response = await getAllOrders({ page, limit: pageSize });

        let ordersData = [];
        let totalCount = 0;
        let currentPage = page;
        let limit = pageSize;

        if (response && typeof response === "object") {
          if (response.data && Array.isArray(response.data)) {
            ordersData = response.data;
            totalCount = response.total || response.data.length;
            currentPage = response.page || page;
            limit = response.limit || pageSize;
          } else if (response.orders && Array.isArray(response.orders)) {
            ordersData = response.orders;
            totalCount = response.pagination?.total || response.orders.length;
            currentPage = response.pagination?.current || page;
            limit = response.pagination?.pageSize || pageSize;
          } else if (Array.isArray(response)) {
            ordersData = response;
            totalCount = response.length;
          } else if (response.id_order) {
            ordersData = [response];
            totalCount = 1;
          }
        }

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
        messageApi.error("Failed to fetch orders.");
        setOrders([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
      } finally {
        setLoading(false);
      }
    },
    [messageApi]
  );

  useEffect(() => {
    fetchOrders(pagination.current, pagination.pageSize);
  }, [fetchOrders]);

  const handleTableChange: TableProps<Order>["onChange"] = (newPagination) => {
    const page = newPagination?.current || 1;
    const pageSize = newPagination?.pageSize || 10;
    fetchOrders(page, pageSize);
  };

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

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateOrderStatus(id, newStatus);
      messageApi.success("Status updated successfully");

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id_order === id
            ? { ...order, statusPengiriman: newStatus }
            : order
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error("Error updating status:", error);
      messageApi.error("Failed to update status");
    }
  };

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
      render: (status, record) => {
        if (editingId === record.id_order) {
          return (
            <Select
              defaultValue={status}
              style={{ width: 120 }}
              onChange={(value) => handleStatusChange(record.id_order, value)}
              options={STATUS_OPTIONS}
              autoFocus
              onBlur={() => setEditingId(null)}
            />
          );
        }
        return (
          <Tag
            color={getStatusColor(status)}
            style={{ cursor: "pointer" }}
            onClick={() => setEditingId(record.id_order)}
          >
            {status}
          </Tag>
        );
      },
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

export default function ManageOrdersPage() {
  return (
    <App>
      <ManageOrdersPageContent />
    </App>
  );
}
