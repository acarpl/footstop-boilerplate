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

// Types based on your entity - updated to match service
interface Image {
  id_gambar: number;
  url: string;
}

interface Product {
  id_product: number;
  product_name: string;
  images: Image[];
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

// Import the service from your existing orderService
import { getMyOrderDetails } from "../../../../lib/services/orderService";

// API Response Types (camelCase from backend)
interface ApiOrderDetail {
  id_order_details: number;
  quantity: number;
  price_per_unit: string;
  subtotal: string;
  size: string;
  product: {
    id_product: number;
    product_name: string;
    images: { url: string; id_gambar: number }[];
  };
}

interface ApiOrderResponse {
  id_order: number;
  orderDate: string; // camelCase from API
  totalPrice: string; // camelCase from API
  orderDetails: ApiOrderDetail[]; // camelCase from API
  address: string;
  fullName: string;
  phoneNumber: string;
  statusPengiriman: string;
}

// Adapter function to match our component interface
const getOrderDetails = async (orderId: string): Promise<Order> => {
  try {
    const orderData = await getMyOrderDetails(orderId);

    // Debug logging - let's see all properties
    console.log("Service response:", orderData);
    console.log("Available properties:", Object.keys(orderData));
    console.log("orderDate value:", orderData.orderDate);
    console.log("order_date value:", orderData.order_date);
    console.log("orderDetails value:", orderData.orderDetails);
    console.log("order_details value:", orderData.order_details);
    console.log("totalPrice value:", orderData.totalPrice);
    console.log("total_price value:", orderData.total_price);

    // Check if orderData exists
    if (!orderData) {
      throw new Error("No order data received from server");
    }

    // Try multiple property name variations
    const orderDate =
      orderData.orderDate || orderData.order_date || orderData.createdAt || "";
    const totalPrice = orderData.totalPrice || orderData.total_price || "0";
    const orderDetails =
      orderData.orderDetails || orderData.order_details || [];

    console.log("Extracted values:", {
      orderDate,
      totalPrice,
      orderDetailsLength: orderDetails.length,
    });

    // Transform the service response
    const transformedData: Order = {
      id_order: orderData.id_order || 0,
      order_date: orderDate,
      total_price: Number(totalPrice) || 0,
      orderDetails: Array.isArray(orderDetails)
        ? orderDetails.map((detail, index) => {
            console.log(`Processing detail ${index}:`, detail);
            return {
              id_order_details: detail.id_order_details || index,
              quantity: detail.quantity || 0,
              price_per_unit:
                Number(detail.price_per_unit || detail.pricePerUnit) || 0,
              subtotal: Number(detail.subtotal) || 0,
              size: detail.size || "N/A",
              product: {
                id_product: detail.product?.id_product || 0,
                product_name:
                  detail.product?.product_name ||
                  detail.product?.productName ||
                  "Unknown Product",
                images: Array.isArray(detail.product?.images)
                  ? detail.product.images
                  : [],
              },
            };
          })
        : [],
    };

    console.log("Final transformed data:", transformedData);
    return transformedData;
  } catch (error) {
    console.error("getOrderDetails error:", error);
    throw error;
  }
};

// Helper functions
const formatCurrency = (amount: number) => {
  return `Rp ${amount.toLocaleString("id-ID")}`;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "Invalid Date";

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.warn("Invalid date string:", dateString);
    return "Invalid Date";
  }

  return date.toLocaleDateString("id-ID", {
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

// Order Summary Component with better error handling
const OrderSummary = ({ orderDetails }: { orderDetails: OrdersDetail[] }) => {
  const safeOrderDetails = orderDetails || [];
  const totalItems = safeOrderDetails.reduce(
    (sum, detail) => sum + (detail.quantity || 0),
    0
  );
  const totalAmount = safeOrderDetails.reduce(
    (sum, detail) => sum + (detail.subtotal || 0),
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
          <Statistic title="Items Count" value={safeOrderDetails.length} />
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

// Custom Hook with better error handling and debugging
const useOrderDetails = (orderId: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { message: messageApi } = App.useApp();

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching order details for ID:", orderId);
      const orderData = await getMyOrderDetails(orderId);

      // Debug: Log the raw response
      console.log("Raw order data from API:", orderData);

      // TEMPORARY: Use raw data directly to see what works
      const rawOrder = {
        id_order: orderData.id_order,
        order_date: orderData.orderDate || orderData.order_date || "No date",
        total_price: Number(
          orderData.totalPrice || orderData.total_price || "0"
        ),
        orderDetails: orderData.orderDetails || orderData.order_details || [],
      };

      console.log("Direct raw order:", rawOrder);

      // If raw works, then transform properly
      const transformedOrder = await getOrderDetails(orderId);
      console.log("Transformed order data:", transformedOrder);
      setOrder(transformedOrder);
    } catch (error) {
      console.error("Failed to fetch order details:", error);

      // More specific error messages
      if (error instanceof Error) {
        messageApi.error(`Error: ${error.message}`);
      } else {
        messageApi.error(
          "Failed to load order details. Please check the console for more information."
        );
      }
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
                Order Date:{" "}
                {order.order_date
                  ? formatDate(order.order_date)
                  : "Date not available"}
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
            Order Items ({order.orderDetails?.length || 0})
          </Title>

          {order.orderDetails && order.orderDetails.length > 0 ? (
            order.orderDetails.map((detail) => (
              <OrderDetailItem key={detail.id_order_details} detail={detail} />
            ))
          ) : (
            <Card className="text-center py-8">
              <Empty
                description="No order items found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Card>
          )}
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
