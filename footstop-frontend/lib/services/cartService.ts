// lib/services/cartService.ts

import apiClient from '../apiClient';

// --- Tipe Data untuk Keranjang ---
interface Image {
  id_gambar: number;
  url: string;
}
interface Product {
  id_product: number;
  product_name: string;
  price: string;
  images: Image[];
}
export interface CartItem {
  id_cart: number;
  quantity: number;
  size: string;
  product: Product;
}

// Tipe untuk data yang dikirim saat menambahkan item ke keranjang
interface AddToCartPayload {
    idProduct: number;
    quantity: number;
    size: string;
}

/**
 * Mengambil semua item di keranjang milik pengguna yang sedang login.
 * @returns {Promise<CartItem[]>} Sebuah promise yang resolve dengan array item keranjang.
 */
export const getCartItems = async (): Promise<CartItem[]> => {
  try {
    const response = await apiClient.get('/carts');
    return response.data;
  } catch (error) {
    console.error("Service Error: Failed to fetch cart items.", error);
    throw error;
  }
};

/**
 * Menambahkan sebuah item baru ke dalam keranjang.
 * @param {AddToCartPayload} payload - Data item yang akan ditambahkan.
 * @returns {Promise<CartItem>} Sebuah promise yang resolve dengan data item yang baru dibuat/diupdate.
 */
export const addItemToCart = async (payload: AddToCartPayload): Promise<CartItem> => {
    try {
        const response = await apiClient.post('/carts', payload);
        return response.data;
    } catch (error) {
        console.error("Service Error: Failed to add item to cart.", error);
        throw error;
    }
};

/**
 * Mengupdate kuantitas sebuah item di keranjang.
 * @param {number} idCart - ID dari item keranjang yang akan diupdate.
 * @param {number} quantity - Kuantitas baru.
 * @returns {Promise<CartItem>} Sebuah promise yang resolve dengan data item keranjang yang sudah diupdate.
 */
export const updateCartItemQuantity = async (idCart: number, quantity: number): Promise<CartItem> => {
  try {
    const response = await apiClient.patch(`/carts/${idCart}`, { quantity });
    return response.data;
  } catch (error) {
    console.error(`Service Error: Failed to update item ${idCart}.`, error);
    throw error;
  }
};

/**
 * Menghapus sebuah item dari keranjang.
 * @param {number} idCart - ID dari item keranjang yang akan dihapus.
 * @returns {Promise<void>}
 */
export const removeCartItem = async (idCart: number): Promise<void> => {
  try {
    await apiClient.delete(`/carts/${idCart}`);
  } catch (error) {
    console.error(`Service Error: Failed to remove item ${idCart}.`, error);
    throw error;
  }
};