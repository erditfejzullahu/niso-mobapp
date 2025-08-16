import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};


const app = initializeApp(firebaseConfig);

const auth: Auth = getAuth(app)
const db: Firestore = getFirestore(app)
const analytics = getAnalytics(app);

export { analytics, auth, db };
