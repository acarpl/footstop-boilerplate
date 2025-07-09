import axios from 'axios';
import { cookies } from 'next/headers';

console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
});

export default apiClient;