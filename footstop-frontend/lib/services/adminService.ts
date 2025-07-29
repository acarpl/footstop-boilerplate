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

export const getAllUsers = async (params: { page: number; limit: number }) => {
  const response = await apiClient.get('/users', { params });
  return response.data;
};

/**
 * Mengupdate data pengguna oleh admin.
 */
export const updateUserByAdmin = async (userId: number, data: any) => {
  const response = await apiClient.patch(`/users/${userId}`, data);
  return response.data;
};

/**
 * Menghapus pengguna oleh admin.
 */
export const deleteUser = async (userId: number) => {
  await apiClient.delete(`/users/${userId}`);
};

export const getAllProducts = async (params: any) => {
  const response = await apiClient.get('/products', { params });
  return response.data;
};
export const createProduct = async (productData: any) => {
  const response = await apiClient.post('/products', productData);
  return response.data;
};
export const updateProduct = async (id_product: number, productData: any) => {
  const response = await apiClient.patch(`/products/${id_product}`, productData);
  return response.data;
};
export const deleteProduct = async (id_product: number) => {
  await apiClient.delete(`/products/${id_product}`);
};

// --- Dependencies for Product Form ---
export const getAllCategories = async () => {
  const response = await apiClient.get('/categories');
  return response.data;
};
export const getAllBrands = async () => {
  const response = await apiClient.get('/brands');
  return response.data;
};

export const getAllOrders = async (params: { page: number; limit: number; }) => {
  const response = await apiClient.get('/orders/admin/all', { params });
  return response.data;
};

export const updateOrderStatus = async (id_order: number, status: string) => {
  const response = await apiClient.patch(`/orders/admin/${id_order}/status`, { status });
  return response.data;
};

// FUNGSI BARU untuk mengambil detail
export const getOrderDetailsForAdmin = async (id_order: number) => {
  const response = await apiClient.get(`/orders/admin/${id_order}`);
  return response.data;
}