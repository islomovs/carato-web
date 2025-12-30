/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/axios/instance.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

const API_BASE = "https://api.carato.uz";

type TokenPair = {
  token: string | null;
  refreshToken: string | null;
};

/**
 * NOTE:
 * - adapt getToken()/setToken() to use your store (Zustand/Context) if needed.
 * - localStorage is used here for simplicity and because UI components are client-side.
 */
const TOKEN_KEY = "auth_token";
const REFRESH_KEY = "auth_refresh";

function getTokenPair(): TokenPair {
  if (typeof window === "undefined") return { token: null, refreshToken: null };
  return {
    token: localStorage.getItem(TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_KEY),
  };
}

function setTokenPair({ token, refreshToken }: TokenPair) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  else localStorage.removeItem(REFRESH_KEY);
}

function clearTokenPair() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

/**
 * Refresh flow:
 * - If a 401 occurs, try refresh once.
 * - While refresh is in progress, queue new requests.
 */
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (err?: any) => void;
  config: AxiosRequestConfig & { _retry?: boolean };
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else {
      if (token && prom.config.headers)
        prom.config.headers["Authorization"] = `Bearer ${token}`;
      prom.resolve(api(prom.config));
    }
  });
  failedQueue = [];
};

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const { token } = getTokenPair();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 -> refresh -> retry
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: AxiosRequestConfig }) => {
    const originalConfig = error?.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // If no config (some other error), just reject
    if (!originalConfig) return Promise.reject(error);

    // If status is 401 and we haven't retried this request yet:
    if (error.response?.status === 401 && !originalConfig._retry) {
      const { refreshToken } = getTokenPair();

      // If no refresh token -> log out (clear tokens) and reject
      if (!refreshToken) {
        clearTokenPair();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // queue the request and return a promise which will be resolved when refresh finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalConfig });
        });
      }

      originalConfig._retry = true;
      isRefreshing = true;

      try {
        // call refresh endpoint
        const res = await axios.post(`${API_BASE}/api/v1/auth/refresh`, {
          refreshToken,
        });

        // Expected response contains new token and refreshToken (as you described)
        const data: any = res?.data;
        const newToken = data?.token ?? null;
        const newRefresh = data?.refreshToken ?? null;

        // save tokens
        setTokenPair({ token: newToken, refreshToken: newRefresh });

        // set Authorization header for future requests
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        processQueue(null, newToken);

        // retry original request with new token
        if (originalConfig.headers) {
          originalConfig.headers["Authorization"] = `Bearer ${newToken}`;
        }
        return api(originalConfig);
      } catch (errRefresh) {
        processQueue(errRefresh, null);
        clearTokenPair();
        return Promise.reject(errRefresh);
      } finally {
        isRefreshing = false;
      }
    }

    // other errors
    return Promise.reject(error);
  }
);

export { api, getTokenPair, setTokenPair, clearTokenPair };
export default api;
