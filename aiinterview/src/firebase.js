import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "apiKey: process.env.REACT_APP_FIREBASE_API_KEY,",
  authDomain: "ai-interview-5d5c5.firebaseapp.com",
  projectId: "ai-interview-5d5c5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);