import apiClient from "../apiClient";

export const requestPasswordReset = async (email: string) => {
  const response = await apiClient.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await apiClient.post("/auth/reset-password", {
    token,
    password,
  });
  return response.data;
};
