import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAoZurTxg7x7b6LpPITECIsjIHwkrSilpA',
  authDomain: 'duck-inventory-system.firebaseapp.com',
  projectId: 'duck-inventory-system',
  storageBucket: 'duck-inventory-system.firebasestorage.app',
  messagingSenderId: '442754165233',
  appId: '1:442754165233:web:bf16f998154460e2e2bc50',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
