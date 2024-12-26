// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getDatabase} from "firebase/database"
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCVvBjUKpnayPm7z_z1phhCVkWUms-qokw",
  authDomain: "final-a34b8.firebaseapp.com",
  databaseURL: "https://final-a34b8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "final-a34b8",
  storageBucket: "final-a34b8.firebasestorage.app",
  messagingSenderId: "792882564013",
  appId: "1:792882564013:web:1248104f6e185aa4bbaf24",
  measurementId: "G-19Y0499XK2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const realDB = getDatabase(app)
const db = getFirestore(app)
const auth = getAuth(app)
export {
    realDB,
    db,
    auth
}