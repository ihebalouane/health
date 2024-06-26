<template>
  <div>
    <site-header/>
    <BgAnimations/>
    <qst-header/>
    <div class="container">
      <div class="age-form">
        <h2 class="form-title">Select Your Age Range:</h2>
        <div class="input-group">
          <label for="age" class="form-label">Age:</label>
          <select v-model="selectedAge" id="age" class="form-select">
            <option value="under 20">Under 20</option>
            <option value="20s">20s</option>
            <option value="30s">30s</option>
            <option value="40s">40s</option>
            <option value="50s">50s</option>
            <option value="60s">60s</option>
          </select>
        </div>
        <button @click="submitForm" class="submit-button transition ease-in-out delay-200 bg-green-500 hover:-translate-y-0.5 hover:scale-200 hover:bg-green-600 duration-300">
          Next
        </button>

        <div class="explanation-box">
          <div class="info-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
          </div>
          <p>We ask for your age range to tailor your program to your age group and provide better recommendations.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { projectFirestore, auth } from '../../../firebase/config'; 
import { collection, query, where, getDocs, updateDoc, addDoc } from 'firebase/firestore';
import { ref } from 'vue';

export default {
  data() {
    return {
      selectedAge: ''
    };
  },
  methods: {
    async submitForm() {
      if (this.selectedAge === '') {
        alert('Please select an age range.');
        return;
      }

      try {
        const user = auth.currentUser;
        const userEmail = user ? user.email : 'Unknown'; 

        const userDocRef = collection(projectFirestore, "userResponses");
        const q = query(userDocRef, where("userEmail", "==", userEmail));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          await updateDoc(doc.ref, {
            ageRange: this.selectedAge,
            timestamp: new Date()
          });
          console.log('Data updated in Firestore');
        } else {
          await addDoc(collection(projectFirestore, "users"), {
            userEmail: userEmail,
            ageRange: this.selectedAge,
            timestamp: new Date()
          });
          console.log('New document created in Firestore');
        }

        this.$router.push('/form/cut/qst4');
      } catch (error) {
        console.error("Error updating data in Firestore: ", error);
        alert('There was an error saving your age range. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
  margin-top: 50px;
}

.age-form {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  border-radius: 10px;
  background-color: #ffffff;
}

.form-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.input-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: #555;
}

.form-select {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #333;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #2ecc71; 
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #27ae60;
}

.explanation-box {
  max-width: 400px;
  margin: 20px auto;
  padding: 10px;
  border-radius: 8px;
  backdrop-filter: blur(10px); 
  background-color: rgba(255, 255, 255, 0.5); 
  color: #333;
  font-size: 1rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-icon {
  margin-right: 10px;
}
</style>
