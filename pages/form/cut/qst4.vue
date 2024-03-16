<template>
  <div>
    <qst-header />
    <div class="page-container">
      <div class="form-container">
        <div class="modern-box">
          <h2 class="form-title">What's Your Goal Weight?</h2>
          <form class="weight-form" @submit.prevent="submitForm">
            <div class="form-group">
              <label for="weight" class="form-label">Weight (kg):</label>
              <input type="number" id="weight" name="weight" placeholder="Enter your goal weight" required v-model.number="weight" min="0" class="form-input">
            </div>
            <button type="submit" class="submit-button">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      weight: null
    };
  },
  methods: {
    submitForm() {
      if (!this.weight || this.weight <= 0) {
        alert('Please enter a valid weight.');
        return;
      }
      this.$router.push('/form/bulk/qst5');
    }
  }
};
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align items to the top */
  height: 100vh;
}

.form-container {
  width: 100%;
  max-width: 500px;
  margin-top: 20px; /* Added space between the top and the form */
}

.modern-box {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-size: 1.2rem;
  margin-bottom: 10px;
  display: block;
}

.form-input {
  width: 100%;
  padding: 15px;
  font-size: 1rem;
  border: 1px solid #ced4da;
  border-radius: 5px;
}

.submit-button {
  padding: 15px 30px;
  font-size: 1.2rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
