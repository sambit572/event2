// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJnC6jHN-1Q66Ffoh_v7qEDdRCBXcDyxU",
  authDomain: "eventsbridge-verification.firebaseapp.com",
  projectId: "eventsbridge-verification",
  storageBucket: "eventsbridge-verification.firebasestorage.app",
  messagingSenderId: "1003710775298",
  appId: "1:1003710775298:web:841711699eea104f1da71b",
  measurementId: "G-VLTY6BZ6G8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
auth.languageCode = "it";

export default app;

export { auth };
