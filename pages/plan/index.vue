<template>
  <div class="center-container">
    <!-- Display user's email -->
    <div v-if="isAuthenticated" class="user-email">
      User Email: {{ clientEmail }}
    </div>
    <div class="container">
      <div class="section day-list-section">
        <div class="section-content">
          <ul class="day-list">
            <li v-for="(day, index) in days" :key="index" :class="{ 'selected': selectedDay === day.name }" @click="showItems(day.name)">
              <span class="day-text">{{ day.name }} - {{ day.date }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="section items-list-section">
        <div class="section-content">
          <ul class="items-list">
            <li v-for="(item, index) in selectedItems" :key="index" @click="loadVideo(item)">
              <span class="item-text">{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="section video-section">
        <div class="section-content">
          <video v-if="selectedVideo" controls loop :src="selectedVideo" :style="{ width: '100%', height: '100%' }">
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <div class="section gym-details-section">
        <div class="section-content">
          <h2>Gym Details</h2>
          <p>Welcome to our gym! {{ clientEmail }} Our facilities offer state-of-the-art equipment and professional trainers to help you achieve your fitness goals.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import planLogic from './plan';
import { ref } from 'vue';
import { projectFirestore } from '@/firebase/config.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import userState from '@/store/userState.js'; 

export default {
  middleware: 'auth',
  mixins: [planLogic],
  setup () {
    const clientEmail = userState.userEmail;
    const userData = ref(null);

    const getUserResponses = async () => {
      try {
        const q = query(collection(projectFirestore, 'userResponses'), where('userEmail', '==', clientEmail));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          userData.value = {
            ageRange: doc.data().ageRange,
            programType: doc.data().programType,
            selectedRiskFactors: doc.data().selectedRiskFactors,
            TobaccoUse: doc.data().TobaccoUse,
            height: doc.data().height,
            weight: doc.data().weight,
            weightGainReasons: doc.data().weightGainReasons,
            gender: doc.data().gender,
            goalWeight: doc.data().goalWeight,
            hoursOfSleep: doc.data().hoursOfSleep
          };
          console.log('User Data:', userData.value);
        });
      } catch (error) {
        console.error('Error fetching user responses:', error.message);
      }
    };

    getUserResponses(); // Call the function when the component is mounted

    return { clientEmail, userData };
  },
};
</script>



<style>
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: white;
}

.container {
  display: flex;
  width: 95%;
  max-width: 1500px;
  height: 500px;
  border: 2px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.section {
  flex: 1;
  overflow: hidden;
}

.section-content {
  padding: 20px;
  height: 100%;
}

.day-list,
.items-list {
  padding: 0;
  margin: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.day-list li,
.items-list li {
  margin: 0;
  padding: 0;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  transition: opacity 0.3s ease, background-color 0.3s ease;
}

.day-list li:not(:last-child):after,
.items-list li:not(:last-child):after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #ccc;
}

.selected {
  opacity: 0.5;
}

.day-text,
.item-text {
  transition: transform 0.2s ease;
  color: black; 
}

.day-list li:hover .day-text,
.items-list li:hover .item-text {
  transform: translateY(-5px); 
}

.gym-details-section {
  background-color: #fff;
}

.day-list li:hover,
.items-list li:hover {
  background-color: #f0f0f0;
}
</style>
