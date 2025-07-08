import axios from 'axios';

console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;