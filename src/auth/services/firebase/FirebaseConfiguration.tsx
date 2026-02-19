import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZxHOmCEu9cmpS4qdvQdEUh2CZJSC25Uc",
  authDomain: "receipt-92b78.firebaseapp.com",
  projectId: "receipt-92b78",
  storageBucket: "receipt-92b78.firebasestorage.app",
  messagingSenderId: "1017938105677",
  appId: "1:1017938105677:web:7ba8535c7097e23c9d1304",
  measurementId: "G-BSDMQT682D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);