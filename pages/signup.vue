<template>
  <title>Sign Up</title>
  <div class="signup-container">
    <BgAnimations/>
    <div class="signup-form">
      <h2>Sign Up</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <input type="email" v-model="email" placeholder="Email" required>
        </div>
        <div class="form-group">
          <input type="password" v-model="password" placeholder="Password" required>
        </div>
        <div class="form-group">
          <input type="password" v-model="confirmPassword" placeholder="Confirm Password" required>
        </div>
        <button type="submit">Sign Up</button>
        <div class="login-link">
          <p>Already have an account? <router-link to="/login">Log in</router-link></p>
        </div>
      </form>
      <button @click="goBack" class="go-back-button">Go Back</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router'; 
import { projectFirestore } from '@/firebase/config'; 
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions

export default {
  layout: 'empty',
  setup() {
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const router = useRouter(); 

    const handleSubmit = async () => {
      try {
        if (password.value !== confirmPassword.value) {
          console.error('Passwords do not match');
          return;
        }

        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);

        // Add user to Firestore collection
        await addDoc(collection(projectFirestore, "users"), { email: userCredential.user.email });

        console.log('User signed up:', userCredential.user.email);
        router.push('/login');
      } catch (error) {
        console.error('Error signing up:', error.message);
      }
    };

    const goBack = () => {
      router.go(-1); 
    };

    return { email, password, confirmPassword, handleSubmit, goBack };
  }
};
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.signup-form {
  width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  background-color: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #27ae60;
}

.login-link {
  margin-top: 20px;
  text-align: center;
}

.login-link p {
  color: #333;
}

.login-link a {
  color: #2ecc71;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

.go-back-button {
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.go-back-button:hover {
  background-color: #2980b9;
}
</style>
