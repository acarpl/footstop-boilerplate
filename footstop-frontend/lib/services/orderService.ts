import apiClient from '../apiClient';

/**
 * Membuat pesanan baru dari keranjang pengguna.
 * @param shippingAddress - Alamat pengiriman yang diinput pengguna.
 * @returns {Promise<any>} Data pesanan yang baru dibuat.
 */
export const createOrder = async (shippingAddress: string) => {
    try {
        const response = await apiClient.post('/orders', { shippingAddress });
        return response.data;
    } catch (error) {
        console.error("Service Error: Failed to create order.", error);
        throw error;
    }
}

export const createPaymentTransaction = async (orderId: number) => {
    try {
        const response = await apiClient.post('/payments/create-transaction', { orderId });
        return response.data;
    } catch (error) {
        console.error("Service Error: Failed to create payment transaction.", error);
        throw error;
    }
}