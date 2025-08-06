"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Spin,
  Empty,
  Button,
  Typography,
  message,
  App,
  Card,
  Form,
  Input,
  Checkbox,
} from "antd";
import Image from "next/image";
import { AxiosError } from "axios";

import { getCartItems, type CartItem } from "../../../lib/services/cartService";
import { createOrder } from "../../../lib/services/orderService";
import { createPaymentTransaction } from "../../../lib/services/paymentService";

const { TextArea } = Input;

const CheckoutPageContent = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message: messageApi } = App.useApp();
  const router = useRouter();
  const [form] = Form.useForm();

  const fetchCart = useCallback(async () => {
    try {
      const items = await getCartItems();
      if (items.length === 0) {
        messageApi.warning("Your cart is empty. Redirecting to the shop...");
        setTimeout(() => router.push("/shop"), 2000);
      } else {
        setCartItems(items);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
      messageApi.error("Failed to load your cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [messageApi, router]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = React.useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item.product.price) || 0;
      return sum + item.quantity * price;
    }, 0);
  }, [cartItems]);

  const onFinish = async (values: {
    fullName: string;
    phoneNumber: string;
    address: string;
    confirm: boolean;
  }) => {
    setIsSubmitting(true);
    try {
      const newOrder = await createOrder(values);
      const transaction = await createPaymentTransaction(newOrder.id_order);
      if (transaction.redirect_url) {
        messageApi.success("Redirecting to payment page...");
        window.location.href = transaction.redirect_url;
      } else {
        throw new Error("Payment gateway did not provide a redirect URL.");
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      messageApi.error("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" tip="Loading Your Cart..." />
      </div>
    );
  }

  if (!loading && cartItems.length === 0) {
    return (
      <div className="text-center p-10 mt-10">
        <Empty
          description={<Typography.Text>Your cart is empty.</Typography.Text>}
        >
          <Button type="primary" onClick={() => router.push("/shop")}>
            Continue Shopping
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10 mt-10">
      <Typography.Title level={2} className="mb-8">
        Checkout
      </Typography.Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kolom Kiri: Form Checkout */}
        <Card title="Shipping Information">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[
                { required: true, message: "Please enter your full name" },
              ]}
            >
              <Input placeholder="e.g. Rasya Falqi" />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please enter your phone number" },
                {
                  pattern: /^[0-9]{10,15}$/,
                  message: "Invalid phone number format",
                },
              ]}
            >
              <Input placeholder="e.g. 081234567890" />
            </Form.Item>

            <Form.Item
              label="Full Shipping Address"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please enter your shipping address",
                },
                {
                  min: 10,
                  max: 300,
                  message: "Address must be 10–300 characters",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="e.g., Jl. Jenderal Sudirman No. 123, Jakarta..."
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject("Please confirm your shipping info"),
                },
              ]}
            >
              <Checkbox>I confirm that my address is correct.</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                block
                size="large"
              >
                {isSubmitting ? "Processing..." : "Proceed to Payment"}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Kolom Kanan: Ringkasan Order */}
        <Card title="Order Summary">
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {cartItems.map((item) => {
              const price = Number(item.product.price) || 0;
              return (
                <div key={item.id_cart} className="flex items-center gap-4">
                  <Image
                    src={item.product.images?.[0]?.url || "/placeholder.png"}
                    alt={item.product.product_name}
                    width={64}
                    height={64}
                    className="rounded-md object-cover bg-gray-100"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-sm">
                      {item.product.product_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × Rp {price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <p className="font-semibold">
                    Rp {(item.quantity * price).toLocaleString("id-ID")}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </Card>
      </div>
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
