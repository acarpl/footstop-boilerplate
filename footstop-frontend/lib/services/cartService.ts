// lib/services/cartService.js

import apiClient from '../apiClient'; // Pastikan path import benar

/**
 * Mengambil semua item di keranjang milik pengguna yang sedang login.
 * @returns {Promise<Array>} Sebuah promise yang resolve dengan array item keranjang.
 */
export const getCartItems = async () => {
  try {
    const response = await apiClient.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch cart items:', error);
    // Lempar kembali error agar komponen bisa menanganinya (misal, menampilkan pesan)
    throw error;
  }
};

/**
 * Menambahkan sebuah item ke keranjang.
 * @param {object} cartData - Data item yang akan ditambahkan.
 * @param {number} cartData.idProduct - ID produk.
 * @param {number} cartData.quantity - Jumlah produk.
 * @param {string} [cartData.size] - Ukuran produk (opsional).
 * @returns {Promise<object>} Sebuah promise yang resolve dengan data item yang baru ditambahkan/diupdate.
 */
export const addItemToCart = async (carts: any) => {
  try {
    const response = await apiClient.post('/cart', carts);
    return response.data;
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    throw error;
  }
};

/**
 * Mengupdate kuantitas sebuah item di dalam keranjang.
 * @param {number} idCart - ID dari item keranjang yang akan diupdate.
 * @param {number} quantity - Kuantitas baru.
 * @returns {Promise<object>} Sebuah promise yang resolve dengan data item keranjang yang sudah diupdate.
 */
export const updateCartItemQuantity = async (id_cart: any, quantity: any) => {
  try {
    const response = await apiClient.patch(`/cart/${id_cart}`, { quantity });
    return response.data;
  } catch (error) {
    console.error(`Failed to update cart item ${id_cart}:`, error);
    throw error;
  }
};

/**
 * Menghapus sebuah item dari keranjang.
 * @param {number} idCart - ID dari item keranjang yang akan dihapus.
 * @returns {Promise<void>}
 */
export const removeCartItem = async (id_cart: any) => {
  try {
    await apiClient.delete(`/cart/${id_cart}`);
  } catch (error) {
    console.error(`Failed to remove cart item ${id_cart}:`, error);
    throw error;
  }
};