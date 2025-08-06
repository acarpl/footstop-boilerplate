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

// Import services
import { getCartItems, type CartItem } from "../../../lib/services/cartService";
import { createOrder } from "../../../lib/services/orderService";
import { createPaymentTransaction } from "../../../lib/services/paymentService";

// Import hook kustom untuk Midtrans
import useMidtrans from "../../../hooks/useMidtrans"; // Sesuaikan path jika perlu

const { TextArea } = Input;

const CheckoutPageContent = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message: messageApi } = App.useApp();
  const router = useRouter();
  const [form] = Form.useForm();

  // Gunakan hook Midtrans
  const { pay, isSnapReady } = useMidtrans();

  // Mengambil data keranjang saat komponen dimuat
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

  // Menghitung subtotal dengan useMemo untuk optimisasi
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item.product.price) || 0;
      return sum + item.quantity * price;
    }, 0);
  }, [cartItems]);

  // Fungsi utama saat form di-submit
  const onFinish = async (values: {
    address: string;
    fullName: string;
    phoneNumber: string;
  }) => {
    setIsSubmitting(true);
    const checkoutMessageKey = "checkout_process";

    try {
      // Langkah 1: Buat pesanan di database kita
      messageApi.loading({
        content: "Creating your order...",
        key: checkoutMessageKey,
      });
      const newOrder = await createOrder(values);

      // Langkah 2: Buat sesi pembayaran di Midtrans
      messageApi.loading({
        content: "Preparing payment gateway...",
        key: checkoutMessageKey,
      });
      const transaction = await createPaymentTransaction(newOrder.id_order);

      if (!transaction.token) {
        throw new Error("Failed to get payment token from the server.");
      }

      // Langkah 3: Buka pop-up pembayaran Midtrans
      messageApi.destroy(checkoutMessageKey); // Tutup pesan loading
      pay(transaction.token, {
        onSuccess: (result: any) => {
          message.success("Payment successful! Thank you for your order.");
          router.push(`/orders/${newOrder.id_order}`);
        },
        onPending: (result: any) => {
          message.info("Your payment is pending. We will update you soon.");
          router.push(`/orders/${newOrder.id_order}`);
        },
        onError: (result: any) => {
          message.error("Payment failed. Please try again.");
        },
        onClose: () => {
          message.warning("You closed the payment popup without finishing.");
        },
      });
    } catch (error) {
      console.error("Checkout error:", error);
      let errorMessage = "Checkout process failed. Please try again.";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      messageApi.error({
        content: errorMessage,
        key: checkoutMessageKey,
        duration: 4,
      });
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
      {/* Div ini WAJIB ada sebagai "jangkar" untuk pop-up Midtrans */}
      <div id="snap-container"></div>

      <Typography.Title level={2} className="mb-8">
        Checkout
      </Typography.Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kolom Kiri: Form Checkout */}
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
              <Input placeholder="e.g., John Doe" />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true }]}
            >
              <Input placeholder="e.g., 081234567890" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Full Shipping Address"
              rules={[{ required: true }]}
            >
              <TextArea
                rows={4}
                placeholder="e.g., Jl. Jenderal Sudirman No. 123, Jakarta..."
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                disabled={!isSnapReady}
                block
                size="large"
              >
                {isSubmitting
                  ? "Processing..."
                  : isSnapReady
                  ? "Proceed to Payment"
                  : "Loading Payment Gateway..."}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Kolom Kanan: Ringkasan Pesanan */}
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

// Bungkus dengan <App> untuk menyediakan konteks notifikasi
export default function CheckoutPage() {
  return (
    <App>
      <CheckoutPageContent />
    </App>
  );
}
