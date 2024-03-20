<template>
  <div>
    <qstHeader />
    <BgAnimations/>
    <div class="form-container">
      <div class="sleep-form">
        <label class="form-label">How many hours of sleep do you typically get per night?</label>
        <div class="radio-group">
          <label class="radio-label" v-for="option in options" :key="option.value">
            <input type="radio" v-model="hoursOfSleep" :value="option.value" class="radio-input">
            <span class="radio-custom"></span>
            <span class="radio-text">{{ option.label }}</span>
          </label>
        </div>
        <button @click="submitForm" class="submit-button transition ease-in-out delay-200 bg-green-500 hover:-translate-y-0.5 hover:scale-200 hover:bg-green-600 duration-300">
          Next </button>
      </div>
    </div>
  </div>
</template>

<script>
import { projectFirestore } from '../../../firebase/config'; 
import { collection, addDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      hoursOfSleep: null,
      options: [
        { value: 4, label: 'Less than 4 hours' },
        { value: 5, label: '4-5 hours' },
        { value: 6, label: '5-6 hours' },
        { value: 7, label: '6-7 hours' },
        { value: 8, label: '7-8 hours' },
        { value: 9, label: '8-9 hours' },
        { value: 10, label: '9-10 hours' },
        { value: 11, label: '10-11 hours' },
        { value: 12, label: 'More than 11 hours' }
      ]
    };
  },
  methods: {
    async submitForm() {
      if (!this.hoursOfSleep) {
        alert('Please select your typical hours of sleep.');
        return;
      }

      try {
        await addDoc(collection(projectFirestore, "Bulk"), {
          hoursOfSleep: this.hoursOfSleep,
          timestamp: new Date()
        });
        console.log("Sleep data saved!");
        this.$router.push('/form/bulk/qst11');
      } catch (error) {
        console.error("Error saving sleep data: ", error);
        alert('There was an error saving your sleep data. Please try again.');
      }
    }
  }
};
</script>



<style scoped>
.form-container {
  max-width: 400px;
  margin: 20px auto;
  background-color: #fff; 
  border-radius: 8px; 
  padding: 20px;
  box-shadow: none; 
}

.form-label {
  font-size: 1.2rem;
  margin-bottom: 10px;
  display: block;
}

.radio-group {
  display: flex;
  flex-direction: column;
}

.radio-label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
}

.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #2ecc71; 
  border-radius: 50%;
  margin-right: 10px;
  position: relative;
}

.radio-custom::after {
  content: '';
  display: block;
  width: 10px;
  height: 10px;
  background-color: #2ecc71; 
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.2s ease;
}

.radio-text {
  font-size: 1rem;
}

.radio-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.radio-input:checked + .radio-custom::after {
  transform: translate(-50%, -50%) scale(1);
}

.submit-button {
  background-color: #2ecc71;
  color: #fff;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #27ae60;
}
</style>
