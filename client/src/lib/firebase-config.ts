// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: "smartcampusai-51400.firebasestorage.app",
  messagingSenderId: "5424538236",
  appId: "1:5424538236:web:828f9cdee1df6baecb1ff9",
  measurementId: "G-38E2YQ6XD2",
};

// Initialize Firebase only if API key is provided
let app: any = null;
let auth: any = null;

if (firebaseConfig.apiKey) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export { app, auth };