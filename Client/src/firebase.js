// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-e87d1.firebaseapp.com",
  projectId: "mern-blog-e87d1",
  storageBucket: "mern-blog-e87d1.firebasestorage.app",
  messagingSenderId: "958049615889",
  appId: "1:958049615889:web:278a3e4c20d527c46171b0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);