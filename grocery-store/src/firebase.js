// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

  const VITE_FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
  const VITE_FIREBASE_AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const VITE_FIREBASE_PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const VITE_FIREBASE_STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
  const VITE_FIREBASE_MESSAGING_SENDER_ID = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  const VITE_FIREBASE_APP_ID = import.meta.env.VITE_FIREBASE_APP_ID;




const firebaseConfig = {
 apiKey:VITE_FIREBASE_API_KEY,
  authDomain:VITE_FIREBASE_AUTH_DOMAIN ,
  projectId: VITE_FIREBASE_PROJECT_ID,
  storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID
};
  
// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);