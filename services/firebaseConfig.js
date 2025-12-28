// Firebase configuration
// Replace with your Firebase project config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCnT_SKw5Y3XmSLIbAyLm4CY12Nq4K84iA",
  authDomain: "studenthub-9077a.firebaseapp.com",
  projectId: "studenthub-9077a",
  storageBucket: "studenthub-9077a.firebasestorage.app",
  messagingSenderId: "583648668434",
  appId: "1:583648668434:web:1a6ed1f430468d8615e1cb",
  measurementId: "G-BFPNSCKLKY"
};

// Initialize Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

let app;
let auth;
let db;
let storage;

try {
  console.log('Initializing Firebase...');
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error(`Firebase init failed: ${error.message}`);
}

export { auth, db, storage };
export default app;
