<template>
    <div>
      <qstHeader />
      <div class="form-container">
        <div class="diet-form">
          <label class="form-label">How would you describe your current diet?</label>
          <div class="radio-group">
            <label class="radio-label" v-for="option in options" :key="option.value">
              <input type="radio" v-model="selectedOption" :value="option.value" class="radio-input" @click="handleRadioClick(option)">
              <span class="radio-custom"></span>
              <span class="radio-text">{{ option.label }}</span>
            </label>
          </div>
          <div v-if="selectedOption === 'Other'" class="other-option">
            <label class="form-label">Please specify:</label>
            <input type="text" v-model="otherDescription" class="other-input" @input="checkValidity">
          </div>
          <button class="submit-button" @click="submitForm" :disabled="selectedOption === 'Other' && otherDescription.trim() === ''" ref="submitButton">Submit</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedOption: '',
        otherDescription: '',
        options: [
          { value: 'Balanced', label: 'Balanced' },
          { value: 'High in processed foods', label: 'High in processed foods' },
          { value: 'Vegetarian', label: 'Vegetarian' },
          { value: 'Vegan', label: 'Vegan' },
          { value: 'Paleo', label: 'Paleo' },
          { value: 'Keto', label: 'Keto' },
          { value: 'Low-carb', label: 'Low-carb' },
          { value: 'Other', label: 'Other' }
        ]
      };
    },
    methods: {
      submitForm() {
        // Perform any necessary processing here
        // Navigate to the next page
        this.$router.push('/form/cut/qst12');
      },
      handleRadioClick(option) {
        if (option.value !== 'Other') {
          this.otherDescription = ''; // Clear other description if a non-Other option is selected
        }
      },
      checkValidity() {
        if (this.selectedOption !== 'Other') {
          return; // No need to check validity if other option is not selected
        }
        if (this.otherDescription.trim() !== '') {
          this.$refs.submitButton.removeAttribute('disabled'); // Enable submit button if text is entered
        } else {
          this.$refs.submitButton.setAttribute('disabled', 'disabled'); // Disable submit button if text is empty
        }
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
  