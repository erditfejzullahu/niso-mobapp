import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import CookieManager, { Cookie } from "@react-native-cookies/cookies";

const API_URL = "http://localhost:3000"; // change this

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// --- Utility: attach cookies to each request ---
api.interceptors.request.use(async (config: AxiosRequestConfig): Promise<any> => {
  const cookies = await CookieManager.get(API_URL);
  const cookieHeader = Object.values(cookies)
    .map((c: Cookie) => `${c.name}=${c.value}`)
    .join("; ");

  if (cookieHeader) {
    if (!config.headers) config.headers = {};
    config.headers["Cookie"] = cookieHeader;
  }

  return config;
});

// --- Response interceptor: handle 401 & refresh ---
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // call refresh endpoint (adjust path if needed)
        await api.post("/auth/update-session", {}, { withCredentials: true });

        isRefreshing = false;
        processQueue(null);

        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);

        // clear cookies if refresh fails
        await logout();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// --- Logout helper ---
export const logout = async (): Promise<void> => {
  try {
    // Inform backend
    await api.post("/auth/logout", {}, { withCredentials: true });
    CookieManager.clearAll();
  } catch (err) {
    console.warn("Logout request failed:", err);
  }

  // Clear cookies client-side
  await CookieManager.clearAll(true);
};

export default api;
