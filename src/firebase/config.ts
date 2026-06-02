import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyAoZurTxg7x7b6LpPITECIsjIHwkrSilpA',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'duck-inventory-system.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'duck-inventory-system',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'duck-inventory-system.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '442754165233',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:442754165233:web:bf16f998154460e2e2bc50',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
