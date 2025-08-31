import { User } from "@/types/app-types";
import * as SecureStore from "expo-secure-store"

const COOKIE_STORAGE_KEY = "auth_cookies";
const USER_STORAGE_KEY = "user_data";

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

// Load user from secure storage on mount
export const loadUserFromStorage = async (): Promise<User | null> => {
    try {
      const userData = await SecureStore.getItemAsync(USER_STORAGE_KEY);
      
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Failed to load user from storage:", error);
      return null;
    }
  };

export const saveUserToStorage = async (userData: User | null): Promise<void> => {
    try {
      if (userData) {
        await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(userData));
      } else {
        await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Failed to save user to storage:", error);
    }
  };