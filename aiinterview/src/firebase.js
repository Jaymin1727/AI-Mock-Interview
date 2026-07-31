import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyD9uyDl_f8az9OkN5aPHlqo9nqon94wtJg",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "ai-interview-5d5c5.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "ai-interview-5d5c5",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "ai-interview-5d5c5.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;