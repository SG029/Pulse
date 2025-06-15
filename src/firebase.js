// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Real-time Database

const firebaseConfig = {
  apiKey: "AIzaSyBH90XGE5e5_NZUZeIGnv6JyZIc7VwWvA4",
  authDomain: "pulse-cf5b9.firebaseapp.com",
  databaseURL: "https://pulse-cf5b9-default-rtdb.firebaseio.com/",
  projectId: "pulse-cf5b9",
  storageBucket: "pulse-cf5b9.appspot.com",
  messagingSenderId: "131682161485",
  appId: "1:131682161485:web:2e22a323ba0224a8995d04",
  measurementId: "G-CHSD1C0J4S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app); // This is the Real-time DB

export { app, auth, db };
