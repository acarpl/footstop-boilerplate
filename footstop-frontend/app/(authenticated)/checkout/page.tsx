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
} from "antd";
import { getCartItems, type CartItem } from "../../../lib/services/cartService";
import { createOrder } from "../../../lib/services/orderService";
import { createPaymentTransaction } from "../../../lib/services/paymentService"; // Pastikan path ini benar
import Image from "next/image";
import { AxiosError } from "axios";

const { TextArea } = Input;

const CheckoutPageContent = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message: messageApi } = App.useApp();
  const router = useRouter();
  const [form] = Form.useForm();

  // Menggunakan useCallback agar fungsi tidak dibuat ulang di setiap render
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
  }, [messageApi, router]); // Dependensi stabil

  useEffect(() => {
    fetchCart();
  }, [fetchCart]); // Panggil fetchCart saat komponen dimuat

  const onFinish = async (values: { shippingAddress: string }) => {
    setIsSubmitting(true);
    const checkoutMessageKey = "checkout_process";

    try {
      messageApi.loading({
        content: "Creating your order...",
        key: checkoutMessageKey,
      });
      const newOrder = await createOrder(values.shippingAddress);

      messageApi.loading({
        content: "Preparing payment gateway...",
        key: checkoutMessageKey,
      });
      const transaction = await createPaymentTransaction(newOrder.id_order);

      if (!transaction.redirect_url) {
        throw new Error("Payment gateway did not provide a redirect URL.");
      }

      messageApi.success({
        content: "Redirecting to payment page...",
        key: checkoutMessageKey,
      });

      // Redirect setelah jeda singkat
      setTimeout(() => {
        window.location.href = transaction.redirect_url;
      }, 1000);
    } catch (error) {
      console.error("Checkout error:", error);

      // Penanganan error yang lebih bersih
      let errorMessage = "Checkout process failed. Please try again.";
      if (error instanceof AxiosError) {
        // Ambil pesan dari backend jika ada, jika tidak, gunakan pesan default
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      messageApi.error({
        content: errorMessage,
        key: checkoutMessageKey,
        duration: 4,
      });
      setIsSubmitting(false); // Pastikan loading berhenti jika error
    }
  };

  // Kalkulasi harga menggunakan useMemo agar tidak dihitung ulang di setiap render
  const subtotal = React.useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item.product.price) || 0;
      return sum + item.quantity * price;
    }, 0);
  }, [cartItems]);

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
        {/* Kolom Kiri: Alamat Pengiriman */}
        <Card title="Shipping Information">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Full Shipping Address"
              name="shippingAddress"
              rules={[
                {
                  required: true,
                  message: "Please enter your shipping address!",
                },
              ]}
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
                block
                size="large"
              >
                {isSubmitting ? "Processing..." : "Proceed to Payment"}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Kolom Kanan: Ringkasan Pesanan */}
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
