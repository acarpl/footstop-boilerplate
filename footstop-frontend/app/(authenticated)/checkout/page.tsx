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
  Card,
  Form,
  Input,
} from "antd";
import Image from "next/image";
import { AxiosError } from "axios";

import { getCartItems, type CartItem } from "../../../lib/services/cartService";
import { createOrder } from "../../../lib/services/orderService";
import { createPaymentTransaction } from "../../../lib/services/paymentService";

import useMidtrans from "../../../hooks/useMidtrans";

const { TextArea } = Input;

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
      <div id="snap-container"></div>

      <Typography.Title level={2} className="mb-8">
        Checkout
      </Typography.Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Shipping Information">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={isSubmitting}
          >
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="John Doe" />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true }]}
            >
              <Input placeholder="08xxxxxxxxxx" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Full Shipping Address"
              rules={[{ required: true }]}
            >
              <TextArea rows={4} placeholder="Alamat lengkap..." />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={isSubmitting}
                disabled={!isSnapReady}
              >
                {isSubmitting
                  ? "Processing..."
                  : isSnapReady
                  ? "Proceed to Payment"
                  : "Loading Gateway..."}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="Order Summary">
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {cartItems.map((item) => (
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
                    {item.quantity} × Rp{" "}
                    {Number(item.product.price).toLocaleString("id-ID")}
                  </p>
                </div>
                <p className="font-semibold">
                  Rp{" "}
                  {(item.quantity * Number(item.product.price)).toLocaleString(
                    "id-ID"
                  )}
                </p>
              </div>
            ))}
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
