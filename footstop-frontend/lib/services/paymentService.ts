import apiClient from "../apiClient";
export const createPaymentTransaction = async (id_order: number) => {
  try {
    const response = await apiClient.post("/payments/create-transaction", {
      id_order,
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
