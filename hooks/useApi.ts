import { API_BASE_URL } from "@/constants/apiConfig";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { useSocketStore } from "@/store/useSocketStore";
import { clearStoredCookies } from "./cookieManagement";
import { clearSocketAuthToken, saveAccessTokenFromResponse } from "./socketAuthToken";

// --- Axios instance ---
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// --- Attach cookies manually before each request ---
api.interceptors.request.use(async (config: AxiosRequestConfig): Promise<any> => {
  try {
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
  async (response: AxiosResponse) => {
    await saveAccessTokenFromResponse(response);
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
        await api.post("/auth/update-session", {}, {
          withCredentials: true,
        });

        isRefreshing = false;
        processQueue();

        void useSocketStore.getState().reconnect();

        return api(originalRequest);
      } catch (refreshError) {
        console.log(refreshError);
        isRefreshing = false;
        processQueue(refreshError);

        await clearStoredCookies();
        await clearSocketAuthToken();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
