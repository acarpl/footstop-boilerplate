'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin, Empty, Button, Typography, message, App } from 'antd';
import { Trash } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image'; // 1. PASTIKAN IMAGE DIIMPOR DARI 'next/image'

import { 
    getCartItems, 
    updateCartItemQuantity, 
    removeCartItem,
    type CartItem
} from '../../../lib/services/cartService'; // Sesuaikan path jika perlu

const CartPageContent = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { message: messageApi } = App.useApp();
    const router = useRouter();

    const fetchCart = async () => {
        setLoading(true);
        try {
            const items = await getCartItems();
            setCartItems(items);
        } catch (error) {
            messageApi.error("Failed to load your cart. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleQuantityChange = async (idCart: number, currentQuantity: number, change: number) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return;

        try {
            await updateCartItemQuantity(idCart, newQuantity);
            setCartItems(prevItems => 
                prevItems.map(item => 
                    item.id_cart === idCart ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            messageApi.error("Failed to update quantity.");
        }
    };

    const handleRemove = async (idCart: number) => {
        try {
            await removeCartItem(idCart);
            messageApi.success("Item removed from cart.");
            setCartItems(prevItems => prevItems.filter(item => item.id_cart !== idCart));
        } catch (error) {
            messageApi.error("Failed to remove item.");
        }
    };
    
    const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * parseInt(item.product.price)), 0);
    const total = subtotal;

    if (loading) {
        return <div className="flex justify-center items-center h-96"><Spin size="large" /></div>;
    }

    return (
        <div className="flex-1 p-4 md:p-10 mt-10">
            <Typography.Title level={2} className="text-3xl font-bold text-red-500 mb-8">YOUR CART</Typography.Title>
            
            {cartItems.length === 0 ? (
                <Empty description="Your cart is empty.">
                    <Link href="/shop"><Button type="primary">Continue Shopping</Button></Link>
                </Empty>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Daftar Produk */}
                    <div className="lg:col-span-2 flex flex-col space-y-5">
                        {cartItems.map((item) => (
                            <div key={item.id_cart} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                                <div className="flex items-center space-x-4 flex-grow">
                                    <div className="w-20 h-20 flex-shrink-0">
                                      <Image
                                          // 2. Akses URL gambar pertama dari array 'images'
                                          src={item.product.images?.[0]?.url || '/placeholder.png'}
                                          alt={item.product.product_name}
                                          width={80}
                                          height={80}
                                          className="w-full h-full object-contain rounded-md"
                                      />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold">{item.product.product_name}</p>
                                        <p className="text-sm text-gray-500">Size: {item.size || 'N/A'}</p>
                                        <p className="font-bold mt-1">Rp {parseInt(item.product.price).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 flex-shrink-0">
                                    <button onClick={() => handleQuantityChange(item.id_cart, item.quantity, -1)} className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center font-bold">-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item.id_cart, item.quantity, 1)} className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center font-bold">+</button>
                                    <button onClick={() => handleRemove(item.id_cart)} className="text-red-500 hover:text-red-700 text-xl ml-4"><Trash /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Ringkasan Pesanan */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow h-fit">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>Rp {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-4 border-t">
                                    <span>Total</span>
                                    <span>Rp {total.toLocaleString()}</span>
                                </div>
                            </div>
                            <Link href="/checkout">
                                <Button type="primary" block className="mt-5 h-12 text-lg">Go to Checkout →</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Bungkus dengan <App> untuk konteks message
export default function CartPage() {
    return (
        <App>
            <CartPageContent />
        </App>
    );
}