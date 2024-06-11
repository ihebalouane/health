<template>
  <div>
    <site-header/>
    <qstHeader />
    <BgAnimations/>
    <div class="form-container">
      <div class="exercise-form">
        <label class="form-label">How often do you exercise per week?</label>
        <div class="radio-group">
          <label class="radio-label" v-for="option in options" :key="option.value">
            <input type="radio" v-model="exerciseFrequency" :value="option.value">
            <span class="radio-custom"></span>
            <span class="radio-text">{{ option.label }}</span>
          </label>
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
          <p>This information will help us better understand your activity levels and tailor your plan accordingly.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { projectFirestore, auth } from '../../../firebase/config'; 
import { collection, query, where, getDocs, updateDoc, addDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      exerciseFrequency: '',
      options: [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5+', label: '5+' }
      ]
    };
  },
  methods: {
    async submitForm() {
      if (!this.exerciseFrequency) {
        alert('Please select an option.');
        return;
      }
      
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("User not logged in.");
          return;
        }

        const userDocRef = collection(projectFirestore, "userResponses");
        const q = query(userDocRef, where("userEmail", "==", user.email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          await updateDoc(doc.ref, {
            exerciseFrequency: this.exerciseFrequency,
            timestamp: new Date()
          });
          console.log('Data updated in Firestore');
        } else {
          await addDoc(collection(projectFirestore, "userResponses"), {
            userEmail: user.email,
            exerciseFrequency: this.exerciseFrequency,
            timestamp: new Date()
          });
          console.log('New document created in Firestore');
        }

        this.$router.push('/form/cut/qst6');
      } catch (error) {
        console.error("Error saving exercise frequency: ", error);
        alert('There was an error saving your exercise frequency. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
.form-container {
  max-width: 400px; 
  margin: 20px auto; 
  background-color: #ffffff; 
  border: none; 
  border-radius: 8px;
  padding: 20px;
}

.form-label {
  font-size: 1.4rem;
  margin-bottom: 15px; 
  display: block;
  color: #333; 
}

.radio-group {
  display: flex;
  flex-direction: column;
}

.radio-label {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
}

.radio-custom {
  width: 24px; 
  height: 24px; 
  border: 2px solid #2ecc71; 
  border-radius: 50%;
  margin-right: 12px;
  position: relative;
}

.radio-custom::after {
  content: '';
  display: block;
  width: 12px;
  height: 12px;
  background-color: #2ecc71; 
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.2s ease;
}

.radio-text {
  font-size: 1.2rem;
}

input[type="radio"] {
  opacity: 0;
  width: 0;
  height: 0;
}

input[type="radio"]:checked + .radio-custom::after {
  transform: translate(-50%, -50%) scale(1);
}

.submit-button {
  background-color: #2ecc71; 
  color: #fff;
  padding: 12px 24px;
  font-size: 1.2rem;
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
