<template>
  <div>
    <qstHeader />
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
        <button class="submit-button" @click="submitForm">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>
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
    submitForm() {
      // Perform any necessary processing here
      // Navigate to the next page
      this.$router.push('/form/cut/qst11');
    }
  }
};
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 20px auto;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
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
  border: 2px solid #007bff;
  border-radius: 50%;
  margin-right: 10px;
  position: relative;
}

.radio-custom::after {
  content: '';
  display: block;
  width: 10px;
  height: 10px;
  background-color: #007bff;
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
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
