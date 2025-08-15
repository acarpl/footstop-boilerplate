// lib/services/orderService.ts

import apiClient from "../apiClient";

// --- Tipe Data untuk Order ---
// Mendefinisikan tipe data di service adalah praktik yang baik
// agar bisa digunakan kembali di komponen lain.

interface Image {
  id_gambar: number;
  url: string;
}

interface Product {
  id_product: number;
  product_name: string;
  images: Image[];
}

interface OrderDetail {
  id_order_details: number;
  quantity: number;
  price_per_unit: string;
  subtotal: string;
  size: string;
  product: Product;
}

// Tipe untuk data ringkasan pesanan (untuk daftar riwayat)
export interface OrderSummary {
  id_order: number;
  order_date: string;
  total_price: string;
  status_pengiriman: string;
  // Mungkin hanya gambar produk pertama untuk ringkasan
  orderDetails: { product: { images: Image[] } }[];
}

// Tipe untuk data detail pesanan lengkap
export interface Order extends OrderSummary {
  address: string;
  fullName: string;
  phoneNumber: string;
  order_details: OrderDetail[]; // Timpa dengan tipe yang lebih detail
}

// Tipe untuk payload yang dikirim saat membuat pesanan
interface CreateOrderPayload {
  address: string;
  fullName: string;
  phoneNumber: string;
}

/**
 * [USER] Membuat pesanan baru dari item di keranjang.
 * Dipanggil dari halaman Checkout.
 * @param {CreateOrderPayload} orderData - Data lengkap dari form checkout.
 * @returns {Promise<Order>} Data pesanan yang baru saja dibuat.
 */
export const createOrder = async (
  orderData: CreateOrderPayload
): Promise<Order> => {
  try {
    console.log("Payload being sent to API:", orderData);
    const response = await apiClient.post("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Service Error: Failed to create order.", error);
    throw error;
  }
};

/**
 * [USER] Mengambil daftar riwayat pesanan milik pengguna yang sedang login.
 * Dipanggil dari halaman Order History.
 * @returns {Promise<OrderSummary[]>} Daftar pesanan.
 */
export const getMyOrders = async (): Promise<OrderSummary[]> => {
  try {
    const response = await apiClient.get("/orders");
    return response.data;
  } catch (error) {
    console.error("Service Error: Failed to fetch user orders.", error);
    throw error;
  }
};

/**
 * [USER] Mengambil detail lengkap dari satu pesanan spesifik.
 * Dipanggil dari halaman Order Detail.
 * @param {number} orderId - ID dari pesanan yang akan dilihat.
 * @returns {Promise<Order>} Data detail pesanan lengkap.
 */
export const getMyOrderDetails = async (
  orderId: number | string
): Promise<Order> => {
  try {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Service Error: Failed to fetch details for order #${orderId}.`,
      error
    );
    throw error;
  }
};

export const getOrderDetails = async (
  orderId: string | number
): Promise<Order> => {
  try {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Failed to fetch order details for order #${orderId}:`,
      error
    );
    throw error;
  }
};

/**
 * Get specific order detail item by its ID
 * Useful if you want to show just one item detail
 */
export const getOrderDetailItem = async (
  orderDetailId: number
): Promise<OrderDetail> => {
  try {
    const response = await apiClient.get(`/order-details/${orderDetailId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Failed to fetch order detail item #${orderDetailId}:`,
      error
    );
    throw error;
  }
};

/**
 * Get all order details for a specific order
 * Returns only the order details without order info
 */
export const getOrderDetailsByOrderId = async (
  orderId: string | number
): Promise<OrderDetail[]> => {
  try {
    const response = await apiClient.get(`/orders/${orderId}/details`);
    return response.data;
  } catch (error) {
    console.error(
      `Failed to fetch order details for order #${orderId}:`,
      error
    );
    throw error;
  }
};

/**
 * Calculate order totals from order details
 */
export const calculateOrderTotals = (orderDetails: OrderDetail[]) => {
  const totalItems = orderDetails.reduce(
    (sum, detail) => sum + detail.quantity,
    0
  );
  const totalAmount = orderDetails.reduce(
    (sum, detail) => sum + parseFloat(detail.subtotal),
    0
  );
  const uniqueProducts = orderDetails.length;

  return {
    totalItems,
    totalAmount,
    uniqueProducts,
  };
};

/**
 * Group order details by product (if there are multiple sizes of same product)
 */
export const groupOrderDetailsByProduct = (orderDetails: OrderDetail[]) => {
  const grouped = orderDetails.reduce(
    (acc, detail) => {
      const productId = detail.product.id_product;

      if (!acc[productId]) {
        acc[productId] = {
          product: detail.product,
          details: [],
          totalQuantity: 0,
          totalSubtotal: 0,
        };
      }

      acc[productId].details.push(detail);
      acc[productId].totalQuantity += detail.quantity;
      acc[productId].totalSubtotal += parseFloat(detail.subtotal);

      return acc;
    },
    {} as Record<
      number,
      {
        product: Product;
        details: OrderDetail[];
        totalQuantity: number;
        totalSubtotal: number;
      }
    >
  );

  return Object.values(grouped);
};

/**
 * Format currency helper
 */
export const formatCurrency = (amount: number): string => {
  return `Rp ${amount.toLocaleString("id-ID")}`;
};

/**
 * Validate order details data
 */
export const validateOrderDetails = (orderDetails: OrderDetail[]): boolean => {
  return orderDetails.every(
    (detail) =>
      detail.quantity > 0 &&
      parseFloat(detail.price_per_unit) > 0 &&
      parseFloat(detail.subtotal) > 0 &&
      detail.product &&
      detail.product.id_product
  );
};
