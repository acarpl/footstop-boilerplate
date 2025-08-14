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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center">
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Title
            level={1}
            className="!text-4xl !font-bold !text-gray-800 !mb-4"
          >
            <CreditCardOutlined className="mr-3 text-blue-600" />
            Secure Checkout
          </Title>
          <Text className="text-gray-600 text-lg">
            Complete your purchase in just a few simple steps
          </Text>
          <div className="mt-6 flex justify-center">
            <Space size="large">
              <Tag icon={<SafetyOutlined />} color="green">
                SSL Secured
              </Tag>
              <Tag icon={<CheckCircleOutlined />} color="blue">
                Fast Processing
              </Tag>
            </Space>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Shipping Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-0">
              <div className="flex items-center mb-8">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <UserOutlined className="text-blue-600 text-xl" />
                </div>
                <div>
                  <Title level={3} className="!mb-1 !text-gray-800">
                    Shipping Information
                  </Title>
                  <Text className="text-gray-500">
                    Please provide your delivery details
                  </Text>
                </div>
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                disabled={isSubmitting}
                className="space-y-2"
              >
                <Form.Item
                  name="fullName"
                  label={
                    <Text strong className="text-gray-700">
                      Full Name
                    </Text>
                  }
                  rules={[
                    { required: true, message: "Please enter your full name" },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Enter your complete name"
                    prefix={<UserOutlined className="text-gray-400" />}
                    className="rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500"
                  />
                </Form.Item>

                <Form.Item
                  name="phoneNumber"
                  label={
                    <Text strong className="text-gray-700">
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
                    className="rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500"
                  />
                </Form.Item>

                <Form.Item
                  name="address"
                  label={
                    <Text strong className="text-gray-700">
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
                    className="rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 resize-none"
                  />
                </Form.Item>

                <div className="pt-6">
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={isSubmitting}
                    disabled={!isSnapReady}
                    className="!h-14 !text-lg !font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    icon={!isSubmitting && <CreditCardOutlined />}
                  >
                    {isSubmitting
                      ? "Processing Your Order..."
                      : isSnapReady
                      ? "Proceed to Secure Payment"
                      : "Loading Payment Gateway..."}
                  </Button>

                  <div className="mt-4 text-center">
                    <Text className="text-gray-500 text-sm">
                      🔒 Your payment information is encrypted and secure
                    </Text>
                  </div>
                </div>
              </Form>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-0 sticky top-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full p-3 mr-4">
                    <ShoppingCartOutlined className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <Title level={3} className="!mb-1 !text-gray-800">
                      Order Summary
                    </Title>
                    <Text className="text-gray-500">Review your items</Text>
                  </div>
                </div>
                <Badge
                  count={totalItems}
                  className="bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{ backgroundColor: "transparent" }}
                />
              </div>

              {/* Cart Items */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, index) => (
                  <div key={item.id_cart}>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                      <div className="relative">
                        <Image
                          src={
                            item.product.images?.[0]?.url || "/placeholder.png"
                          }
                          alt={item.product.product_name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover bg-gray-200 shadow-sm"
                        />
                        <Badge
                          count={item.quantity}
                          size="small"
                          className="absolute -top-2 -right-2"
                          style={{ backgroundColor: "#1890ff" }}
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <Text strong className="text-gray-800 block truncate">
                          {item.product.product_name}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                          {item.quantity} × Rp{" "}
                          {Number(item.product.price).toLocaleString("id-ID")}
                        </Text>
                      </div>
                      <Text strong className="text-gray-800 whitespace-nowrap">
                        Rp{" "}
                        {(
                          item.quantity * Number(item.product.price)
                        ).toLocaleString("id-ID")}
                      </Text>
                    </div>
                    {index < cartItems.length - 1 && <div className="h-2" />}
                  </div>
                ))}
              </div>

              <Divider className="my-6 border-gray-200" />

              {/* Total */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <div className="flex justify-between items-center">
                  <Title level={3} className="!mb-0 !text-gray-800">
                    Total Amount
                  </Title>
                  <Title level={2} className="!mb-0 !text-blue-600">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </Title>
                </div>
                <div className="mt-2">
                  <Text className="text-gray-600">
                    Including all taxes and fees
                  </Text>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-start space-x-3">
                  <SafetyOutlined className="text-green-600 mt-0.5" />
                  <div>
                    <Text strong className="text-green-800 block">
                      Secure Payment
                    </Text>
                    <Text className="text-green-700 text-sm">
                      Your transaction is protected with bank-level encryption
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="snap-container" className="mt-8"></div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
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
