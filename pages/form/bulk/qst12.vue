<template>
  <div>
    <qstHeader />
    <BgAnimations/>
    <div class="form-container">
      <div class="weight-loss-form">
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
        <button class="submit-button transition ease-in-out delay-200 bg-green-500 hover:-translate-y-0.5 hover:scale-200 hover:bg-green-600 duration-300 ..."
         @click="submitForm" :disabled="selectedOptions.includes('Other') && otherReason.trim() === ''">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import { projectFirestore } from '../../../firebase/config'; // Update this path
import { collection, addDoc } from 'firebase/firestore';

export default {
  data() {
    return {
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
      // Validate input
      if (this.selectedOptions.length === 0 || (this.selectedOptions.includes('Other') && this.otherReason.trim() === '')) {
        alert('Please make a selection or specify a reason.');
        return;
      }
      
      // Prepare data for Firestore
      const formData = {
        reasons: this.selectedOptions,
        ...(this.selectedOptions.includes('Other') && { otherReason: this.otherReason }),
        timestamp: new Date()
      };

      try {
        // Save the form data to Firestore
        await addDoc(collection(projectFirestore, "weightGainReasons"), formData);
        console.log("Form data saved successfully!");
        this.$router.push('/form/bulk/qst13'); // Navigate to the next question
      } catch (error) {
        console.error("Error saving form data: ", error);
        alert('There was an error submitting your form. Please try again.');
      }
    },
    checkValidity() {
      // Additional method to handle form validation if needed
      // Adjusted to enable/disable the submit button based on form data
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
  background-color: #fff; /* Changed background color to white */
  border-radius: 8px; /* Removed border */
  padding: 20px;
  box-shadow: none; /* Removed box shadow */
}  
.form-label {
  font-size: 1.2rem;
  margin-bottom: 10px;
  display: block;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
}

.checkbox-label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #2ecc71; /* Changed border color */
  border-radius: 4px;
  margin-right: 10px;
  position: relative;
}

.checkbox-custom::after {
  content: '';
  display: block;
  width: 10px;
  height: 10px;
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
  font-size: 1rem;
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
  margin-bottom: 10px;
}

.submit-button {
  background-color: #2ecc71; /* Changed button color */
  color: #fff;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #27ae60; /* Adjusted hover background color */
}
</style>
