<template>
  <profile-header/>
  <div class="profile">
    <BgAnimations/>
    <div class="profile-content" style="margin-bottom: 10px;"> <!-- Adjusted margin-bottom -->
      <!-- Profile Information Section -->
      <div class="info-section box">
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
          <input type="email" id="userEmail" v-model="email" required disabled>
        </div>
        <div class="form-group">
          <label for="profession">Profession</label>
          <input type="text" id="profession" v-model="profession" readonly="readonly">
        </div>
      </div>

      <!-- Change Password Section -->
      <div class="password-section box">
        <div class="profilpic" @mouseenter="showEditIcon" @mouseleave="hideEditIcon" @click="handleProfilePicClick">
          <input type="file" id="file-input" accept="image/*" style="display: none;" ref="fileInput" @change="handleFileUpload">
          <span class="profile-pic-icon">
            <img v-if="profilePicture" :src="profilePicture" alt="Profile Picture" class="profile-picture">
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-6 h-6 edit-icon" v-if="showIcon">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
          </svg>
        </div>
        <br>
        <hr class="divider" />

        <br>
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
    <button type="submit" @click="handleSubmit" class="save-button">Save</button>
  </div>
</template>

<script>
  import { ref, onMounted } from 'vue';
  import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
  import { projectFirestore } from '@/firebase/config.js';
  import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

  export default {
    setup() {
      const userEmail = ref('');
      const firstName = ref('');
      const lastName = ref('');
      const gender = ref('');
      const birthDate = ref('');
      const profession = ref('Client'); // Default profession value
      const currentPassword = ref('');
      const newPassword = ref('');
      const confirmPassword = ref('');
      const showIcon = ref(false);
      const profilePicture = ref(null);

      // Set email field value to the value of userEmail
      onMounted(() => {
        userEmail.value = localStorage.getItem('email') || '';
        // Retrieve user's profile data from Firestore if available
        getProfileData();
      });

      const getProfileData = async () => {
        try {
          const profileDoc = await getDoc(doc(projectFirestore, 'profile', userEmail.value));
          if (profileDoc.exists()) {
            const data = profileDoc.data();
            firstName.value = data.firstName || '';
            lastName.value = data.lastName || '';
            gender.value = data.gender || '';
            birthDate.value = data.birthDate || '';
            profession.value = data.profession || 'Client'; // Set profession field value
            profilePicture.value = data.profilePicture || null;
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };

      const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
          // Read the file as a data URL
          const reader = new FileReader();
          reader.onload = () => {
            profilePicture.value = reader.result;
          };
          reader.readAsDataURL(file);
        }
      };

      const handleSubmit = async () => {
        try {
          const auth = getAuth();
          const user = auth.currentUser;

          // Reauthenticate user
          const credential = EmailAuthProvider.credential(user.email, currentPassword.value);
          await reauthenticateWithCredential(user, credential);

          // Update password
          await updatePassword(user, newPassword.value);
          console.log('Password updated successfully!');
        } catch (error) {
          console.error('Error updating password:', error);
          // Handle error here, e.g., show error message to user
        }

        // Update profile data
        const profileData = {
          firstName: firstName.value,
          lastName: lastName.value,
          gender: gender.value,
          birthDate: birthDate.value,
          userEmail: userEmail.value, // Save email
          profession: profession.value, // Save profession
          profilePicture: profilePicture.value, // Save profile picture
        };

        try {
          const profileRef = doc(projectFirestore, 'profile', userEmail.value);
          await setDoc(profileRef, profileData);
          console.log('Profile data saved successfully!');
        } catch (error) {
          console.error('Error saving profile data:', error);
        }
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
        userEmail,
        profession,
        currentPassword,
        newPassword,
        confirmPassword,
        handleSubmit,
        showIcon,
        showEditIcon,
        hideEditIcon,
        handleProfilePicClick,
        profilePicture,
        handleFileUpload
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
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-wrap: wrap; /* Allow content to wrap to the next line */
    justify-content: space-between;
    margin-bottom: 30px;
  }

  .info-section,
  .password-section {
    width: calc(50% - 20px); /* Adjust width to fit two sections in one row */
    margin-bottom: 20px;
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
    box-sizing: border-box; /* Include padding and border in the width */
  }

  button {
    background-color: #2ecc71;
    color: #fff;
    cursor: pointer;
    border: none;
    border-radius: 25px;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #2ecc71;
  }

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
    overflow: hidden; /* Ensure the image fits inside the circle */
  }

  .profile-picture {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Make sure the image covers the entire space */
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

  .box {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 20px;
  }

  .divider {
    margin: 20px 0; /* Adjust the margin as needed */
    border: none;
    border-top: 1px solid #ccc;
  }

  .save-button {
    width: 120px; /* Adjust the width as needed */
    padding: 10px; /* Adjust padding */
    font-size: 16px; /* Adjust font size */
    margin-top: 20px; /* Add margin-top to separate from the form */
  }
</style>
