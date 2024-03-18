<template>
  <div>
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
        <router-link :to="'/form/bulk/qst6'">
          <button type="submit" class="submit-button transition ease-in-out delay-200 bg-green-500 hover:-translate-y-0.5 hover:scale-200 hover:bg-green-600 duration-300 ...">
                  Next </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { projectFirestore } from '../../../firebase/config'; // Adjust the path as necessary
import { collection, addDoc } from 'firebase/firestore';

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
        await addDoc(collection(projectFirestore, "exerciseFrequencies"), {
          frequency: this.exerciseFrequency,
          timestamp: new Date()
        });
        console.log("Exercise frequency saved!");
        this.$router.push('/form/bulk/qst6');
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
  max-width: 400px; /* Increased the max-width for a larger form */
  margin: 20px auto; 
  background-color: #ffffff; /* Changed background color to white */
  border: none; /* Removed border */
  border-radius: 8px;
  padding: 20px;
}

.form-label {
  font-size: 1.4rem; /* Increased font size */
  margin-bottom: 15px; /* Increased margin */
  display: block;
  color: #333; /* Adjusted label color */
}

.radio-group {
  display: flex;
  flex-direction: column;
}

.radio-label {
  display: flex;
  align-items: center;
  margin-bottom: 15px; /* Increased margin */
  cursor: pointer;
}

.radio-custom {
  width: 24px; /* Increased size */
  height: 24px; /* Increased size */
  border: 2px solid #2ecc71; /* Changed border color */
  border-radius: 50%;
  margin-right: 12px; /* Increased margin */
  position: relative;
}

.radio-custom::after {
  content: '';
  display: block;
  width: 12px; /* Increased size */
  height: 12px; /* Increased size */
  background-color: #2ecc71; /* Changed background color */
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.2s ease;
}

.radio-text {
  font-size: 1.2rem; /* Increased font size */
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
  background-color: #2ecc71; /* Changed button color */
  color: #fff;
  padding: 12px 24px; /* Increased padding */
  font-size: 1.2rem; /* Increased font size */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #27ae60; /* Adjusted hover background color */
}
</style>
