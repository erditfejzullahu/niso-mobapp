import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "http://192.168.1.12:3000";

// --- Secure Storage Keys ---
const COOKIE_STORAGE_KEY = "auth_cookies";
const USER_STORAGE_KEY = "user_data";

// --- Axios instance ---
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// --- Cookie Management ---
export const getStoredCookies = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(COOKIE_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to get stored cookies:", error);
    return null;
  }
};

export const setStoredCookies = async (cookies: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(COOKIE_STORAGE_KEY, cookies);
  } catch (error) {
    console.error("Failed to store cookies:", error);
  }
};

export const clearStoredCookies = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(COOKIE_STORAGE_KEY);
    await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear cookies:", error);
  }
};

// --- Extract cookies from response ---
const extractCookiesFromResponse = (response: AxiosResponse): string | null => {
  const setCookieHeader = response.headers["set-cookie"];
  if (!setCookieHeader) return null;
  
  return Array.isArray(setCookieHeader) 
    ? setCookieHeader.join("; ") 
    : setCookieHeader;
};

// --- Attach cookies manually before each request ---
api.interceptors.request.use(async (config: AxiosRequestConfig): Promise<any> => {
  try {
    const cookieHeader = await getStoredCookies();
    if (cookieHeader) {
      if (!config.headers) config.headers = {};
      config.headers["Cookie"] = cookieHeader;
    }
    return config;
  } catch (error) {
    console.error("Request interceptor error:", error);
    return config;
  }
});

// --- Response interceptor: handle 401 & refresh ---
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Store cookies from response if they exist
    const cookies = extractCookiesFromResponse(response);
    if (cookies) {
      setStoredCookies(cookies);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint
        const refreshResponse = await api.post("/auth/update-session", {}, { 
          withCredentials: true,
        });

        // Save updated cookies
        const cookies = extractCookiesFromResponse(refreshResponse);
        if (cookies) {
          await setStoredCookies(cookies);
        }

        isRefreshing = false;
        processQueue();

        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);

        // Clear auth state on refresh failure
        await clearStoredCookies();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// --- Logout helper ---
export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout", {}, { 
      withCredentials: true,
    });
  } catch (err) {
    console.warn("Logout request failed:", err);
  } finally {
    await clearStoredCookies();
  }
};

export default api;