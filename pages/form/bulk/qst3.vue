<template>
  <div>
    <qst-header/>
    <BgAnimations/>
    <div class="container">
      <div class="age-form">
        <h2 class="form-title">Select Your Age Range:</h2>
        <div class="input-group">
          <label for="age" class="form-label">Age:</label>
          <select v-model="selectedAge" id="age" class="form-select">
            <option value="under 20">Under 20</option>
            <option value="20s">20s</option>
            <option value="30s">30s</option>
            <option value="40s">40s</option>
            <option value="50s">50s</option>
            <option value="60s">60s</option>
          </select>
        </div>
        <button @click="submitForm" class="submit-button transition ease-in-out delay-200 bg-green-500 hover:-translate-y-0.5 hover:scale-200 hover:bg-green-600 duration-300 ...">
          Next </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedAge: ''
    };
  },
  methods: {
    submitForm() {
      alert('Selected age range: ' + this.selectedAge);
      this.$router.push('/form/bulk/qst4');
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Adjust alignment to the top */
  height: 100vh;
  margin-top: 50px; /* Move the container closer to the top */
}

.age-form {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  border-radius: 10px;
  background-color: #ffffff; /* Change background color to white */
}

.form-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.input-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: #555;
}

.form-select {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #333;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #2ecc71; /* Change button color to green */
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #27ae60; /* Adjust hover background color to a slightly darker shade of green */
}
</style>