// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJ-86h8ENwUvgo96YI6MtMd9AkVDIXmL4",
  authDomain: "eb-prod-29b37.firebaseapp.com",
  projectId: "eb-prod-29b37",
  storageBucket: "eb-prod-29b37.firebasestorage.app",
  messagingSenderId: "613626059639",
  appId: "1:613626059639:web:cc47d3df2aff2008545f72",
  measurementId: "G-D5DHHMENGT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
auth.languageCode = "it";

export default app;

export { auth };
