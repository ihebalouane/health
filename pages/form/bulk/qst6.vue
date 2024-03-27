<template>
  <div>
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
        { value: 'cholesterol', label: 'High cholesterol' }
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
          // Handle user not logged in
          return;
        }

        // Query Firestore to find if there's an existing document with the user's email
        const userDocRef = collection(projectFirestore, "users");
        const q = query(userDocRef, where("userEmail", "==", user.email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // If document exists, update it with the new data
          const doc = querySnapshot.docs[0];
          await updateDoc(doc.ref, {
            selectedRiskFactors: this.selectedOptions,
            timestamp: new Date()
          });
          console.log('Data updated in Firestore');
        } else {
          // If document doesn't exist, create a new one with the provided data
          await addDoc(collection(projectFirestore, "users"), {
            userEmail: user.email,
            selectedRiskFactors: this.selectedOptions,
            timestamp: new Date()
          });
          console.log('New document created in Firestore');
        }

        // Redirect to the next question
        this.$router.push('/form/bulk/qst7');
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
  max-width: 400px; /* Adjusted the max-width to make the form slightly larger */
  margin: 20px auto; 
  background-color: #ffffff; /* Changed background color to white */
  border: none; /* Removed border */
  border-radius: 8px;
  padding: 20px;
}

.form-label {
  font-size: 1.3rem; /* Increased font size */
  margin-bottom: 15px; /* Increased margin bottom */
  display: block;
  color: #333; /* Adjusted label color */
}

.checkbox-group {
  display: flex;
  flex-direction: column;
}

.checkbox-label {
  display: flex;
  align-items: center;
  margin-bottom: 15px; /* Increased margin bottom */
  cursor: pointer;
}

.checkbox-custom {
  width: 24px; /* Increased width */
  height: 24px; /* Increased height */
  border: 2px solid #2ecc71; /* Changed border color */
  border-radius: 4px;
  margin-right: 12px; /* Increased margin right */
  position: relative;
}

.checkbox-custom::after {
  content: '';
  display: block;
  width: 12px; /* Increased width */
  height: 12px; /* Increased height */
  background-color: #2ecc71; /* Changed background color */
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
  font-size: 1.1rem; /* Increased font size */
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
  background-color: #2ecc71; /* Changed button color */
  color: #fff;
  padding: 12px 24px; /* Increased padding */
  font-size: 1.1rem; /* Increased font size */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #27ae60; /* Adjusted hover background color */
}
</style>
