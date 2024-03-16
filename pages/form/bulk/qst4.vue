<template>
  <div>
    <qst-header />
    <BgAnimations/>
    <div class="page-container">
      <div class="form-container">
        <div class="modern-box">
          <h2 class="form-title">What's Your Goal Weight?</h2>
          <form class="weight-form" @submit.prevent="submitForm">
            <div class="form-group">
              <label for="weight" class="form-label">Weight (kg):</label>
              <input type="number" id="weight" name="weight" placeholder="Enter your goal weight" required v-model.number="weight" min="0" class="form-input">
            </div>
            <button type="submit" class="submit-button transition ease-in-out delay-200 bg-green-500 hover:-translate-y-0.5 hover:scale-200 hover:bg-green-600 duration-300 ...">
                  Next </button>          
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
  max-width: 400px; /* Reduce max-width for a smaller form */
  margin-top: 20px; /* Added space between the top and the form */
}

.modern-box {
  background-color: #ffffff; /* Change background color to white */
  border: none; /* Remove border */
  border-radius: 10px;
  padding: 20px; /* Reduce padding for a smaller form */
}

.form-title {
  font-size: 1.5rem; /* Reduce font size for the title */
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333; /* Adjust title color */
}

.form-group {
  margin-bottom: 15px; /* Reduce margin for a more compact form */
}

.form-label {
  font-size: 1.1rem; /* Reduce font size for labels */
  margin-bottom: 5px;
  display: block;
  color: #555; /* Adjust label color */
}

.form-input {
  width: 100%;
  padding: 12px; /* Reduce padding for input fields */
  font-size: 1rem; /* Reduce font size for input fields */
  border: 1px solid #ccc; /* Adjust border color */
  border-radius: 5px;
}

.submit-button {
  padding: 12px 20px; /* Reduce padding for the submit button */
  font-size: 1.1rem; /* Reduce font size for the submit button */
  background-color: #2ecc71; /* Change button color to green */
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.submit-button:hover {
  background-color: #27ae60; /* Adjust hover background color to a slightly darker shade of green */
}
</style>