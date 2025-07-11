'use client';

import React, { useEffect, useState } from 'react';
import { getCartItems, removeCartItem, updateCartItemQuantity } from '../../../lib/services/cartService';
import { List, Button, Typography, Spin, Empty, InputNumber, message } from 'antd';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      message.error("Could not load your cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (id_cart: any) => {
    try {
      await removeCartItem(id_cart);
      // Refresh data keranjang setelah menghapus
      fetchCart(); 
      message.success("Item removed from cart.");
    } catch (error) {
      message.error("Failed to remove item.");
    }
  };
  
  const handleQuantityChange = async (id_cart: any, quantity: number) => {
    if (quantity < 1) return;
    try {
        await updateCartItemQuantity(id_cart, quantity);
        fetchCart(); // Refresh data
    } catch (error) {
        message.error("Failed to update quantity.");
    }
  };

  if (loading) {
    return <div className="text-center p-10"><Spin size="large" /></div>;
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
      <Typography.Title level={2}>Your Shopping Cart</Typography.Title>
      {cartItems.length === 0 ? (
        <Empty description="Your cart is empty.">
          <Link href="/shop">
            <Button type="primary">Start Shopping</Button>
          </Link>
        </Empty>
      ) : (
        <>
          <List
            itemLayout="horizontal"
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button 
                    type="text" 
                    danger 
                    icon={<Trash2 size={16} />} 
                    onClick={() => handleRemove(item.id_cart)}
                  />
                ]}
              >
                <List.Item.Meta
                  avatar={<img src={item.product?.images?.[0]?.url || '/placeholder.png'} alt={item.product.productName} width={80} />}
                  title={<Link href={`/products/${item.product.idProduct}`}>{item.product.productName}</Link>}
                  description={`Size: ${item.size || 'N/A'} - Price: Rp ${item.product.price.toLocaleString()}`}
                />
                <div className="flex items-center gap-4">
                  <InputNumber 
                    min={1} 
                    defaultValue={item.quantity} 
                    onChange={(value) => handleQuantityChange(item.id_cart, value)}
                  />
                  <Typography.Text strong>
                    Rp {(item.quantity * item.product.price).toLocaleString()}
                  </Typography.Text>
                </div>
              </List.Item>
            )}
          />
          <div className="text-right mt-8">
            <Typography.Title level={3}>Total: Rp {totalPrice.toLocaleString()}</Typography.Title>
            <Link href="/checkout">
              <Button type="primary" size="large">Proceed to Checkout</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}