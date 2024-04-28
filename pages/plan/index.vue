<template>
  <site-header />
  <div class="center-container">
    <!-- Display user's email -->
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
          <p>Welcome to our gym! {{ userEmail }} Our facilities offer state-of-the-art equipment.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { projectFirestore } from '@/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { videosMap } from './video'; // Importing the videos map

export default {
  middleware: 'auth',
  setup() {
    const userEmail = ref('');
    const selectedItems = ref([]);
    const selectedDay = ref(null);
    const selectedVideo = ref(null);
    const days = ref([]);

    // Fetch user's email when component is mounted
    onMounted(() => {
      userEmail.value = localStorage.getItem('email') || '';
    });

    // Function to fetch user responses from Firestore
    const getUserResponses = async () => {
      try {
        const localEmail = localStorage.getItem('email');
        const q = query(collection(projectFirestore, 'userResponses'), where('userEmail', '==', localEmail));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const ageRange = data.ageRange;
          const weight = data.weight;
          const goalWeight = data.goalWeight;

          // Check if the user's age range is 20s and the goal weight is greater than the current weight
          if (ageRange === '20s' && goalWeight > weight) {
            program1(selectedDay.value);
          }
        });
      } catch (error) {
        console.error(error.message);
      }
    };

    // Function for the specific program 1
    const program1 = (day) => {
      if (day === 'Monday') { //Chest day + Triceps
        selectedItems.value = ['Bench Press','Dumbbell press', 'Cable Crossover','Landmine Press'];
      } else if (day === 'Tuesday') { //Back day + Biceps
        selectedItems.value = ['Lat Pulldowns','Dumbell Single','Pull ups', 'Pulls', ];
      } else if (day === 'Friday') { //Shoulders day
        selectedItems.value = ['Squat','Deadlift','Front squat', 'Goblet', 'Lunge'];
      } else if (day === 'Thursday') { //Legs day
        selectedItems.value = ['Cable pull','Front raise','Face Pull', 'High Pull', 'Raise'];
      }
    };

    // Call the function when the component is mounted
    getUserResponses();

    // Function to update the selected day
    const showItems = (day) => {
      selectedDay.value = day;
      getUserResponses(); // Call getUserResponses to update the items based on the selected day
    };

    // Function to load video based on the selected item
    const loadVideo = (item) => {
      if (videosMap.hasOwnProperty(item)) {
        selectedVideo.value = videosMap[item];
      } else {
        console.error(`Video URL not found for item: ${item}`);
      }
    };

    // Function to calculate and set the days of the week starting from the next Monday
    const calculateDays = () => {
      const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const currentDate = new Date();
      const currentDayIndex = currentDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
      const nextMonday = new Date(currentDate);
      nextMonday.setDate(currentDate.getDate() + ((7 - currentDayIndex) % 7)); // Calculate next Monday

      for (let i = 0; i < daysOfWeek.length; i++) {
        const dayDate = new Date(nextMonday);
        dayDate.setDate(nextMonday.getDate() + i);
        days.value.push({ name: daysOfWeek[i], date: formatDate(dayDate) });
      }
    };

    // Function to format date in a readable format
    const formatDate = (date) => {
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    };

    // Calculate the days when the component is mounted
    calculateDays();

    return {
      userEmail,
      selectedItems,
      selectedDay,
      selectedVideo,
      days,
      showItems,
      loadVideo,
    };
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
  content: '';
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
