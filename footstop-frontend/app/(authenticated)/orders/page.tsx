"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Spin, Empty, Button, Typography, App } from "antd";
import {
  getMyOrders,
  type OrderSummary,
} from "../../../lib/services/orderService";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const OrdersPageContent = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { message: messageApi } = App.useApp();

  // Membungkus fetch logic dengan useCallback untuk optimisasi
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const ordersData = await getMyOrders();
      setOrders(ordersData);
    } catch (err) {
      setError("Failed to fetch your orders. Please try again.");
      messageApi.error("Failed to fetch your orders.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusColor = (status: string) => {
    // ... (Fungsi ini sudah bagus, tidak perlu diubah)
    switch (status?.toLowerCase()) {
      case "selesai":
        return "bg-green-100 text-green-800";
      case "dikirim":
        return "bg-blue-100 text-blue-800";
      case "dibayar":
        return "bg-yellow-100 text-yellow-800";
      case "dibatalkan":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatOrderDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" tip="Loading your orders..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10">
        <Typography.Text type="danger">{error}</Typography.Text>
        <br />
        <Button type="primary" onClick={fetchOrders} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8 mt-10">
        <Typography.Title level={2}>My Orders</Typography.Title>
        <Button onClick={fetchOrders} loading={loading}>
          Refresh
        </Button>
      </div>

      {orders.length === 0 ? (
        <Empty description="You haven't placed any orders yet.">
          <Link href="/shop">
            <Button type="primary">Start Shopping</Button>
          </Link>
        </Empty>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id_order}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {/* Menggunakan komponen Image dari Next.js */}
                      <Image
                        src={
                          order.orderDetails?.[0]?.product.images?.[0]?.url ||
                          "/placeholder.png"
                        }
                        alt="Product"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id_order}
                      </h3>
                      {/* Menggunakan camelCase sesuai standar service */}
                      <p className="text-gray-600">
                        {formatOrderDate(order.orderDate)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {/* Menggunakan camelCase */}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.statusPengiriman
                      )}`}
                    >
                      {order.statusPengiriman}
                    </span>
                    <div className="text-lg font-bold text-gray-900 mt-2">
                      Rp {parseInt(order.totalPrice).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-4 pt-4 border-t">
                  {/* Membuat tombol ini fungsional */}
                  <Button
                    onClick={() => router.push(`/orders/${order.id_order}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function OrdersPage() {
  return (
    <App>
      <OrdersPageContent />
    </App>
  );
}
