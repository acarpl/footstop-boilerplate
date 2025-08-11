"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Spin,
  Empty,
  Button,
  Typography,
  message,
  App,
  Card,
  Tag,
  Divider,
  List,
} from "antd";
import { getMyOrderDetails } from "../../../../../lib/services/orderService"; // Sesuaikan path jika perlu
import Image from "next/image";

// --- Tipe Data Disesuaikan dengan Respons JSON Anda ---
interface Brand {
  id_brand: number;
  brand_name: string;
}
interface Category {
  id_category: number;
  category_name: string;
}
interface Image {
  id_gambar: number;
  url: string;
}
interface Product {
  id_product: number;
  product_name: string;
  price: string;
  size: string;
  brand: Brand;
  category: Category;
  images?: Image[]; // Gambar bersifat opsional
}
interface OrderDetail {
  id_order_details: number;
  quantity: number;
  price_per_unit: string;
  subtotal: string;
  size: string;
  product: Product;
}
interface Order {
  id_order: number;
  orderDate: string;
  address: string;
  fullName: string;
  phoneNumber: string;
  totalPrice: string;
  statusPengiriman: string;
  orderDetails: OrderDetail[];
}

const OrderDetailPageContent = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { message: messageApi } = App.useApp();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const data = await getMyOrderDetails(orderId);
        setOrder(data);
      } catch (error) {
        messageApi.error("Failed to load order details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId, messageApi]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center p-10">
        <Empty description="Order not found." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center">
        <div>
          <Typography.Title level={2}>Order Details</Typography.Title>
          <Typography.Text type="secondary">
            Order ID: #{order.id_order}
          </Typography.Text>
        </div>
        <Button onClick={() => router.back()}>Back to Order History</Button>
      </div>

      <Card className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Typography.Text strong>Order Date</Typography.Text>
            <p>{new Date(order.orderDate).toLocaleString("id-ID")}</p>
          </div>
          <div>
            <Typography.Text strong>Status</Typography.Text>
            <p>
              <Tag color={getStatusColor(order.statusPengiriman)}>
                {order.statusPengiriman}
              </Tag>
            </p>
          </div>
          <div>
            <Typography.Text strong>Order Total</Typography.Text>
            <p className="font-bold">
              Rp {parseInt(order.totalPrice).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
        <Divider />
        <div>
          <Typography.Text strong>Shipping Information</Typography.Text>
          <p className="font-semibold">{order.fullName}</p>
          <p>{order.phoneNumber}</p>
          <p className="text-gray-600">{order.address}</p>
        </div>
      </Card>

      <Typography.Title level={3} className="mt-8 mb-4">
        Items Ordered
      </Typography.Title>
      <div className="bg-white p-4 rounded-lg shadow">
        <List
          itemLayout="horizontal"
          dataSource={order.orderDetails}
          renderItem={(item) => (
            <List.Item key={item.id_order_details}>
              <List.Item.Meta
                avatar={
                  <Image
                    src={item.product.images?.[0]?.url || "/placeholder.png"}
                    alt={item.product.product_name}
                    width={64}
                    height={64}
                    className="rounded-md object-contain bg-gray-100"
                  />
                }
                title={item.product.product_name}
                description={`Qty: ${item.quantity} | Size: ${
                  item.size || "N/A"
                }`}
              />
              <div className="text-right">
                <p className="font-semibold">
                  Rp {Number(item.subtotal).toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-gray-500">
                  @ Rp {Number(item.price_per_unit).toLocaleString("id-ID")}
                </p>
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default function OrderDetailPage() {
  return (
    <App>
      <OrderDetailPageContent />
    </App>
  );
}
