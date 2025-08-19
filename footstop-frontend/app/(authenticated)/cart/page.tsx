"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Spin, Empty, Button, Typography, App } from "antd";
import { Trash } from "lucide-react";
import Link from "next/link";

import {
  getCartItems,
  updateCartItemQuantity,
  removeCartItem,
  type CartItem,
} from "../../../lib/services/cartService";

// SafeImage Component untuk handle image loading
interface SafeImageProps {
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(!!src);

  useEffect(() => {
    if (src) {
      setImageError(false);
      setImageLoading(true);

      // Test image loading
      const img = new window.Image();
      img.onload = () => setImageLoading(false);
      img.onerror = () => {
        console.warn(`Failed to load cart image: ${src}`);
        setImageError(true);
        setImageLoading(false);
      };
      img.src = src;
    }
  }, [src]);

  if (!src || imageError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <div className="text-gray-400 text-xs">No Image</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
          <Spin size="small" />
        </div>
      )}
      <div
        className="w-full h-full bg-cover bg-center bg-no-repeat rounded-md"
        style={{
          backgroundImage: `url(${src})`,
          display: imageLoading ? "none" : "block",
        }}
        role="img"
        aria-label={alt}
      />
    </div>
  );
};

// Cart Item Component
interface CartItemComponentProps {
  item: CartItem;
  onQuantityChange: (
    idCart: number,
    currentQuantity: number,
    change: number
  ) => void;
  onRemove: (idCart: number) => void;
}

const CartItemComponent: React.FC<CartItemComponentProps> = React.memo(
  ({ item, onQuantityChange, onRemove }) => {
    const imageUrl = item.product.images?.[0]?.url;

    // Debug logging
    console.log(`Cart item ${item.id_cart} image URL:`, imageUrl);

    return (
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4 flex-grow">
          <div className="w-20 h-20 flex-shrink-0">
            <SafeImage
              src={imageUrl}
              alt={item.product.product_name}
              width={80}
              height={80}
              className="w-full h-full"
            />
          </div>
          <div className="flex-grow">
            <p className="font-semibold">{item.product.product_name}</p>
            <p className="text-sm text-gray-500">Size: {item.size || "N/A"}</p>
            <p className="font-bold mt-1">
              Rp {parseInt(item.product.price).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0">
          <button
            onClick={() => onQuantityChange(item.id_cart, item.quantity, -1)}
            className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center font-bold hover:bg-gray-300 transition-colors"
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="min-w-[2rem] text-center font-medium">
            {item.quantity}
          </span>
          <button
            onClick={() => onQuantityChange(item.id_cart, item.quantity, 1)}
            className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center font-bold hover:bg-gray-300 transition-colors"
          >
            +
          </button>
          <button
            onClick={() => onRemove(item.id_cart)}
            className="text-red-500 hover:text-red-700 text-xl ml-4 p-1 hover:bg-red-50 rounded transition-colors"
            title="Remove item"
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
    );
  }
);

CartItemComponent.displayName = "CartItemComponent";

// Order Summary Component
interface OrderSummaryProps {
  subtotal: number;
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = React.memo(
  ({ subtotal, total }) => (
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
        <Button type="primary" block className="mt-5 h-12 text-lg">
          Go to Checkout →
        </Button>
      </Link>
    </div>
  )
);

OrderSummary.displayName = "OrderSummary";

// Custom Hook for Cart Management
const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { message: messageApi } = App.useApp();

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const items = await getCartItems();
      console.log("Cart items fetched:", items); // Debug log
      setCartItems(items);
    } catch (error) {
      messageApi.error("Failed to load your cart. Please try again.");
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  const handleQuantityChange = useCallback(
    async (idCart: number, currentQuantity: number, change: number) => {
      const newQuantity = currentQuantity + change;
      if (newQuantity < 1) return;

      try {
        await updateCartItemQuantity(idCart, newQuantity);
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id_cart === idCart ? { ...item, quantity: newQuantity } : item
          )
        );
        messageApi.success("Quantity updated");
      } catch (error) {
        messageApi.error("Failed to update quantity.");
        console.error("Error updating quantity:", error);
      }
    },
    [messageApi]
  );

  const handleRemove = useCallback(
    async (idCart: number) => {
      try {
        await removeCartItem(idCart);
        messageApi.success("Item removed from cart.");
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id_cart !== idCart)
        );
      } catch (error) {
        messageApi.error("Failed to remove item.");
        console.error("Error removing item:", error);
      }
    },
    [messageApi]
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * parseInt(item.product.price),
    0
  );

  return {
    cartItems,
    loading,
    subtotal,
    total: subtotal, // You can add shipping, tax, etc. here
    fetchCart,
    handleQuantityChange,
    handleRemove,
  };
};

// Main Cart Component
const CartPageContent = () => {
  const {
    cartItems,
    loading,
    subtotal,
    total,
    fetchCart,
    handleQuantityChange,
    handleRemove,
  } = useCart();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" tip="Loading your cart..." />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-10 mt-10">
      <div className="flex justify-between items-center mb-8">
        <Typography.Title level={2} className="text-3xl font-bold text-red-500">
          YOUR CART
        </Typography.Title>
        <Button onClick={fetchCart} loading={loading}>
          Refresh
        </Button>
      </div>

      {cartItems.length === 0 ? (
        <Empty
          description="Your cart is empty."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Link href="/shop">
            <Button type="primary" size="large">
              Continue Shopping
            </Button>
          </Link>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product List */}
          <div className="lg:col-span-2 flex flex-col space-y-5">
            {cartItems.map((item) => (
              <CartItemComponent
                key={item.id_cart}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary subtotal={subtotal} total={total} />
          </div>
        </div>
      )}
    </div>
  );
};

// Export with App wrapper
export default function CartPage() {
  return (
    <App>
      <CartPageContent />
    </App>
  );
}
