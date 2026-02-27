// import { initializeApp as initFirebaseApp } from "firebase/app";
import auth from '@react-native-firebase/auth';
// import SecureFirebaseStorage from "@/src/auth/services/firebase/SecureFirebaseStorage";

// export const firebaseConfig = {
//   apiKey: "AIzaSyDZxHOmCEu9cmpS4qdvQdEUh2CZJSC25Uc",
//   authDomain: "receipt-92b78.firebaseapp.com",
//   projectId: "receipt-92b78",
//   storageBucket: "receipt-92b78.firebasestorage.app",
//   messagingSenderId: "1017938105677",
//   appId: "1:1017938105677:web:7ba8535c7097e23c9d1304",
//   measurementId: "G-BSDMQT682D",
// };

// export const app = initFirebaseApp(firebaseConfig);
// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(SecureFirebaseStorage)
// });
export const authInstance = auth()
export const getCurrentUid = () => auth().currentUser?.uid