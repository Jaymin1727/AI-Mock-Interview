import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD9uyDl_f8az9OkN5aPHlqo9nqon94wtJg",
  authDomain: "ai-interview-5d5c5.firebaseapp.com",
  projectId: "ai-interview-5d5c5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);