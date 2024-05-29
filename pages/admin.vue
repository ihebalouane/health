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

    <!-- Users Table -->
    <div class="user-table">
      <div class="user-table-header">
        <div class="user-table-header-item">Email</div>
        <div class="user-table-header-item">First Name</div>
        <div class="user-table-header-item">Last Name</div>
        <div class="user-table-header-item">Gender</div>
        <div class="user-table-header-item">Birth Date</div>
        <div class="user-table-header-item">Profession</div>
        <div class="user-table-header-item">Coach</div>
        <div class="user-table-header-item">Actions</div>
      </div>
      <div
        v-for="(user, index) in filteredUsers"
        :key="index"
        :class="['user-table-row', { 'highlight': user.profession === 'Client' && !user.coach }]"
      >
        <div class="user-table-row-item">{{ user.userEmail }}</div>
        <div class="user-table-row-item">{{ user.firstName }}</div>
        <div class="user-table-row-item">{{ user.lastName }}</div>
        <div class="user-table-row-item">{{ user.gender }}</div>
        <div class="user-table-row-item">{{ user.birthDate }}</div>
        <div class="user-table-row-item">{{ user.profession }}</div>
        <div class="user-table-row-item">
          <span v-if="user.profession === 'Client'">{{ getCoachName(user.coach) }}</span>
          <span v-else>N/A</span>
        </div>
        <div class="user-table-row-item actions">
          <button @click="openModifyForm(user)" class="modify-button">
            <img src="@/assets/images/pen.jpg" alt="Modify" />
          </button>
          <button @click="confirmDeleteUser(user)" class="delete-button">
            <img src="@/assets/images/trash.jpg" alt="Delete" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modify form modal -->
    <div v-if="isFormVisible" class="modal-overlay" @click="closeForm">
      <div class="modal-content show centered-modal" @click.stop>
        <h3 class="modal-title">Modify User</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="first-name">First Name:</label>
            <input
              type="text"
              id="first-name"
              v-model="selectedUser.firstName"
              required
            />
          </div>
          <div class="form-group">
            <label for="last-name">Last Name:</label>
            <input
              type="text"
              id="last-name"
              v-model="selectedUser.lastName"
              required
            />
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
            <input
              type="date"
              id="birth-date"
              v-model="selectedUser.birthDate"
              required
            />
          </div>
          <div class="form-group">
            <label for="profession">Profession:</label>
            <input
              type="text"
              id="profession"
              v-model="selectedUser.profession"
              required
            />
          </div>
          <!-- Display Coach field only for users with profession 'Client' -->
          <div class="form-group" v-if="selectedUser.profession === 'Client'">
            <label for="coach">Coach:</label>
            <select id="coach" v-model="selectedUser.coach" required>
              <option value="">Select a Coach</option>
              <option
                v-for="coach in coaches"
                :value="coach.id"
                :key="coach.id"
              >
                {{ coach.firstName }} {{ coach.lastName }}
              </option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" class="save-button">Save</button>
            <button type="button" @click="closeForm" class="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <div
      v-if="isDeleteConfirmVisible"
      class="modal-overlay"
      @click="closeDeleteConfirm"
    >
      <div class="modal-content show centered-modal" @click.stop>
        <h3 class="modal-title">Confirm Deletion</h3>
        <p>Are you sure you want to delete this user?</p>
        <div class="form-buttons">
          <div class="form-buttons">
            <button type="submit" @click="deleteUser" class="save-button">
              Delete
            </button>
            <button
              type="button"
              @click="closeDeleteConfirm"
              class="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { projectFirestore } from "@/firebase/config.js";

const users = ref([]);
const selectedUser = ref(null);
const userToDelete = ref(null);
const isFormVisible = ref(false);
const isDeleteConfirmVisible = ref(false);
const searchQuery = ref("");
const orderBy = ref("firstName"); // Default order by first name

onMounted(async () => {
  const userCollection = collection(projectFirestore, "profile");
  const querySnapshot = await getDocs(userCollection);
  users.value = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
});

const filteredUsers = computed(() => {
  let filtered = users.value.filter((user) =>
    user.firstName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  if (orderBy.value) {
    filtered.sort((a, b) => (a[orderBy.value] > b[orderBy.value] ? 1 : -1));
  }
  return filtered;
});

const coaches = computed(() => {
  return users.value.filter((user) => user.profession === "Coach");
});

const openModifyForm = (user) => {
  selectedUser.value = { ...user };
  isFormVisible.value = true;
};

const closeForm = () => {
  isFormVisible.value = false;
};

const submitForm = async () => {
  const userRef = doc(projectFirestore, "profile", selectedUser.value.id);
  await updateDoc(userRef, selectedUser.value);
  // Update user in local state
  const index = users.value.findIndex(
    (user) => user.id === selectedUser.value.id
  );
  if (index !== -1) {
    users.value[index] = { ...selectedUser.value };
  }
  closeForm();
};

const confirmDeleteUser = (user) => {
  userToDelete.value = user;
  isDeleteConfirmVisible.value = true;
};

const closeDeleteConfirm = () => {
  isDeleteConfirmVisible.value = false;
  userToDelete.value = null;
};

const deleteUser = async () => {
  const userRef = doc(projectFirestore, "profile", userToDelete.value.id);
  await deleteDoc(userRef);
  users.value = users.value.filter((u) => u.id !== userToDelete.value.id);
  closeDeleteConfirm();
};

const getCoachName = (coachId) => {
  const coach = coaches.value.find(coach => coach.id === coachId);
  return coach ? `${coach.firstName} ${coach.lastName}` : 'Unassigned';
};
</script>

<style scoped>
.admin-page {
  padding: 20px;
}

.modify-button img,
.delete-button img {
  width: 16px;
  height: 16px;
}

.search-bar,
.order-by-select {
  display: block;
  margin-bottom: 20px;
  padding: 10px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.order-by {
  margin-bottom: 20px;
}

.user-table {
  display: table;
  width: 100%;
  border-collapse: collapse;
}

.user-table-header,
.user-table-row {
  display: table-row;
}

.user-table-header-item,
.user-table-row-item {
  display: table-cell;
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.user-table-header-item {
  font-weight: bold;
  background-color: #f5f5f5;
}

.modify-button,
.delete-button {
  margin-right: 10px;
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  background: none;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.centered-modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 20%; /* Adjust this as needed */
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
}

.modal-title {
  font-weight: bold; /* Bold */
  margin-bottom: 20px; /* Spacing below */
}

.form-group {
  margin-bottom: 15px;
}

.form-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.save-button,
.cancel-button {
  padding: 10px 20px;
  cursor: pointer;
}

.save-button {
  background-color: #4caf50;
  color: white;
  border: none;
  margin-right: 10px;
}

.cancel-button {
  background-color: #f44336;
  color: white;
  border: none;
}

.highlight {
  background-color: #ffcccc; /* Light red background */
}
</style>
