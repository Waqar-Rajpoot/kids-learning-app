import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  indexedDBLocalPersistence, 
  initializeAuth, 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { Capacitor } from "@capacitor/core";

// Your specific configuration from Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA3rWrn6fsBDN6zvZqrB7OoIqgHrvSPw-0",
  authDomain: "kids-learning-a0c3c.firebaseapp.com",
  projectId: "kids-learning-a0c3c",
  storageBucket: "kids-learning-a0c3c.firebasestorage.app",
  messagingSenderId: "559083604411",
  appId: "1:559083604411:web:9ae5eb9ff2b4f03f639c9e",
  measurementId: "G-K62NSERBP6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth with persistence for Native (Android/iOS) and Web
const auth = Capacitor.isNativePlatform()
  ? initializeAuth(app, {
      persistence: indexedDBLocalPersistence,
    })
  : getAuth(app);

export { auth, db };