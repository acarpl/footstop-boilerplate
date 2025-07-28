// lib/services/adminService.ts

import apiClient from '../apiClient';

/**
 * Mengambil statistik utama untuk ditampilkan di dashboard admin.
 * @returns {Promise<object>} Promise yang resolve dengan data statistik.
 */
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    throw error;
  }
};

/**
 * Mengambil daftar semua pengguna dengan paginasi.
 * @param {object} params - Query params, contoh: { page: 1, limit: 10 }.
 * @returns {Promise<object>} Promise yang resolve dengan daftar pengguna dan info paginasi.
 */
export const getAllUsers = async (params: any) => {
  try {
    const response = await apiClient.get('/users', { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

/**
 * Mengambil daftar semua pesanan dengan paginasi dan filter.
 * @param {object} params - Query params, contoh: { page: 1, limit: 10, status: 'Processing' }.
 * @returns {Promise<object>} Promise yang resolve dengan daftar pesanan dan info paginasi.
 */
export const getAllOrders = async (params: any) => {
  try {
    const response = await apiClient.get('/orders', { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw error;
  }
};

/**
 * Mengupdate status pengiriman sebuah pesanan.
 * @param {number} orderId - ID dari pesanan yang akan diupdate.
 * @param {string} newStatus - Status baru pesanan (misal: 'Shipped', 'Delivered').
 * @returns {Promise<object>} Promise yang resolve dengan data pesanan yang sudah diupdate.
 */
export const updateOrderStatus = async (id_order: number, status_pengiriman: string) => {
  try {
    const response = await apiClient.patch(`/orders/${id_order}/status`, { status: status_pengiriman });
    return response.data;
  } catch (error) {
    console.error(`Failed to update order ${id_order}:`, error);
    throw error;
  }
};