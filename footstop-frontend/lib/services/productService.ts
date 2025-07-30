// lib/services/productService.ts

import apiClient from '../apiClient'; // Pastikan path ini benar

// Definisikan tipe data di sini agar bisa digunakan kembali
export interface Product {
  id_product: number;
  product_name: string;
  price: string;
  images: { url: string }[];
  // Tambahkan properti lain jika perlu
}

export interface Category {
  id_category: number;
  category_name: string;
}

export interface Brand {
  id_brand: number;
  brand_name: string;
}

/**
 * Mengambil daftar produk dari backend dengan filter dan paginasi.
 * @param params - Objek berisi query params seperti page, limit, search, dll.
 * @returns Promise yang resolve dengan objek berisi data produk dan info paginasi.
 */
export const getProducts = async (params: any) => {
  try {
    const response = await apiClient.get('/products', { params });
    // Backend mengembalikan { data: [Product], total: number, ... }
    return response.data;
  } catch (error) {
    console.error("Service Error: Failed to fetch products:", error);
    throw error; // Lempar kembali agar komponen bisa menangani UI error
  }
};

/**
 * Mengambil semua kategori dari backend.
 * @returns Promise yang resolve dengan array kategori.
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get('/categories');
    return response.data;
  } catch (error) {
    console.error("Service Error: Failed to fetch categories:", error);
    throw error;
  }
};

/**
 * Mengambil semua merek dari backend.
 * @returns Promise yang resolve dengan array merek.
 */
export const getBrands = async (): Promise<Brand[]> => {
  try {
    const response = await apiClient.get('/brands');
    return response.data;
  } catch (error) {
    console.error("Service Error: Failed to fetch brands:", error);
    throw error;
  }
};