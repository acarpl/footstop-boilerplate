"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Spin, Empty, Button, Typography, App } from "antd";
import {
  getMyOrders,
  type OrderSummary,
} from "../../../lib/services/orderService";
import Link from "next/link";
import { useRouter } from "next/navigation";

// SafeImage component untuk handle image loading yang lebih robust
interface SafeImageProps {
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(!!src);

  useEffect(() => {
    if (src) {
      setImageError(false);
      setImageLoading(true);

      // Test image loading
      const img = new window.Image();
      img.onload = () => setImageLoading(false);
      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
        setImageError(true);
        setImageLoading(false);
      };
      img.src = src;
    }
  }, [src]);

  if (!src || imageError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <div className="text-gray-400 text-xs">No Image</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Spin size="small" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover"
        style={{ display: imageLoading ? "none" : "block" }}
      />
    </div>
  );
};

// Types
interface OrderCardProps {
  order: OrderSummary;
  onViewDetails: (orderId: string) => void;
}

// Constants
const ORDER_STATUS_COLORS = {
  selesai: "bg-green-100 text-green-800",
  dikirim: "bg-blue-100 text-blue-800",
  dibayar: "bg-yellow-100 text-yellow-800",
  dibatalkan: "bg-red-100 text-red-800",
  default: "bg-gray-100 text-gray-800",
} as const;

const PLACEHOLDER_IMAGE = "/placeholder.png";

// Utility functions
const formatOrderDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatPrice = (price: string | number): string => {
  return `Rp ${parseInt(price.toString()).toLocaleString()}`;
};

const getStatusColor = (status: string): string => {
  const normalizedStatus =
    status?.toLowerCase() as keyof typeof ORDER_STATUS_COLORS;
  return ORDER_STATUS_COLORS[normalizedStatus] || ORDER_STATUS_COLORS.default;
};

// Components
const OrderCard: React.FC<OrderCardProps> = React.memo(
  ({ order, onViewDetails }) => {
    const firstProductImage = order.orderDetails?.[0]?.product.images?.[0]?.url;

    // Debug logging
    console.log("Order ID:", order.id_order);
    console.log("Image URL:", firstProductImage);
    console.log("Order detail:", order.orderDetails);

    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <SafeImage
                  src={firstProductImage}
                  alt={`Product for order ${order.id_order}`}
                  width={64}
                  height={64}
                  className="w-full h-full"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Order #{order.id_order}
                </h3>
                <p className="text-gray-600">
                  {formatOrderDate(order.orderDate)}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.statusPengiriman
                )}`}
              >
                {order.statusPengiriman}
              </span>
              <div className="text-lg font-bold text-gray-900 mt-2">
                {formatPrice(order.totalPrice)}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-4 pt-4 border-t">
            <Button
              onClick={() => onViewDetails(order.id_order)}
              type="default"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

OrderCard.displayName = "OrderCard";

const LoadingState: React.FC = () => (
  <div className="flex justify-center items-center h-96">
    <Spin size="large" tip="Loading your orders..." />
  </div>
);

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({
  error,
  onRetry,
}) => (
  <div className="text-center p-10">
    <Typography.Text type="danger">{error}</Typography.Text>
    <br />
    <Button type="primary" onClick={onRetry} className="mt-4">
      Try Again
    </Button>
  </div>
);

const EmptyState: React.FC = () => (
  <Empty description="You haven't placed any orders yet.">
    <Link href="/shop">
      <Button type="primary">Start Shopping</Button>
    </Link>
  </Empty>
);

// Custom hooks
const useOrders = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { message: messageApi } = App.useApp();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const ordersData = await getMyOrders();
      setOrders(ordersData);
    } catch (err) {
      const errorMessage = "Failed to fetch your orders. Please try again.";
      setError(errorMessage);
      messageApi.error("Failed to fetch your orders.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  };
};

// Main component
const OrdersPageContent: React.FC = () => {
  const { orders, loading, error, refetch } = useOrders();
  const router = useRouter();

  const handleViewDetails = useCallback(
    (orderId: string) => {
      router.push(`/orders/${orderId}`);
    },
    [router]
  );

  const orderCards = useMemo(
    () =>
      orders.map((order) => (
        <OrderCard
          key={order.id_order}
          order={order}
          onViewDetails={handleViewDetails}
        />
      )),
    [orders, handleViewDetails]
  );

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8 mt-10">
        <Typography.Title level={2}>My Orders</Typography.Title>
        <Button onClick={refetch} loading={loading}>
          Refresh
        </Button>
      </div>

      {orders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">{orderCards}</div>
      )}
    </div>
  );
};

// Export
export default function OrdersPage() {
  return (
    <App>
      <OrdersPageContent />
    </App>
  );
}
