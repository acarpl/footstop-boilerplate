import apiClient from "../apiClient";
export const createPaymentTransaction = async (orderId: number) => {
  try {
    const response = await apiClient.post("/payments/create-transaction", {
      orderId,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Service Error: Failed to create payment transaction.",
      error
    );
    throw error;
  }
};
