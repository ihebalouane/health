import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { ref } from 'vue';

const firebaseConfig = {
  apiKey: "AIzaSyAB4sLogG_6DEQ2_OtqBRJY9ad3eOoX3Ks",
  authDomain: "health-6b124.firebaseapp.com",
  projectId: "health-6b124",
  storageBucket: "health-6b124.appspot.com",
  messagingSenderId: "608690624502",
  appId: "1:608690624502:web:d3e4c92feaf11661b699d7"
};

const firebaseApp = initializeApp(firebaseConfig);
const projectFirestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const isAuthenticated = ref(false);
const userEmail = ref(null);

onAuthStateChanged(auth, (user) => {
  isAuthenticated.value = !!user;
  userEmail.value = isAuthenticated.value ? user.email : null; // Update user's email
  if (isAuthenticated.value) {
    localStorage.setItem('email', user.email); // Save email to local storage
  } else {
    localStorage.removeItem('email'); // Remove email from local storage
  }
});

const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('email'); // Remove email from local storage
  } catch (error) {
    console.error('Error signing out:', error.message);
  }
};

export { projectFirestore, auth, isAuthenticated, userEmail, logout };

