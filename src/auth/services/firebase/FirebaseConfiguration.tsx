import { initializeApp as initFirebaseApp } from "firebase/app";
// @ts-expect-error: getReactNativePersistence is not in the standard Auth types but works in RN
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import SecureFirebaseStorage from "@/src/auth/services/firebase/SecureFirebaseStorage";

const firebaseConfig = {
  apiKey: "AIzaSyDZxHOmCEu9cmpS4qdvQdEUh2CZJSC25Uc",
  authDomain: "receipt-92b78.firebaseapp.com",
  projectId: "receipt-92b78",
  storageBucket: "receipt-92b78.firebasestorage.app",
  messagingSenderId: "1017938105677",
  appId: "1:1017938105677:web:7ba8535c7097e23c9d1304",
  measurementId: "G-BSDMQT682D",
};

export const app = initFirebaseApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(SecureFirebaseStorage)
});
export const db = getFirestore(app);
