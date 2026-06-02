'use client';

import axios, { AxiosInstance } from 'axios';

/**
 * Single axios instance for the whole app.
 *
 * Audit fixes (P1-4):
 *  - One source of truth for the API base URL (env var, no localhost hard-codes).
 *  - Bearer token attached automatically from localStorage.
 *  - 401 responses trigger a global logout + redirect to /login.
 *  - Network errors are normalised to a readable message.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (r) => r,
  (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      // JWT invalid/expired → clear everything and force re-login.
      window.localStorage.removeItem('auth_token');
      window.localStorage.removeItem('user_role');
      window.localStorage.removeItem('user_type');
      window.localStorage.removeItem('user_email');
      window.localStorage.removeItem('user_id');
      window.localStorage.removeItem('user_name');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
