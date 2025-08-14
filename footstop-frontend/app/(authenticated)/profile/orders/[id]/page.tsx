"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Spin,
  Empty,
  Button,
  Typography,
  message,
  App,
  Card,
  Divider,
  Badge,
  Space,
  Tag,
  Steps,
  Row,
  Col,
  Timeline,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  TruckOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { AxiosError } from "axios";

// Import your order service
import {
  getMyOrderDetails,
  type Order,
} from "../../../../../lib/services/orderService";

const { Title, Text } = Typography;

const OrderDetailPageContent = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { message: messageApi } = App.useApp();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const fetchOrderDetail = useCallback(async () => {
    try {
      if (!orderId) return;
      const orderData = await getMyOrderDetails(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error("Failed to fetch order:", error);
      messageApi.error("Failed to load order details.");
    } finally {
      setLoading(false);
    }
  }, [orderId, messageApi]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "paid":
      case "success":
      case "confirmed":
        return "success";
      case "failed":
      case "cancelled":
        return "error";
      case "processing":
        return "processing";
      case "shipped":
      case "shipping":
        return "blue";
      case "delivered":
        return "green";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <ClockCircleOutlined />;
      case "paid":
      case "success":
      case "confirmed":
        return <CheckCircleOutlined />;
      case "failed":
      case "cancelled":
        return <ExclamationCircleOutlined />;
      case "processing":
        return <CreditCardOutlined />;
      case "shipped":
      case "shipping":
        return <TruckOutlined />;
      case "delivered":
        return <CheckCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getCurrentStep = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return 0;
      case "paid":
      case "success":
      case "confirmed":
        return 1;
      case "processing":
        return 2;
      case "shipped":
      case "shipping":
        return 3;
      case "delivered":
        return 4;
      case "failed":
      case "cancelled":
        return -1;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4">
            <Text className="text-gray-600">Loading Order Details...</Text>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center p-10">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text className="text-gray-500 text-lg">Order not found</Text>
                <div className="mt-2">
                  <Text className="text-gray-400">
                    The order you're looking for doesn't exist
                  </Text>
                </div>
              </div>
            }
          >
            <Button
              type="primary"
              size="large"
              className="bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700"
              onClick={() => router.push("/orders")}
            >
              <ShoppingCartOutlined /> View All Orders
            </Button>
          </Empty>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(order.status);
  const currentStep = getCurrentStep(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Title level={2} className="!mb-2 !text-gray-800">
                <FileTextOutlined className="mr-3 text-red-600" />
                Order #{order.id_order}
              </Title>
              <Text className="text-gray-600">
                Placed on{" "}
                {new Date(order.order_date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </div>
            <Tag
              icon={getStatusIcon(order.status_pengiriman)}
              color={getStatusColor(order.status_pengiriman)}
              className="text-sm px-3 py-1"
            >
              {order.status_pengiriman?.toUpperCase()}
            </Tag>
          </div>

          <Button onClick={() => router.back()} className="mb-6">
            ← Back
          </Button>
        </div>

        {/* Order Progress */}
        {getCurrentStep(order.status_pengiriman) >= 0 && (
          <Card className="mb-8 shadow-sm border border-gray-100">
            <Title level={4} className="mb-6">
              Order Progress
            </Title>
            <Steps
              current={getCurrentStep(order.status_pengiriman)}
              status={
                order.status_pengiriman?.toLowerCase() === "failed" ||
                order.status_pengiriman?.toLowerCase() === "cancelled"
                  ? "error"
                  : "process"
              }
              items={[
                {
                  title: "Order Placed",
                  description: "Your order has been received",
                  icon: <ShopOutlined />,
                },
                {
                  title: "Payment Confirmed",
                  description: "Payment has been processed",
                  icon: <CreditCardOutlined />,
                },
                {
                  title: "Processing",
                  description: "Preparing your items",
                  icon: <ClockCircleOutlined />,
                },
                {
                  title: "Shipped",
                  description: "On the way to you",
                  icon: <TruckOutlined />,
                },
                {
                  title: "Delivered",
                  description: "Successfully delivered",
                  icon: <CheckCircleOutlined />,
                },
              ]}
            />
          </Card>
        )}

        <Row gutter={24}>
          {/* Left Column - Order Items & Shipping */}
          <Col xs={24} lg={16}>
            {/* Order Items */}
            <Card
              title="Order Items"
              className="mb-6 shadow-sm border border-gray-100"
            >
              <div className="space-y-4">
                {order.order_details?.map((item, index: number) => (
                  <div
                    key={item.id_order_details}
                    className="flex items-center gap-4 p-4 rounded-md bg-gray-50"
                  >
                    <Image
                      src={item.product?.images?.[0]?.url || "/placeholder.png"}
                      alt={item.product?.product_name || "Product"}
                      width={60}
                      height={60}
                      className="rounded-md object-cover bg-gray-200"
                    />
                    <div className="flex-grow">
                      <Text strong className="text-gray-800 block">
                        {item.product?.product_name}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        Size: {item.size} | Quantity: {item.quantity}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        Price: Rp{" "}
                        {Number(item.price_per_unit).toLocaleString("id-ID")}
                      </Text>
                    </div>
                    <div className="text-right">
                      <Text strong className="text-gray-800">
                        Rp {Number(item.subtotal).toLocaleString("id-ID")}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Shipping Information */}
            <Card
              title="Shipping Information"
              className="shadow-sm border border-gray-100"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <UserOutlined className="text-red-600 mt-1" />
                  <div>
                    <Text strong className="block text-gray-800">
                      Full Name
                    </Text>
                    <Text className="text-gray-600">{order.fullName}</Text>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <PhoneOutlined className="text-red-600 mt-1" />
                  <div>
                    <Text strong className="block text-gray-800">
                      Phone Number
                    </Text>
                    <Text className="text-gray-600">{order.phoneNumber}</Text>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <HomeOutlined className="text-red-600 mt-1" />
                  <div>
                    <Text strong className="block text-gray-800">
                      Shipping Address
                    </Text>
                    <Text className="text-gray-600">{order.address}</Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          {/* Right Column - Order Summary & Actions */}
          <Col xs={24} lg={8}>
            {/* Order Summary */}
            <Card
              title="Order Summary"
              className="mb-6 shadow-sm border border-gray-100"
            >
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text className="text-gray-600">Subtotal</Text>
                  <Text>
                    Rp {Number(order.total_price).toLocaleString("id-ID")}
                  </Text>
                </div>

                <div className="flex justify-between">
                  <Text className="text-gray-600">Shipping</Text>
                  <Text>Free</Text>
                </div>

                <Divider className="my-3" />

                <div className="flex justify-between">
                  <Text strong className="text-gray-800">
                    Total
                  </Text>
                  <Text strong className="text-red-600 text-lg">
                    Rp {Number(order.total_price).toLocaleString("id-ID")}
                  </Text>
                </div>
              </div>
            </Card>

            {/* Payment Information */}
            <Card
              title="Payment Information"
              className="mb-6 shadow-sm border border-gray-100"
            >
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text className="text-gray-600">Payment Method</Text>
                  <Text>Midtrans</Text>
                </div>

                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Status</Text>
                  <Tag
                    icon={getStatusIcon(order.status_pengiriman)}
                    color={getStatusColor(order.status_pengiriman)}
                  >
                    {order.status_pengiriman?.toUpperCase()}
                  </Tag>
                </div>

                <div className="flex justify-between">
                  <Text className="text-gray-600">Order Date</Text>
                  <Text>{new Date(order.order_date).toLocaleDateString()}</Text>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              {order.status_pengiriman?.toLowerCase() === "pending" && (
                <Button
                  type="primary"
                  block
                  size="large"
                  className="bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700"
                  icon={<CreditCardOutlined />}
                  onClick={() => {
                    // Trigger payment again if needed
                    messageApi.info("Redirecting to payment...");
                  }}
                >
                  Complete Payment
                </Button>
              )}

              <Button block size="large" onClick={() => router.push("/orders")}>
                View All Orders
              </Button>

              <Button block size="large" onClick={() => router.push("/shop")}>
                Continue Shopping
              </Button>
            </div>
          </Col>
        </Row>
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
