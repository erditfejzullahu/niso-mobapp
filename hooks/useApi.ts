import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { clearStoredCookies, getStoredCookies, setStoredCookies } from "./cookieManagement";

import * as SecureStorage from "expo-secure-store" 
const API_URL = "http://192.168.1.12:3000";

// --- Secure Storage Keys ---


// --- Axios instance ---
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});



// --- Extract cookies from response ---
const extractCookiesFromResponse = (response: AxiosResponse): string | null => {
  const setCookieHeader = response.headers["set-cookie"];
  if (!setCookieHeader) return null;

  // Always work with an array
  const rawCookies = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  // Strip attributes (Path, Max-Age, HttpOnly, etc.)
  const cookies = rawCookies
    .map(cookieStr => cookieStr.split(";")[0].trim()) // keep only name=value
    .join("; ");

  return cookies; // e.g. "access_token=abc; refresh_token=def"
};

// --- Attach cookies manually before each request ---
api.interceptors.request.use(async (config: AxiosRequestConfig): Promise<any> => {
  try {
    
    // const cookieHeader = await getStoredCookies();
    // console.log(cookieHeader, ' cookieheaderr');
    
    // if (cookieHeader) {
    //   if (!config.headers) config.headers = {};
    //   config.headers["Cookie"] = cookieHeader;
    // }
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
    console.log(cookies,  ' cookie ninterceptor');
    
    // if (cookies) {
    //   setStoredCookies(cookies);
    // }
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
        // const cookies = extractCookiesFromResponse(refreshResponse);
        // if (cookies) {
        //   await setStoredCookies(cookies);
        // }
        
        isRefreshing = false;
        processQueue();
        
        return api(originalRequest);
      } catch (refreshError) {
        console.log(refreshError);
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

export default api;