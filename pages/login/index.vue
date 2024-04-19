<template>
  <div class="login-container">
    <BgAnimations/>
    <div class="login-form">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <input type="email" v-model="email" placeholder="Email" required>
        </div>
        <div class="form-group">
          <input type="password" v-model="password" placeholder="Password" required autocomplete="current-password">
        </div>
        <div class="forgot-password">
          <a href="#">Forgot Password?</a>
        </div>
        <button type="submit">Login</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
      <div class="register">
        <p>Don't have an account? </p>
        <router-link to="/signup" class="register-link">Register here</router-link>
      </div>
      <button @click="goBack" class="go-back-button">Go Back</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { projectFirestore } from '@/firebase/config'; 
import userState from '@/store/userState.js'; // Update the path accordingly

export default {
  layout: 'empty',
  setup() {
    const router = useRouter(); 

    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');

    const login = async () => {
      try {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email.value, password.value);
        console.log('User logged in:', email.value);
        userState.userEmail = email.value; // Store user email in state
        router.push('/');
      } catch (error) {
        errorMessage.value = error.message; 
        console.error('Error logging in:', error.message);
      }
    };

    const goBack = () => {
      router.go(-1); 
    };

    return { email, password, errorMessage, login, goBack };
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-form {
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

button[type="submit"],
button[type="button"] {
  width: 100%;
  padding: 12px; 
  background-color: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover,
button[type="button"]:hover {
  background-color: #27ae60;
}

.forgot-password {
  margin-top: 20px;
  text-align: right;
}

.forgot-password a {
  color: #2ecc71;
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.register {
  margin-top: 20px;
  text-align: center;
}

.register-link {
  color: #2ecc71;
  text-decoration: none;
}

.register-link:hover {
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