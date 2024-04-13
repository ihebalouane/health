<template>
  <profile-header/>
  <div class="profile">
    <p>this is the email: {{ Email }}</p>
    <div class="profile-content">
      <!-- Profile Information Section -->
      <div class="info-section">
        <div class="form-group">
          <label for="first-name">First Name</label>
          <input type="text" id="first-name" v-model="firstName" required>
        </div>
        <div class="form-group">
          <label for="last-name">Last Name</label>
          <input type="text" id="last-name" v-model="lastName" required>
        </div>
        <div class="form-group">
          <label for="gender">Gender</label>
          <select id="gender" v-model="gender" required>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Rather not to say</option>
          </select>
        </div>
        <div class="form-group">
          <label for="birth-date">Birth Date</label>
          <input type="date" id="birth-date" v-model="birthDate" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required>
        </div>
      </div>

      <!-- Change Password Section -->
      <div class="password-section">
        <div class="profilpic" @mouseenter="showEditIcon" @mouseleave="hideEditIcon" @click="handleProfilePicClick">
          <input type="file" id="file-input" accept="image/*" style="display: none;" ref="fileInput">
          <span class="profile-pic-icon"></span>
          <!-- Add a span with a class for the profile picture icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 edit-icon" v-if="showIcon">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
          </svg>
          <div>This is the profile pic</div>
        </div>
        <div class="form-group">
          <label for="current-password">Current Password</label>
          <input type="password" id="current-password" v-model="currentPassword" required>
        </div>
        <div class="form-group">
          <label for="new-password">New Password</label>
          <input type="password" id="new-password" v-model="newPassword" required>
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirm Password</label>
          <input type="password" id="confirm-password" v-model="confirmPassword" required>
        </div>
      </div>
    </div>
    <button type="submit" @click="handleSubmit">Save</button>
  </div>
</template>

<script>
import userState from '@/store/userState.js';

export default {
  setup() {
    const Email = userState.userEmail;
    const firstName = ref('');
    const lastName = ref('');
    const gender = ref('');
    const birthDate = ref('');
    // const email = ref('');
    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const showIcon = ref(false);

    const handleSubmit = () => {
      // Handle form submission here
    };

    const showEditIcon = () => {
      showIcon.value = true;
    };

    const hideEditIcon = () => {
      showIcon.value = false;
    };

    const handleProfilePicClick = () => {
      // Trigger click event on file input when profile picture is clicked
      const fileInput = document.getElementById('file-input');
      fileInput.click();
    };

    return {
      firstName,
      lastName,
      gender,
      birthDate,
      Email,
      currentPassword,
      newPassword,
      confirmPassword,
      handleSubmit,
      showIcon,
      showEditIcon,
      hideEditIcon,
      handleProfilePicClick
    };
  },
};
</script>

<style lang="scss" scoped>
/* Existing styles */

.profile {
  // Your profile styles here
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-content {
  width: 90%; 
  max-width: 800px; 
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.info-section {
  width: 48%; 
}

.password-section {
  width: 48%; 
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="date"],
input[type="email"],
input[type="password"],
select,
button {
  width: 100%;
  padding: 10px 16px; /* Adjust padding */
  font-size: 16px; /* Adjust font size */
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  border: none;
  border-radius: 25px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

/* New styles for profile picture icon */
.profilpic {
  text-align: center;
  position: relative; /* Add position relative for absolute positioning */
}

.profile-pic-icon {
  display: inline-block;
  width: 100px;
  height: 100px;
  background-color: #ccc; /* Placeholder color */
  border-radius: 50%; /* Make it a circle */
  margin-bottom: 10px; /* Adjust spacing */
  cursor: pointer; /* Change cursor to pointer */
}

.profile-pic-icon:hover {
  background-color: #e0e0e0; /* Change background color on hover */
}

.edit-icon {
  position: absolute; /* Position the edit icon */
  top: 50%; /* Align to the center vertically */
  left: 50%; /* Align to the center horizontally */
  transform: translate(-50%, -50%); /* Center the icon precisely */
  display: none; /* Initially hide the icon */
}

.profilpic:hover .edit-icon {
  display: block; /* Show the edit icon when hovering over the profile picture */
}
</style>
