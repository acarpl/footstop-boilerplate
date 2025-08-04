'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin, Empty, Button, Typography, message, App, Card, Form, Input } from 'antd';
import Image from 'next/image';

// Impor dari service yang relevan
import { getCartItems, type CartItem } from '../../../lib/services/cartService';
import { createOrder, createPaymentTransaction } from '../../../lib/services/orderService';

const { TextArea } = Input;

const CheckoutPageContent = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message: messageApi } = App.useApp();
  const router = useRouter();
  const [form] = Form.useForm();

  // useEffect untuk mengambil data keranjang saat halaman dimuat
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const items = await getCartItems();
        if (items.length === 0) {
          // Jika keranjang kosong, beri notifikasi dan arahkan kembali ke toko
          messageApi.warning("Your cart is empty. Redirecting to shop...", 2.5);
          setTimeout(() => router.push('/shop'), 2500);
        } else {
          setCartItems(items);
        }
      } catch (error) {
        messageApi.error("Failed to load your cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
    // Dependensi di bawah memastikan ini hanya berjalan sekali saat komponen dimuat.
    // Menghapus router dan messageApi untuk mencegah loop yang tidak perlu.
  }, []); 

  // Fungsi yang dipanggil saat form alamat disubmit
  const onFinish = async (values: { shippingAddress: string }) => {
    setIsSubmitting(true);
    try {
      // Langkah 1: Buat pesanan di database kita, dapatkan ID pesanan
      const newOrder = await createOrder(values.shippingAddress);
      messageApi.loading({ content: 'Order created, creating payment session...', key: 'payment' });

      // Langkah 2: Gunakan ID pesanan untuk membuat sesi pembayaran di Midtrans
      const transaction = await createPaymentTransaction(newOrder.orderId);

      // Langkah 3: Arahkan pengguna ke URL pembayaran dari Midtrans
      if (transaction.redirect_url) {
        messageApi.success({ content: 'Redirecting to payment page...', key: 'payment', duration: 2 });
        // Menggunakan window.location.href untuk navigasi ke situs eksternal
        window.location.href = transaction.redirect_url;
      } else {
        // Ini adalah kasus darurat jika Midtrans tidak mengembalikan URL
        throw new Error("Payment gateway did not provide a redirect URL.");
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Checkout failed. Please try again.";
      messageApi.error({ content: errorMessage, key: 'payment', duration: 3 });
      setIsSubmitting(false); // Hentikan loading hanya jika terjadi error
    }
  };

  // Hitung subtotal. `reduce` akan mengembalikan 0 jika cartItems kosong.
  const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * parseInt(item.product.price)), 0);

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Spin size="large" /></div>;
  }

  // Jika setelah loading keranjang tetap kosong, jangan render apa pun
  if (cartItems.length === 0) {
    return <div className="text-center p-10"><Empty description="Your cart is empty." /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10 mt-10">
      <Typography.Title level={2} className="mb-8">Checkout</Typography.Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kolom Kiri: Alamat Pengiriman */}
        <div>
          <Card title="Shipping Information">
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Full Shipping Address"
                name="shippingAddress"
                rules={[{ required: true, message: 'Please enter your shipping address!' }]}
              >
                <TextArea rows={4} placeholder="e.g., Jl. Jenderal Sudirman No. 123, Jakarta Pusat, DKI Jakarta, 10210" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={isSubmitting} block size="large">
                  Proceed to Payment
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>

        {/* Kolom Kanan: Ringkasan Pesanan */}
        <div>
          <Card title="Order Summary">
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {cartItems.map(item => (
                <div key={item.id_cart} className="flex items-center gap-4">
                  <Image src={item.product.images?.[0]?.url || '/placeholder.png'} alt={item.product.product_name} width={64} height={64} className="rounded-md object-contain" />
                  <div className="flex-grow">
                    <p className="font-semibold">{item.product.product_name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} x Rp {parseInt(item.product.price).toLocaleString()}</p>
                  </div>
                  <p className="font-semibold">Rp {(item.quantity * parseInt(item.product.price)).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rp {subtotal.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>
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