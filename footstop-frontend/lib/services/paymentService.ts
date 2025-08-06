import apiClient from "../apiClient";

/**
 * Tipe data untuk respons yang diharapkan dari endpoint create-transaction.
 * Midtrans mengembalikan lebih banyak data, tapi ini yang paling kita butuhkan.
 */
interface MidtransTransactionResponse {
  token: string;
  redirect_url: string;
}

/**
 * [USER] Membuat sesi pembayaran di Midtrans untuk sebuah pesanan yang sudah ada.
 * Fungsi ini dipanggil setelah pesanan berhasil dibuat di database kita.
 * @param {number} orderId - ID dari pesanan yang akan dibayar.
 * @returns {Promise<MidtransTransactionResponse>} Objek dari backend yang berisi 'redirect_url' dari Midtrans.
 */
export const createPaymentTransaction = async (
  id_order: number
): Promise<MidtransTransactionResponse> => {
  try {
    // 1. Kirim request POST ke endpoint backend yang benar.
    // 2. Body-nya adalah objek JSON yang berisi orderId.
    const response = await apiClient.post("/payments/create-transaction", {
      id_order,
    });

    // 3. Kembalikan data yang diterima (berisi token dan redirect_url).
    return response.data;
  } catch (error) {
    // 4. Jika gagal, catat error dan lempar kembali agar komponen bisa menanganinya.
    console.error(
      "Service Error: Failed to create payment transaction.",
      error
    );
    throw error;
  }
};
