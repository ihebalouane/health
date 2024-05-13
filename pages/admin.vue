<template>
  <div class="admin-page">
      <h2>All Users</h2>
      <!-- Search bar -->
      <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by first name"
          class="search-bar"
      />

      <!-- Order by dropdown -->
      <div class="order-by">
          <label for="order-by-select">Order by:</label>
          <select id="order-by-select" v-model="orderBy" class="order-by-select">
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="email">Email</option>
              <option value="profession">Profession</option>
          </select>
      </div>

      <div class="user-list">
          <div v-for="(user, index) in filteredUsers" :key="index" class="user-item">
              <div class="user-details">
                  <div class="user-info">
                      <p><strong>Email:</strong> {{ user.userEmail }}</p>
                      <p><strong>First Name:</strong> {{ user.firstName }}</p>
                      <p><strong>Last Name:</strong> {{ user.lastName }}</p>
                      <p><strong>Gender:</strong> {{ user.gender }}</p>
                      <p><strong>Birth Date:</strong> {{ user.birthDate }}</p>
                      <p><strong>Profession:</strong> {{ user.profession }}</p>
                      <p v-if="user.profession === 'Client'"><strong>Coach:</strong> {{ user.coach || 'Not Assigned' }}</p>
                  </div>
                  <div class="action-buttons">
                      <button @click="openModifyForm(user)" class="modify-button">Modify</button>
                      <button @click="deleteUser(user)" class="delete-button">Delete</button>
                  </div>
              </div>
          </div>
      </div>

      <!-- Modify form modal -->
      <div v-if="isFormVisible" class="modal-overlay" @click="closeForm">
          <div class="modal-content show" @click.stop>
              <h3>Modify User</h3>
              <form @submit.prevent="submitForm">
                  
                  <div class="form-group">
                      <label for="first-name">First Name:</label>
                      <input type="text" id="first-name" v-model="selectedUser.firstName" required />
                  </div>
                  <div class="form-group">
                      <label for="last-name">Last Name:</label>
                      <input type="text" id="last-name" v-model="selectedUser.lastName" required />
                  </div>
                  <div class="form-group">
                      <label for="gender">Gender:</label>
                      <select id="gender" v-model="selectedUser.gender" required>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Rather not say</option>
                      </select>
                  </div>
                  <div class="form-group">
                      <label for="birth-date">Birth Date:</label>
                      <input type="date" id="birth-date" v-model="selectedUser.birthDate" required />
                  </div>
                  <div class="form-group">
                      <label for="profession">Profession:</label>
                      <input type="text" id="profession" v-model="selectedUser.profession" required />
                  </div>
                  <!-- Display Coach field only for users with profession 'Client' -->
                  <div class="form-group" v-if="selectedUser.profession === 'Client'">
                      <label for="coach">Coach:</label>
                      <select id="coach" v-model="selectedUser.coach">
                          <option value="">Select a Coach</option>
                          <option v-for="coach in coaches" :value="coach.id" :key="coach.id">
                              {{ coach.firstName }} {{ coach.lastName }}
                          </option>
                      </select>
                  </div>

                  <div class="form-buttons">
                      <button type="submit" class="save-button">Save</button>
                      <button type="button" @click="closeForm" class="cancel-button">Cancel</button>
                  </div>
              </form>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { projectFirestore } from '@/firebase/config.js';

const users = ref([]);
const selectedUser = ref(null);
const isFormVisible = ref(false);
const searchQuery = ref('');
const orderBy = ref('firstName'); // Default order by first name

onMounted(async () => {
  const userCollection = collection(projectFirestore, 'profile');
  const querySnapshot = await getDocs(userCollection);
  users.value = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
});

const filteredUsers = computed(() => {
  let filtered = users.value.filter(user =>
      user.firstName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  if (orderBy.value) {
      filtered.sort((a, b) => (a[orderBy.value] > b[orderBy.value] ? 1 : -1));
  }
  return filtered;
});

const coaches = computed(() => {
  return users.value.filter(user => user.profession === 'Coach');
});

const openModifyForm = (user) => {
  selectedUser.value = { ...user };
  isFormVisible.value = true;
};

const closeForm = () => {
  isFormVisible.value = false;
};

const submitForm = async () => {
  const userRef = doc(projectFirestore, 'profile', selectedUser.value.id);
  await updateDoc(userRef, selectedUser.value);
  closeForm();
  // Optionally: Reload users data or refetch individual user data here
};

const deleteUser = async (user) => {
  const userRef = doc(projectFirestore, 'profile', user.id);
  await deleteDoc(userRef);
  users.value = users.value.filter(u => u.id !== user.id);
};
</script>

<style scoped>
/* Base styles */
.admin-page {
  padding: 20px;
  font-family: 'Poppins', sans-serif; /* Modern font */
  color: #333;
  line-height: 1.6;
}

h2 {
  margin-bottom: 20px;
  color: #212121;
  font-size: 28px;
  font-weight: 700; /* Bold weight for emphasis */
  text-align: center; /* Center-align the text */
}


/* Updated search bar styles */
.search-bar {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 2px solid #e0e0e0; /* Light border */
  font-size: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background-color: #f8f9fa; /* Light gray background */
  outline: none; /* Remove default outline */
}

.search-bar:focus {
  border-color: #2ecc71; /* Blue border on focus */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Shadow effect on focus */
  background-color: #ffffff; /* White background on focus */
}

/* Updated order by dropdown styles */
.order-by {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.order-by label {
  margin-right: 12px;
  color: #212121;
  font-size: 16px;
}

.order-by-select {
  padding: 10px 12px;
  border-radius: 8px;
  border: 2px solid #e0e0e0; /* Light border */
  font-size: 16px;
  background-color: #f8f9fa; /* Light gray background */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  outline: none; /* Remove default outline */
}

.order-by-select:focus {
  border-color: #2ecc71; /* Blue border on focus */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Shadow effect on focus */
  background-color: #ffffff; /* White background on focus */
}

/* User list container */
.user-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* User item card */
.user-item {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  cursor: pointer; /* Indicates interactiveness */
}

.user-item:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transform: translateY(-4px); /* Slight upward lift */
}

/* User info styles */
.user-info p {
  margin: 5px 0;
  color: #555;
  font-size: 16px;
}

.user-info p strong {
  color: #212121;
}

/* Action buttons */
.action-buttons {
  display: flex;
  gap: 10px;
}

.modify-button,
.delete-button {
  padding: 10px 15px;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.modify-button {
  background-color: #2ecc71; /* Blue */
  color: #ffffff;
}

.delete-button {
  background-color: #dc3545; /* Red */
  color: #ffffff;
}

.modify-button:hover {
  background-color: #0056b3; /* Darker blue */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.delete-button:hover {
  background-color: #c82333; /* Darker red */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  width: 90%;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0;
  transform: scale(0.95);
}

.modal-content.show {
  opacity: 1;
  transform: scale(1);
}

/* Form group and button styles */
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #212121;
  font-size: 16px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 2px solid #ced4da; /* Light border */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #007bff; /* Blue border on focus */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-buttons {
  display: flex;
  justify-content: space-between;
}

.save-button,
.cancel-button {
  padding: 10px 15px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  color: #ffffff;
}

.save-button {
  background-color: #28a745; /* Green */
}

.cancel-button {
  background-color: #6c757d; /* Gray */
}

.save-button:hover {
  background-color: #218838; /* Darker green */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.cancel-button:hover {
  background-color: #5a6268; /* Darker gray */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
