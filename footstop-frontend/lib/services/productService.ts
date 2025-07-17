// lib/services/productService.js

import apiClient from '../apiClient';

/**
 * Mengambil daftar produk dari backend dengan filter dan paginasi.
 * @param {object} params - Objek berisi query params seperti page, limit, search, dll.
 * @returns {Promise<object>} Promise yang resolve dengan objek berisi data produk dan info paginasi.
 */
export const getProducts = async (params: any) => {
  try {
    const response = await apiClient.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};

/**
 * Mengambil semua kategori.
 * @returns {Promise<Array>} Promise yang resolve dengan array of categories.
 */
export const getCategories = async () => {
  try {
    const response = await apiClient.get('/categories');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};

/**
 * Mengambil semua merek.
 * @returns {Promise<Array>} Promise yang resolve dengan array of brands.
 */
export const getBrands = async () => {
  try {
    const response = await apiClient.get('/brands');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    throw error;
  }
};