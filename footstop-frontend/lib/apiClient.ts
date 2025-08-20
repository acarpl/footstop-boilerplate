import axios, { AxiosHeaders } from "axios";
import { TokenUtil } from "../utils/token";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    if (TokenUtil.accessToken) {
      // Pastikan headers berupa AxiosHeaders
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      (config.headers as AxiosHeaders).set(
        "Authorization",
        `Bearer ${TokenUtil.accessToken}`
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
