// src/firebase/index.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// 🔥 Replace the following config with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyAiY9RLRTA-NDUA7RTNu3msTyYXj-KEaKk",
  authDomain: "careconnect-38291.firebaseapp.com",
  projectId: "careconnect-38291",
  storageBucket: "careconnect-38291.firebasestorage.app",
  messagingSenderId: "365622970519",
  appId: "1:365622970519:web:19aa2a8de96356329801d2",
  measurementId: "G-J4YVCYSLD0"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
