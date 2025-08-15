"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Spin,
  Empty,
  Button,
  Typography,
  App,
  Card,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import Image from "next/image";

// Types based on your entity
interface Product {
  id_product: number;
  product_name: string;
  images?: { url: string }[]; // Assuming product has images
}

interface OrdersDetail {
  id_order_details: number;
  quantity: number;
  price_per_unit: number;
  subtotal: number;
  size: string;
  product: Product;
}

interface Order {
  id_order: number;
  order_date: string;
  total_price: number;
  orderDetails: OrdersDetail[];
}

const { Title, Text } = Typography;

// Service function (simplified)
const getOrderDetails = async (orderId: string): Promise<Order> => {
  // Replace with your actual API call
  const response = await fetch(`/api/orders/${orderId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch order details");
  }
  return response.json();
};

// Helper functions
const formatCurrency = (amount: number) => {
  return `Rp ${amount.toLocaleString("id-ID")}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Loading Component
const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 flex justify-center items-center">
    <div className="text-center">
      <Spin size="large" />
      <div className="mt-4">
        <Text className="text-gray-600">Loading Order Details...</Text>
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen bg-gray-50 flex justify-center items-center">
    <div className="text-center p-10">
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Order not found">
        <Button type="primary" onClick={onBack}>
          <ArrowLeftOutlined /> Go Back
        </Button>
      </Empty>
    </div>
  </div>
);

// Order Detail Item Component
const OrderDetailItem = ({ detail }: { detail: OrdersDetail }) => (
  <Card className="mb-4 shadow-sm">
    <div className="flex items-center gap-4">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <Image
          src={detail.product.images?.[0]?.url || "/placeholder.png"}
          alt={detail.product.product_name}
          width={80}
          height={80}
          className="rounded-lg object-cover bg-gray-200"
        />
      </div>

      {/* Product Info */}
      <div className="flex-grow">
        <Title level={5} className="!mb-2">
          {detail.product.product_name}
        </Title>

        <div className="space-y-1">
          <Text className="text-gray-600 block">
            Size: <span className="font-medium">{detail.size || "N/A"}</span>
          </Text>
          <Text className="text-gray-600 block">
            Quantity: <span className="font-medium">{detail.quantity}</span>
          </Text>
          <Text className="text-gray-600 block">
            Unit Price:{" "}
            <span className="font-medium">
              {formatCurrency(detail.price_per_unit)}
            </span>
          </Text>
        </div>
      </div>

      {/* Subtotal */}
      <div className="text-right">
        <Text className="text-gray-500 text-sm block">Subtotal</Text>
        <Text strong className="text-lg text-red-600">
          {formatCurrency(detail.subtotal)}
        </Text>
      </div>
    </div>
  </Card>
);

// Order Summary Component
const OrderSummary = ({ orderDetails }: { orderDetails: OrdersDetail[] }) => {
  const totalItems = orderDetails.reduce(
    (sum, detail) => sum + detail.quantity,
    0
  );
  const totalAmount = orderDetails.reduce(
    (sum, detail) => sum + detail.subtotal,
    0
  );

  return (
    <Card title="Order Summary" className="shadow-sm">
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title="Total Items"
            value={totalItems}
            prefix={<InboxOutlined />}
          />
        </Col>
        <Col span={8}>
          <Statistic title="Items Count" value={orderDetails.length} />
        </Col>
        <Col span={8}>
          <Statistic
            title="Total Amount"
            value={totalAmount}
            formatter={(value) => formatCurrency(Number(value))}
            valueStyle={{ color: "#cf1322" }}
          />
        </Col>
      </Row>
    </Card>
  );
};

// Custom Hook
const useOrderDetails = (orderId: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { message: messageApi } = App.useApp();

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;

    try {
      const orderData = await getOrderDetails(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      messageApi.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  }, [orderId, messageApi]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return { order, loading, refetch: fetchOrder };
};

// Main Component
const OrderDetailsPageContent = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const { order, loading } = useOrderDetails(orderId);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!order) {
    return <EmptyState onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={handleBack}
            className="mb-4"
            icon={<ArrowLeftOutlined />}
          >
            Back
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <Title level={2} className="!mb-2">
                Order #{order.id_order}
              </Title>
              <Text className="text-gray-600">
                Order Date: {formatDate(order.order_date)}
              </Text>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-8">
          <OrderSummary orderDetails={order.orderDetails} />
        </div>

        {/* Order Details */}
        <div>
          <Title level={3} className="mb-6">
            Order Items ({order.orderDetails.length})
          </Title>

          {order.orderDetails.map((detail) => (
            <OrderDetailItem key={detail.id_order_details} detail={detail} />
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Button
            type="primary"
            onClick={() => router.push("/orders")}
            className="bg-red-600 border-red-600 hover:bg-red-700"
          >
            <ShoppingCartOutlined /> View All Orders
          </Button>

          <Button onClick={() => router.push("/shop")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function OrderDetailsPage() {
  return (
    <App>
      <OrderDetailsPageContent />
    </App>
  );
}
