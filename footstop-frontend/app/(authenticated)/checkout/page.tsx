"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Spin,
  Empty,
  Button,
  Typography,
  message,
  App,
  Form,
  Input,
  Divider,
  Badge,
  Space,
  Tag,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  CreditCardOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { AxiosError } from "axios";

import { getCartItems, type CartItem } from "../../../lib/services/cartService";
import { createOrder } from "../../../lib/services/orderService";
import { createPaymentTransaction } from "../../../lib/services/paymentService";

import useMidtrans from "../../../hooks/useMidtrans";

// Add type declaration for Midtrans Snap
declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

const { TextArea } = Input;
const { Title, Text } = Typography;

const CheckoutPageContent = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message: messageApi } = App.useApp();
  const router = useRouter();
  const [form] = Form.useForm();

  const { pay, isSnapReady } = useMidtrans();

  const fetchCart = useCallback(async () => {
    try {
      const items = await getCartItems();
      if (items.length === 0) {
        messageApi.warning("Your cart is empty. Redirecting...");
        setTimeout(() => router.push("/shop"), 2000);
      } else {
        setCartItems(items);
      }
    } catch (error) {
      messageApi.error("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  }, [messageApi, router]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item.product.price) || 0;
      return sum + item.quantity * price;
    }, 0);
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const onFinish = async (values: {
    fullName: string;
    phoneNumber: string;
    address: string;
  }) => {
    const loadingKey = "checkout-process";
    setIsSubmitting(true);

    try {
      messageApi.loading({
        content: "Creating your order...",
        key: loadingKey,
      });
      const newOrder = await createOrder(values);

      messageApi.loading({
        content: "Connecting to payment...",
        key: loadingKey,
      });
      const transaction = await createPaymentTransaction(newOrder.id_order);
      console.log("TRANSACTION", transaction);

      if (!transaction.token) throw new Error("Invalid payment token");

      messageApi.destroy(loadingKey);

      // Ensure Midtrans Snap is loaded and ready
      if (typeof window !== "undefined" && window.snap) {
        window.snap.pay(transaction.token, {
          onSuccess: (result: any) => {
            console.log("Payment success:", result);
            message.success("Payment successful!");
            router.push(`/orders/${newOrder.id_order}`);
          },
          onPending: (result: any) => {
            console.log("Payment pending:", result);
            message.info("Payment pending. Please complete it.");
            router.push(`/orders/${newOrder.id_order}`);
          },
          onError: (result: any) => {
            console.log("Payment error:", result);
            message.error("Payment failed. Please try again.");
          },
          onClose: () => {
            console.log("Payment popup closed");
            message.warning("Payment window was closed.");
          },
        });
      } else {
        // Fallback to custom hook method
        pay(transaction.token, {
          onSuccess: (res: any) => {
            message.success("Payment successful!");
            router.push(`/orders/${newOrder.id_order}`);
          },
          onPending: (res: any) => {
            message.info("Payment pending. Please complete it.");
            router.push(`/orders/${newOrder.id_order}`);
          },
          onError: () => {
            message.error("Payment failed.");
          },
          onClose: () => {
            message.warning("You closed the payment window.");
          },
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      const errMsg =
        error instanceof AxiosError
          ? error.response?.data?.message || "Checkout failed"
          : error instanceof Error
          ? error.message
          : "Checkout failed";
      messageApi.error({ content: errMsg, key: loadingKey });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4">
            <Text className="text-gray-600">Loading Your Cart...</Text>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center mt-10">
        <div className="text-center p-10">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text className="text-gray-500 text-lg">
                  Your cart is empty
                </Text>
                <div className="mt-2">
                  <Text className="text-gray-400">
                    Add some products to get started
                  </Text>
                </div>
              </div>
            }
          >
            <Button
              type="primary"
              size="large"
              className="bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700 shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => router.push("/shop")}
            >
              <ShoppingCartOutlined /> Continue Shopping
            </Button>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <Title
            level={1}
            className="!text-3xl !font-bold !text-gray-800 !mb-3"
          >
            <CreditCardOutlined className="mr-3 text-red-600" />
            Checkout
          </Title>
          <Text className="text-gray-600">Complete your purchase securely</Text>
          <div className="mt-4 flex justify-center">
            <Space size="medium">
              <Tag icon={<SafetyOutlined />} color="success">
                SSL Secured
              </Tag>
              <Tag icon={<CheckCircleOutlined />} color="processing">
                Fast Process
              </Tag>
            </Space>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-red-50 rounded-full p-2 mr-3">
                  <UserOutlined className="text-red-600 text-lg" />
                </div>
                <div>
                  <Title level={3} className="!mb-1 !text-gray-800">
                    Shipping Information
                  </Title>
                  <Text className="text-gray-500 text-sm">
                    Please provide your delivery details
                  </Text>
                </div>
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                disabled={isSubmitting}
              >
                <Form.Item
                  name="fullName"
                  label={
                    <Text className="text-gray-700 font-medium">Full Name</Text>
                  }
                  rules={[
                    { required: true, message: "Please enter your full name" },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Enter your complete name"
                    prefix={<UserOutlined className="text-gray-400" />}
                    className="rounded-md border-gray-200 hover:border-red-300 focus:border-red-400"
                  />
                </Form.Item>

                <Form.Item
                  name="phoneNumber"
                  label={
                    <Text className="text-gray-700 font-medium">
                      Phone Number
                    </Text>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter your phone number",
                    },
                    {
                      pattern: /^[0-9]+$/,
                      message: "Please enter a valid phone number",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="e.g. 08123456789"
                    prefix={<PhoneOutlined className="text-gray-400" />}
                    className="rounded-md border-gray-200 hover:border-red-300 focus:border-red-400"
                  />
                </Form.Item>

                <Form.Item
                  name="address"
                  label={
                    <Text className="text-gray-700 font-medium">
                      Complete Shipping Address
                    </Text>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter your complete address",
                    },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Street address, apartment/unit number, city, postal code"
                    className="rounded-md border-gray-200 hover:border-red-300 focus:border-red-400 resize-none"
                  />
                </Form.Item>

                <div className="pt-4">
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={isSubmitting}
                    disabled={!isSnapReady}
                    className="!h-12 !text-base !font-medium rounded-md bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700 shadow-md hover:shadow-lg transition-all duration-300"
                    icon={!isSubmitting && <CreditCardOutlined />}
                  >
                    {isSubmitting
                      ? "Processing Order..."
                      : isSnapReady
                      ? "Proceed to Payment"
                      : "Loading Payment Gateway..."}
                  </Button>

                  <div className="mt-3 text-center">
                    <Text className="text-gray-500 text-xs">
                      🔒 Your payment information is encrypted and secure
                    </Text>
                  </div>
                </div>
              </Form>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-gray-100 rounded-full p-2 mr-3">
                    <ShoppingCartOutlined className="text-gray-600 text-lg" />
                  </div>
                  <div>
                    <Title level={4} className="!mb-0 !text-gray-800">
                      Order Summary
                    </Title>
                  </div>
                </div>
                <Badge
                  count={totalItems}
                  style={{ backgroundColor: "#dc2626" }}
                />
              </div>

              {/* Cart Items */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id_cart}
                    className="flex items-center gap-3 p-3 rounded-md bg-gray-50"
                  >
                    <div className="flex-grow min-w-0">
                      <Text className="text-gray-800 block truncate text-sm font-medium">
                        {item.product.product_name}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        {item.quantity} × Rp{" "}
                        {Number(item.product.price).toLocaleString("id-ID")}
                      </Text>
                    </div>
                    <Text className="text-gray-800 whitespace-nowrap text-sm font-medium">
                      Rp{" "}
                      {(
                        item.quantity * Number(item.product.price)
                      ).toLocaleString("id-ID")}
                    </Text>
                  </div>
                ))}
              </div>

              <Divider className="my-5 border-gray-200" />

              {/* Total */}
              <div className="bg-red-50 rounded-md p-4 border border-red-100">
                <div className="flex justify-between items-center">
                  <Text className="text-gray-700 font-medium">
                    Total Amount
                  </Text>
                  <Title level={4} className="!mb-0 !text-red-600">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </Title>
                </div>
                <div className="mt-1">
                  <Text className="text-gray-600 text-xs">
                    Including all taxes and fees
                  </Text>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-100">
                <div className="flex items-start space-x-2">
                  <SafetyOutlined className="text-green-600 mt-0.5 text-sm" />
                  <div>
                    <Text className="text-green-800 text-xs font-medium block">
                      Secure Payment
                    </Text>
                    <Text className="text-green-700 text-xs">
                      Bank-level encryption
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default function CheckoutPage() {
  return (
    <App>
      <CheckoutPageContent />
    </App>
  );
}
