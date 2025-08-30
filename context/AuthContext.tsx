import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "../hooks/useApi";
import CookieManager from "@react-native-cookies/cookies";
import { User } from "@/types/app-types";
import Toast from "react-native-toast-message";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (fullName: string, email: string, password: string, confirmPassword: string, accountType: number, image: string) => Promise<void>;
  updateSession: () => Promise<boolean>;
}

const BACKEND_URL = 'https://localhost:3000'

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load profile on mount (if cookies are still valid)
  useEffect(() => {
    const init = async () => {
      try {
        const cookies = await CookieManager.get(BACKEND_URL)
        console.log(cookies);
        
        if(cookies.sessionid){
          const res = await api.get<User>("/auth/profile");
          setUser(res.data);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await api.post("/auth/login", { email, password }, { withCredentials: true });
      const res = await api.get<User>("/auth/profile");
      setUser(res.data);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.post('/auth/logout');
    await CookieManager.clearAll();
    setUser(null);
    //toaster
  };

  const updateSession = async () => {
    try {
      const res = await api.get("/auth/update-session");
      if(res.data.success){
        const getUser = await api.get('/auth/profile');
        if(getUser.data.success){
          setUser(res.data);
        }
      }
      //toaster
      return true;
    } catch(err) {
      console.error(err);
      setUser(null);
      return false;
    }
  };

  const signUp = async (fullName: string, email: string, password: string, confirmPassword: string, accountType: number, imageUri: string) => {
    try {
      const formData = new FormData();

      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);
      formData.append('accountType', accountType as any);

      const filename = imageUri.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('profileImage', {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await login(email, password);
    } catch (error) {
      console.error(error);
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateSession, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
