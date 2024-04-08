<template>
  <div class="container">
    <div class="box">
      <div class="left-section">
        <div class="info">
          <h2>Profile</h2>
          <div><strong>First Name:</strong> {{ firstName }}</div>
          <div><strong>Last Name:</strong> {{ lastName }}</div>
          <div><strong>Age:</strong> {{ age }}</div>
        </div>
        <hr class="line"> <!-- Separate line between Profile and Infos -->

        <!-- Infos Section -->
        <div class="section" :class="{ active: showInfoForm }" @click="toggleInfoSection">
          <h3>Infos</h3>
        </div>

        <!-- Divider Line -->
        <hr class="divider">

        <!-- Security Section -->
        <div class="section" :class="{ active: showSecurityForm }" @click="toggleSecuritySection">
          <h3>Security</h3>
        </div>
      </div>

      <div class="right-section">
        <div v-if="showInfoForm">
          <h2>Edit Profile</h2>
          <form @submit.prevent="updateName">
            <div class="form-group">
              <label for="editFirstName">First Name:</label>
              <input type="text" id="editFirstName" v-model="editedFirstName" />
            </div>
            <div class="form-group">
              <label for="editLastName">Last Name:</label>
              <input type="text" id="editLastName" v-model="editedLastName" />
            </div>
            <button type="submit">Save</button>
          </form>
        </div>

        <div v-if="showSecurityForm">
          <h2>Change Password</h2>
          <form @submit.prevent="updatePassword">
            <div class="form-group">
              <label for="password">New Password:</label>
              <input type="password" id="password" v-model="newPassword" />
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirm Password:</label>
              <input type="password" id="confirmPassword" v-model="confirmPassword" />
            </div>
            <button type="submit">Save</button>
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
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      editedFirstName: '',
      editedLastName: '',
      newPassword: '',
      confirmPassword: '',
      showInfoForm: false,
      showSecurityForm: false
    };
  },
  methods: {
    toggleInfoSection() {
      this.showInfoForm = !this.showInfoForm;
      this.showSecurityForm = false;
    },
    toggleSecuritySection() {
      this.showSecurityForm = !this.showSecurityForm;
      this.showInfoForm = false;
    },
    updateName() {
      this.firstName = this.editedFirstName;
      this.lastName = this.editedLastName;
      // Reset input fields and hide form
      this.editedFirstName = '';
      this.editedLastName = '';
      this.showInfoForm = false;
    },
    updatePassword() {
      // Add logic to update password
      // Reset input fields and hide form
      this.newPassword = '';
      this.confirmPassword = '';
      this.showSecurityForm = false;
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.box {
  border: 2px solid #ccc;
  display: flex;
  max-width: 1000px;
  width: 90%;
}

.left-section,
.right-section {
  flex: 1;
}

.left-section {
  border-right: 2px solid #ccc;
  padding: 20px;
}

.right-section {
  padding: 20px;
}

.info {
  border: 1px solid #ccc;
  padding: 10px;
}

.section {
  cursor: pointer;
  margin-bottom: 20px;
}

.section.active {
  background-color: #f0f0f0;
}

.divider {
  border-top: 1px solid #ccc;
  margin: 20px 0;
}

.line {
  border-top: 1px solid #ccc;
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  margin-bottom: 5px;
}

input[type="text"],
input[type="number"],
input[type="password"] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
