import { auth } from "@/firebase";
import { AuthError, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, signInWithEmailAndPassword, User } from "firebase/auth";
import { createContext, ReactNode, use, useEffect, useState } from "react";

type AuthContextType = {
    currentUser: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user)
        setLoading(false);
      })
      return unsubscribe;
    }, [])
    
    const signIn = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            const authError = error as AuthError;
            throw new Error(authError.message)
        }
    }

    const signUp = async (email: string, password: string) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            const authError = error as AuthError;
            throw new Error(authError.message)
        }
    }

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            const authError = error as AuthError
            throw new Error(authError.message)
        }
    }

    const value: AuthContextType = {
        currentUser,
        signIn,
        signOut,
        signUp,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = use(AuthContext);
    if(context === undefined){
        throw new Error('useAuth must be used within an authProvider')
    }
    return context;
}