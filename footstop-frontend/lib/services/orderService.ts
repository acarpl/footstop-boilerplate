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
  order_details: { product: { images: Image[] } }[];
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
