import apiClient from '../apiClient';

/**
 * Membuat sesi pembayaran di Midtrans untuk sebuah pesanan.
 * @param {number} orderId - ID dari pesanan yang baru saja dibuat.
 * @returns {Promise<{ redirect_url: string; token: string }>} Objek yang berisi URL pembayaran dari Midtrans.
 */
export const createPaymentTransaction = async (orderId: number) => {
  try {
    // Panggil endpoint yang benar dengan body yang benar
    const response = await apiClient.post('/payments/create-transaction', { orderId });
    return response.data;
  } catch (error) {
    console.error("Service Error: Failed to create Midtrans transaction.", error);
    throw error;
  }
};