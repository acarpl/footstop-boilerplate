import apiClient from '../apiClient';

// --- Tipe Data untuk Keranjang ---
interface Image { url: string; }
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

/**
 * Mengambil semua item di keranjang milik pengguna yang sedang login.
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
 * Mengupdate kuantitas sebuah item di keranjang.
 */
export const updateCartItemQuantity = async (idCart: number, quantity: number) => {
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
 */
export const removeCartItem = async (idCart: number) => {
  try {
    await apiClient.delete(`/carts/${idCart}`);
  } catch (error) {
    console.error(`Service Error: Failed to remove item ${idCart}.`, error);
    throw error;
  }
};