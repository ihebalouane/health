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

    // Fetch user's email when the component is mounted
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
          const goal = data.goalWeight;
          const programType = data.programType;
          const exp = data.experienceLevel;
          const daysE = data.exerciseFrequency;
          const risk = data.selectedRiskFactors;

          // Program conditions
          const days = ['1', '2'];
          const relevantAgeRanges = ['under 20s', '20s', '30s'];
          const risk1 = ['bloodPressure', 'heartDisease'];
          console.log (typeof(programText))

          if (ageRange === '60s' || days.includes(daysE)) {
            program6(selectedDay.value);
          } else if (programType === 'Bulk') {
            if ((exp === 'beginner') && (goal > weight) && (relevantAgeRanges.includes(ageRange))) {
              program1(selectedDay.value);
            } else if (risk.includes('depressionAnxiety')) {
              program5(selectedDay.value);
            } else {
              program3(selectedDay.value);
            }
          } else if (programType === 'Cut') {
            if (risk.includes('none') && goal < weight) {
              program2(selectedDay.value);
            } else if (risk.includes('depressionAnxiety')) {
              program5(selectedDay.value);
            } else if (risk1.includes(risk)) {
              program4(selectedDay.value);
            } else {
              program3(selectedDay.value);
            }
          }
        });
      } catch (error) {
        console.error(error.message);
      }
    };

    // Function for the specific program 1: Beginner' muscle building
    const program1 = (day) => {
      if (day === 'Monday') { //Chest day + Triceps
        selectedItems.value = ['Bench Press','Bench press', 'Cable Crossover','Landmine Press'];
      } else if (day === 'Tuesday') { //Back day + Biceps
        selectedItems.value = ['Lat Pulldowns','Dumbell Single','Pull ups', 'Pulls', ];
      } else if (day === 'Friday') { //Legs day
        selectedItems.value = ['Squat','Deadlift','Front squat', 'Goblet', 'Lunge'];
      } else if (day === 'Thursday') { //Shoulders day
        selectedItems.value = ['Cable pull','Front raise','Face Pull', 'High Pull', 'Raise'];
      }
    };

    // Function for the specific program2: Fat loss program
    const program2 = (day) => {
      if (day === 'Monday') { //Chest day + triceps + Cardio
        selectedItems.value = ['Upper Chest', 'Dumbell flye','Lying triceps','Triceps','Cardio','Cardio-t'];
      } else if (day === 'Tuesday') { //Back day + Biceps
        selectedItems.value = ['Lying Lateral','Trap Raise','Dips','Bar triceps','Cardio legs','Cardio ex'];
      } else if (day === 'Wednesday') { //Cardio
        selectedItems.value = [];
      } else if (day === 'Thursday') { //Shoulders + Cardio
        selectedItems.value = ['Seated Dumbbell Clean', 'Raise', 'High Pull', 'Cable pull'];
    }   else if (day === 'Friday') { //Back day + Biceps
        selectedItems.value = ['Walking Lunge', 'Sumo squat','Split squats','Deficit Reverse Lunge'];
    }   
  }

  const program3 = (day) => {
      if (day === 'Monday') { //Chest day
        selectedItems.value = ['Bench Press', 'Dumbell flye','Lying triceps','Triceps','Cardio','Cardio 2'];
      } else if (day === 'Tuesday') { //Back day
        selectedItems.value = ['Lying Lateral','Trap Raise','Dips','Bar Triceps','Cardio legs','Cardio ex'];
      } else if (day === 'Wednesday') { //Shoulders + Cardio
        selectedItems.value = [];
      } else if (day === 'Friday') { //Arms
        selectedItems.value = ['Seated Dumbbell Clean', 'Raise', 'High Pull', 'Cable pull'];
    }   else if (day === 'Sunday') { //Legs
        selectedItems.value = ['Walking Lunge', 'Sumo squat','Split squats','Deficit Reverse Lunge'];
    }   
  }

  const program4 = (day) => {
      if (day === 'Monday') { //Chest day
        selectedItems.value = ['Cardio', 'Cardio Legs', 'Cardio Breath'];
      } else if (day === 'Tuesday') { //Back day
        selectedItems.value = [];
      } else if (day === 'Wednesday') { //Shoulders + Cardio
        selectedItems.value =  ['Cardio-t', 'Cardio Breath', 'Cardio Legs'];
      } else if (day === 'Friday') { //Arms
        selectedItems.value = ['Cardio Breath', 'Cardio Legs', 'Cardio-t'];
    }   else if (day === 'Sunday') { //Legs
        selectedItems.value = [];
    }   
  }

  const program5 = (day) => {
      if (day === 'Monday') { //Chest day
        selectedItems.value = ['Squat', 'Deadlift', 'Front squat', 'Lunge', 'Sumo squat'];
      } else if (day === 'Tuesday') { //Back day
        selectedItems.value = ['Dumbbell Press', 'Dumbbell Flye', 'Cable Pull', 'Triceps'];
      } else if (day === 'Wednesday') { //Shoulders + Cardio
        selectedItems.value = ['Hold Up', 'Lying Lateral', 'Barbell Bent-Over', 'Trap Raise'];
      } else if (day === 'Friday') { //Arms
        selectedItems.value = ['Squat', 'Deadlift', 'Front Squat', 'Lunge', 'Sumo Squat'];
    }   else if (day === 'Sunday') { //Legs
        selectedItems.value = [];
    }   
  }

  const program6 = (day) => {
      if (day === 'Monday') { //Chest day
        selectedItems.value = [];
      } else if (day === 'Tuesday') { //Back day
        selectedItems.value = ['Bench Press', 'Pull ups', 'Cable pull', 'Bicep curl', 'Triceps'];
      } else if (day === 'Wednesday') { //Shoulders + Cardio
        selectedItems.value = [];
      } else if (day === 'Saturday') { //Arms
        selectedItems.value = ['Squat', 'Front Squat', 'Goblet Squat', 'Deficit Reverse Lunge'];
    }   else if (day === 'Sunday') { //Legs
        selectedItems.value = ['Walking Lunge', 'Sumo squat','Split squats','Deficit Reverse Lunge'];
    }   
  }

    

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