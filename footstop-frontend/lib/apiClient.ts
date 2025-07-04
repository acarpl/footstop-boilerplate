import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // Kita perlu withCredentials agar browser mau mengirim dan menerima cookies
  // dari domain yang berbeda (localhost:3000 vs localhost:3001).
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;