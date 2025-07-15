// lib/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  
  // INI WAJIB BERNILAI TRUE
  withCredentials: true,
});

export default apiClient;