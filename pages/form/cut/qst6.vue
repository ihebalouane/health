<template>
  <div>
    <site-header/>
    <qstHeader />
    <BgAnimations/>
    <div class="form-container">
      <div class="risk-form">
        <label class="form-label">Are you at risk of any of the following?</label>
        <div class="checkbox-group">
          <label class="checkbox-label" v-for="option in options" :key="option.value">
            <input type="checkbox" v-model="selectedOptions" :value="option.value" class="checkbox-input">
            <span class="checkbox-custom"></span>
            <span class="checkbox-text">{{ option.label }}</span>
          </label>
        </div>
        <button @click="submitForm" class="submit-button transition ease-in-out delay-200 bg-green-500 hover:-translate-y-0.5 hover:scale-200 hover:bg-green-600 duration-300">
          Next
        </button>
      </div>
      
      <div class="explanation-box">
        <div class="info-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
        </div>
        <p>Please select the risk factors that apply to you. This information will help us tailor our recommendations to your specific health needs.</p>
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
      selectedOptions: [],
      options: [
        { value: 'diabetes', label: 'Diabetes' },
        { value: 'hormonal', label: 'Hormonal issues' },
        { value: 'bloodPressure', label: 'High blood pressure' },
        { value: 'heartDisease', label: 'Heart disease' },
        { value: 'depressionAnxiety', label: 'Depression/anxiety' },
        { value: 'cholesterol', label: 'High cholesterol' },
        { value: 'none', label: 'None' },

      ]
    };
  },
  methods: {
    async submitForm() {
      if (this.selectedOptions.length === 0) {
        alert('Please select at least one option.');
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
            selectedRiskFactors: this.selectedOptions,
            timestamp: new Date()
          });
          console.log('Data updated in Firestore');
        } else {
          await addDoc(collection(projectFirestore, "users"), {
            userEmail: user.email,
            selectedRiskFactors: this.selectedOptions,
            timestamp: new Date()
          });
          console.log('New document created in Firestore');
        }

        this.$router.push('/form/cut/qst7');
      } catch (error) {
        console.error("Error saving risk factors: ", error);
        alert('There was an error saving your selections. Please try again.');
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
  border-radius: 8px;
  padding: 20px;
}

.form-label {
  font-size: 1.3rem;
  margin-bottom: 15px;
  display: block;
  color: #333;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
}

.checkbox-label {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
}

.checkbox-custom {
  width: 24px;
  height: 24px;
  border: 2px solid #2ecc71;
  border-radius: 4px;
  margin-right: 12px;
  position: relative;
}

.checkbox-custom::after {
  content: '';
  display: block;
  width: 12px;
  height: 12px;
  background-color: #2ecc71;
  border-radius: 2px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.checkbox-label:hover .checkbox-custom::after {
  opacity: 0.5;
}

.checkbox-text {
  font-size: 1.1rem;
}

.checkbox-input {
  opacity: 0;
  position: absolute;
  width: 0;
  height: 0;
}

.checkbox-input:checked + .checkbox-custom::after {
  opacity: 1;
}

.submit-button {
  background-color: #2ecc71;
  color: white;
  padding: 12px 24px;
  font-size: 1.1rem;
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
