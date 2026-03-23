import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCJnC6jHN-1Q66Ffoh_v7qEDdRCBXcDyxU",
  authDomain: "eventsbridge-verification.firebaseapp.com",
  projectId: "eventsbridge-verification",
  storageBucket: "eventsbridge-verification.firebasestorage.app",
  messagingSenderId: "1003710775298",
  appId: "1:1003710775298:web:841711699eea104f1da71b",
  measurementId: "G-VLTY6BZ6G8",
};

export const firebaseApp = initializeApp(firebaseConfig);
