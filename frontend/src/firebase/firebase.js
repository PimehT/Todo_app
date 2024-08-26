// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, updateProfile } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9gBR22DYlgIVpxT68eoicvkNS3ISAYPw",
  authDomain: "todo-60be7.firebaseapp.com",
  projectId: "todo-60be7",
  storageBucket: "todo-60be7.appspot.com",
  messagingSenderId: "941224360294",
  appId: "1:941224360294:web:f5ecd9326d19e3614430a7",
  measurementId: "G-JVE4DEF9T7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleProvider, updateProfile };
