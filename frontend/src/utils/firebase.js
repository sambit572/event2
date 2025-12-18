import { getAuth } from "firebase/auth";
import { firebaseApp } from "./firebaseCore";

let authInstance;

export async function getFirebaseAuth() {
  if (!authInstance) {
    authInstance = getAuth(firebaseApp);
    authInstance.languageCode = "en";
  }
  return authInstance;
}
