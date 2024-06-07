<template>
  <div>
    <site-header/>
    <qstHeader />
    <BgAnimations/>
    <div v-if="!isLoading" class="form-container">
      <div class="weight-gain-form">
        <label class="form-label">Why do you want to gain weight?</label>
        <div class="checkbox-group">
          <label class="checkbox-label" v-for="option in options" :key="option.value">
            <input type="checkbox" v-model="selectedOptions" :value="option.value" class="checkbox-input">
            <span class="checkbox-custom"></span>
            <span class="checkbox-text">{{ option.label }}</span>
          </label>
        </div>
        <div v-if="selectedOptions.includes('Other')" class="other-option">
          <label class="form-label">Please specify:</label>
          <input type="text" v-model="otherReason" class="other-input" @input="checkValidity">
        </div>
        
        <!-- Submit button -->
        <button class="submit-button" @click="submitForm" :disabled="isLoading">Next</button>

        <!-- Info box under the Next button -->
        <div class="info-box">
          <div class="info-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
          </div>
          <p>Weight gain can be beneficial for your health and energy levels. Make sure to consult a healthcare professional if you have any concerns.</p>
        </div>
      </div>
    </div>
    <loading-component v-if="isLoading" />
  </div>
</template>

<script>
import { projectFirestore, auth } from '../../../firebase/config';
import { collection, addDoc, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      isLoading: false,
      selectedOptions: [],
      otherReason: '',
      options: [
        { value: 'Improve health', label: 'To improve my overall health' },
        { value: 'Increase energy levels', label: 'To increase my energy levels' },
        { value: 'Boost confidence', label: 'To boost my confidence' },
        { value: 'Manage medical condition', label: 'To manage a medical condition' },
        { value: 'Improve appearance', label: 'To improve my physical appearance' },
        { value: 'Increase mobility', label: 'To increase my mobility' },
        { value: 'Enhance athletic performance', label: 'To enhance my athletic performance' },
        { value: 'Other', label: 'Other (please specify)' }
      ]
    };
  },
  methods: {
    async submitForm() {
      this.isLoading = true;

      try {
        await new Promise(resolve => setTimeout(resolve, 6000));

        const formData = {
          reasons: this.selectedOptions,
          ...(this.selectedOptions.includes('Other') && { otherReason: this.otherReason }),
          timestamp: new Date()
        };

        const user = auth.currentUser;
        if (!user) {
          console.error("User not logged in.");
          return;
        }
        
        const userDocRef = doc(projectFirestore, 'userResponses', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          await updateDoc(userDocRef, {
            weightGainReasons: formData,
            timestamp: new Date()
          });
          console.log("Weight gain reasons updated!");
        } else {
          await addDoc(collection(projectFirestore, "Bulk"), {
            weightGainReasons: formData,
            userEmail: user.email,
            timestamp: new Date()
          });
          console.log("New weight gain reasons saved!");
        }

        this.$router.push('/plan');
      } catch (error) {
        console.error("Error saving form data: ", error);
        alert('There was an error submitting your form. Please try again.');
      } finally {
        this.isLoading = false;
      }
    },
    checkValidity() {
      const submitButton = this.$refs.submitButton;
      if (submitButton) {
        submitButton.disabled = this.selectedOptions.includes('Other') && this.otherReason.trim() === '';
      }
    }
  }
};
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 20px auto;
  background-color: white;
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
  margin-right: 10px;
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

.other-option {
  margin-top: 20px;
}

.other-input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.info-box {
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
</style>
