'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin, Empty, Button, Typography, message, App, Card, Form, Input } from 'antd';
import { getCartItems, type CartItem } from '../../../lib/services/cartService';
import { createOrder } from '../../../lib/services/orderService';
import Image from 'next/image';

const { TextArea } = Input;

const CheckoutPageContent = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { message: messageApi } = App.useApp();
    const router = useRouter();
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true);
            try {
                const items = await getCartItems();
                if (items.length === 0) {
                    messageApi.warning("Your cart is empty. Redirecting to shop...");
                    setTimeout(() => router.push('/shop'), 2000);
                } else {
                    setCartItems(items);
                }
            } catch (error) {
                messageApi.error("Failed to load your cart.");
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [router, messageApi]);

    const onFinish = async (values: { shippingAddress: string }) => {
        setIsSubmitting(true);
        try {
            const newOrder = await createOrder(values.shippingAddress);
            messageApi.success(`Order #${newOrder.id_order} created successfully!`);
            // Arahkan ke halaman detail pesanan atau halaman "terima kasih"
            router.push(`/orders/${newOrder.id_order}`);
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Failed to create order.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * parseInt(item.product.price)), 0);

    if (loading) {
        return <div className="flex justify-center items-center h-96"><Spin size="large" /></div>;
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
                                    Place Order
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>

                {/* Kolom Kanan: Ringkasan Pesanan */}
                <div>
                    <Card title="Order Summary">
                        <div className="space-y-4">
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