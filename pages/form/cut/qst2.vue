<template>
  <div>
    <qst-header/>
    <div class="page-container">
      <div class="form-container">
        <h2 class="form-title">Enter Your Height and Weight</h2>
        <form class="height-weight-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="height">Height (cm):</label>
            <input type="number" id="height" name="height" placeholder="Enter height" required v-model="height">
          </div>
          <div class="form-group">
            <label for="weight">Weight (kg):</label>
            <input type="number" id="weight" name="weight" placeholder="Enter weight" required v-model="weight">
          </div>
          <button type="submit" class="submit-button">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      height: null,
      weight: null
    };
  },
  methods: {
    handleSubmit() {
      this.$router.push('/form/cut/qst3');
    },
    handleSvgButtonClick() {
      // Handle SVG button click action here
      console.log('SVG button clicked');
    }
  }
};
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align items to the top of the page */
  height: 100vh;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  text-decoration: none;
}

.svg-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
}

.svg-icon {
  fill: none;
  stroke-width: 1.5;
  stroke: #007bff; /* Adjust color as needed */
}

.svg-button:hover .svg-icon {
  stroke: #0056b3; /* Adjust hover color as needed */
}

.form-container {
  width: 80%;
  max-width: 400px;
  padding: 20px;
  margin-top: 50px; /* Adjust margin top to move the form closer to the top */
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9; /* Add background color */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* Add box shadow for depth */
  text-align: center; /* Center the form content */
}

.form-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333; /* Adjust title color */
}

.height-weight-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: #555; /* Adjust label color */
}

input[type="number"] {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  outline: none; /* Remove input outline */
}

.submit-button {
  padding: 10px 20px;
  font-size: 1.2rem;
  background-color: #007bff; /* Adjust button color */
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  outline: none; /* Remove button outline */
}

.submit-button:hover {
  background-color: #0056b3; /* Adjust button hover color */
}
</style>
