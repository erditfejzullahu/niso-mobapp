import { getAnalytics } from "firebase/analytics";
import { getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARivsvb5a4YSFJnruOnR7uH1rnSeDDTB4",

  authDomain: "niso-ee2f0.firebaseapp.com",

  projectId: "niso-ee2f0",

  storageBucket: "niso-ee2f0.firebasestorage.app",

  messagingSenderId: "195233449303",

  appId: "1:195233449303:web:4baad6c88ff4d32509aa12",

  measurementId: "G-34R9BMEQD5"

};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth: Auth = getAuth(app)
const db: Firestore = getFirestore(app)
const analytics = getAnalytics(app);

export { analytics, auth, db };
