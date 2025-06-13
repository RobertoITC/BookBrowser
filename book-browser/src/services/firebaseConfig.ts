// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"

const API_KEY = import.meta.env.FIREBASE_API_KEY;
console.log(API_KEY);
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyAdCrEZs8xMnxrvOHjCreKCZHkpyi_4rhY',
    authDomain: "book-browser-8a870.firebaseapp.com",
    projectId: "book-browser-8a870",
    storageBucket: "book-browser-8a870.firebasestorage.app",
    messagingSenderId: "1063190700303",
    appId: "1:1063190700303:web:ef3d394be8058788e71e7a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

