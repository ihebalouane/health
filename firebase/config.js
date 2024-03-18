import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Import Firestore


const firebaseConfig = {
  apiKey: "AIzaSyAB4sLogG_6DEQ2_OtqBRJY9ad3eOoX3Ks",
  authDomain: "health-6b124.firebaseapp.com",
  projectId: "health-6b124",
  storageBucket: "health-6b124.appspot.com",
  messagingSenderId: "608690624502",
  appId: "1:608690624502:web:d3e4c92feaf11661b699d7"
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Get the Firestore instance
const projectFirestore = getFirestore(firebaseApp);

export { projectFirestore };
