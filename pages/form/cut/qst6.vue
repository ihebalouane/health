<template>
    <div>
      <qstHeader />
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
          <button class="submit-button" @click="submitForm">Submit</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
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
      submitForm() {
        // Perform any necessary processing here
        // Navigate to the next page
        this.$router.push('/form/cut/qst7');
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
    border: 2px solid #007bff;
    border-radius: 4px;
    margin-right: 10px;
    position: relative;
  }
  
  .checkbox-custom::after {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    background-color: #007bff;
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
  