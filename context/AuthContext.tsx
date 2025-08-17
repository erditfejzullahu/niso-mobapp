import { auth, db } from "@/firebase";
import { AuthError, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, signInWithEmailAndPassword, updateProfile, User } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { createContext, ReactNode, use, useEffect, useState } from "react";

type AuthContextType = {
    currentUser: User & {role: "client" | "driver"} | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, fullName: string, role: 'client' | 'driver', photoBlob: Blob | null) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [currentUser, setCurrentUser] = useState<User & {role: 'client' | 'driver'} | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if(user){
              const docRef = doc(db, 'users', user.uid);
              const docSnap = await getDoc(docRef);
              setCurrentUser({...user, role: docSnap.data()?.role})
        }else{
            setCurrentUser(null)
        }
        setLoading(false);
      })
      return () => unsubscribe();
    }, [])
    
    const signIn = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            const authError = error as AuthError;
            throw new Error(authError.message)
        }
    }

    const signUp = async (email: string, password: string, fullName: string, role: 'client' | 'driver', photoBlob: Blob | null) => {
        try {
            const {user} = await createUserWithEmailAndPassword(auth, email, password);

            let downloadUrl: string | null = null
            if(photoBlob){
                const storage = getStorage();
                const storageRef = ref(storage, `images/${user.uid}.webp`)
                await uploadBytes(storageRef, photoBlob)
                downloadUrl = await getDownloadURL(storageRef);
            }

            await updateProfile(user, {
                displayName: fullName,
                photoURL: downloadUrl,
            })

            const db = getFirestore();
            await setDoc(doc(db, "users", user.uid), {
                role,
                ...user
            })

            await signIn(email, password)
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
        loading,
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