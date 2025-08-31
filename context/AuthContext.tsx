import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "../hooks/useApi";
import { User } from "@/types/app-types";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { clearStoredCookies, getStoredCookies, loadUserFromStorage, saveUserToStorage } from "@/hooks/cookieManagement";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (fullName: string, email: string, password: string, confirmPassword: string, accountType: number, image: string) => Promise<void>;
  updateSession: () => Promise<boolean>;
}

const USER_STORAGE_KEY = "user_data";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  

  // Load profile on mount
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true)
      try {
        
        const storedUser = await loadUserFromStorage();
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
          // console.log(storedUser, ' ? stored user');
        }        
      
        // Verify session is still valid
        const res = await api.get("/auth/profile");     

        const userData = res.data;
        
        setUser(userData);
        setIsAuthenticated(true);
        await saveUserToStorage(userData);
      } catch (error) {
        
        console.error("Auth initialization failed:", error);
        setUser(null);
        setIsAuthenticated(false);
        await clearStoredCookies();
        await saveUserToStorage(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password }, { 
        withCredentials: true 
      });

      // Get user profile after successful login
      const profileResponse = await api.get<User>("/auth/profile");
      const userData = profileResponse.data;
      
      setUser(userData);
      setIsAuthenticated(true);
      await saveUserToStorage(userData);
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { 
        withCredentials: true,
      });
    } catch (err) {
      console.warn("Logout request failed:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      await saveUserToStorage(null);
      
      Toast.show({
        type: "success",
        text1: "Logged out",
        text2: "You have been logged out successfully",
      });
    }
  };

  const updateSession = async (): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await api.post("/auth/update-session", {}, { 
        withCredentials: true,
      });
      if(response.data.success){
        const profileResponse = await api.get<User>("/auth/profile");
        const userData = profileResponse.data;
        
        setUser(userData);
        setIsAuthenticated(true);
        await saveUserToStorage(userData);
  
        return true;
      }
      console.log("not updated");
      return false;
      // Verify the session is still valid
    } catch (error) {
      console.error("Session refresh failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      await clearStoredCookies();
      await saveUserToStorage(null);
      
      return false;
    } finally {
      setLoading(false)
    }
  };

  const signUp = async (fullName: string, email: string, password: string, confirmPassword: string, accountType: number, imageUri: string) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);
      formData.append('accountType', accountType.toString());

      const filename = imageUri.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('profileImage', {
        uri: imageUri,
        name: filename,
        type,
      } as any);      

      const response = await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if(response.data.success){
        await login(email, password);
      }

    } catch (error: any) {      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated,
      login, 
      logout, 
      signUp, 
      updateSession 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};