<template>
  <div class="center-container">
    <div class="container-d">
      <div class="section day-list-section">
        <div class="cof">
          <span>Workout Plan</span>
        </div>
        <div class="section-content">
          <ul class="day-list">
            <li v-for="(day, index) in days" :key="index"
                :class="{ 'selected': selectedDay === day.name }"
                @click="toggleDay(day.name)">
              <span class="day-text">{{ day.name }} - {{ day.date }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="wrap-f" v-show="!selectedVideo && !selectedExerciseTitle">
        <transition-group name="fade" tag="div" class="items-list-section">
          <div v-for="(day, index) in days" :key="index" class="section-content" v-show="selectedDay === day.name">
            <ul class="items-list">
              <li v-for="(item, index) in selectedItems" :key="index" @click="loadVideo(item)" class="item-option">
                <span class="item-text">{{ item }}</span>
              </li>
              <li class="rest-day" v-if="selectedItems.length === 0">
                <img src="../../assets/images/zzzz.png" alt="Rest Day">
              </li>
            </ul>
          </div>
        </transition-group>
      </div>

      <transition name="fade" mode="out-in">
        <div class="section video-section" v-if="selectedVideo || selectedExerciseTitle">
          <div class="section-content">
            <h3 class="exercise-title">{{ selectedExerciseTitle }}</h3>
            <video v-if="selectedVideo" controls loop :src="selectedVideo" class="video-player">
              Your browser does not support the video tag.
            </video>
            <button class="back-button" @click="closeVideo">Back</button>
          </div>
        </div>
      </transition>

      <div class="section gym-details-section">
        <div class="section-content">
          <h2>Workout Details</h2>
          <p v-if="selectedExerciseDescription">{{ selectedExerciseDescription }}</p>
          <div class="recommendations">
            <h3>Recommendations:</h3>
            <ul>
              <li>Sleep 7-9 hours every night for proper recovery and muscle growth.</li>
              <li>Avoid alcohol consumption as it can hinder muscle recovery and performance.</li>
              <li>Avoid tobacco use to maintain optimal lung function and overall health.</li>
              <li>Manage stress through relaxation techniques like meditation or yoga.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { projectFirestore } from '@/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { videosMap } from './video';

export default {
  setup() {
    const userEmail = ref('');
    const selectedItems = ref([]);
    const selectedDay = ref(null);
    const selectedVideo = ref(null);
    const selectedExerciseTitle = ref('');
    const selectedExerciseDescription = ref('');
    const days = ref([]);
    const expandedDay = ref(null);

    const exerciseDescriptions = {
      'Bench Press': 'A strength training exercise that works your chest muscles. Performed lying flat on a bench.',
      'Lat Pulldowns': 'A back exercise focusing on the latissimus dorsi muscles. Done using a lat pulldown machine.',
      'Squat': 'A lower body exercise that targets the quads, glutes, and hamstrings. Performed standing and bending at the knees.',
    };

    onMounted(() => {
      userEmail.value = localStorage.getItem('email') || '';
    });

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

          const days = ['1', '2'];
          const relevantAgeRanges = ['under 20s', '20s', '30s'];
          const risk1 = ['bloodPressure', 'heartDisease'];

          if (ageRange === '60s' || days.includes(daysE)) {
            program6(selectedDay.value);
            console.log('program 6')
          } else if (programType === 'Bulk') {
            if ((exp === 'beginner') && (goal > weight) && (relevantAgeRanges.includes(ageRange))) {
              program1(selectedDay.value);
              console.log('program 1')
            } else if (risk.includes('depressionAnxiety')) {
              program5(selectedDay.value);
              console.log('program 5')
            } else {
              program3(selectedDay.value);
              console.log('program 3')
            }
          } else if (programType === 'Cut') {
            if (risk.includes('none') && goal < weight) {
              program2(selectedDay.value);
              console.log('program 2')
            } else if (risk.includes('depressionAnxiety')) {
              program5(selectedDay.value);
              console.log('program 5')
            } else if (risk1.includes(risk)) {
              program4(selectedDay.value);
              console.log('program 4')
            } else {
              program3(selectedDay.value);
              console.log('program 3')
            }
          }
        });
      } catch (error) {
        console.error(error.message);
      }
    };

    const program1 = (day) => {
      if (day === 'Monday') {
        selectedItems.value = ['Bench Press', 'Dumbbell press', 'Cable Crossover', 'Landmine Press'];
      } else if (day === 'Tuesday') {
        selectedItems.value = ['Lat Pulldowns', 'Dumbell Single', 'Pull ups', 'Pulls'];
      } else if (day === 'Friday') {
        selectedItems.value = ['Squat', 'Deadlift', 'Front squat', 'Goblet', 'Lunge'];
      } else if (day === 'Thursday') {
        selectedItems.value = ['Cable pull', 'Front raise', 'Face Pull', 'High Pull', 'Raise'];
      } else {
        selectedItems.value = [];
      }
    };

    const program2 = (day) => {
      if (day === 'Monday') {
        selectedItems.value = ['Upper Chest', 'Dumbell flye', 'Lying triceps', 'Triceps', 'Cardio', 'Cardio-t'];
      } else if (day === 'Tuesday') {
        selectedItems.value = ['Lying Lateral', 'Trap Raise', 'Dips', 'Bar triceps', 'Cardio legs', 'Cardio ex'];
      } else if (day === 'Wednesday') {
        selectedItems.value = [];
      } else if (day === 'Thursday') {
        selectedItems.value = ['Seated Dumbbell Clean', 'Raise', 'High Pull', 'Cable pull'];
      } else if (day === 'Friday') {
        selectedItems.value = ['Walking Lunge', 'Sumo squat', 'Split squats', 'Deficit Reverse Lunge'];
      } else {
        selectedItems.value = [];
      }
    };

    const program3 = (day) => {
      if (day === 'Monday') {
        selectedItems.value = ['Bench Press', 'Dumbell flye', 'Lying triceps', 'Triceps', 'Cardio', 'Cardio 2'];
      } else if (day === 'Tuesday') {
        selectedItems.value = ['Lying Lateral', 'Trap Raise', 'Dips', 'Bar Triceps', 'Cardio legs', 'Cardio ex'];
      } else if (day === 'Wednesday') {
        selectedItems.value = [];
      } else if (day === 'Friday') {
        selectedItems.value = ['Seated Dumbbell Clean', 'Raise', 'High Pull', 'Cable pull'];
      } else if (day === 'Sunday') {
        selectedItems.value = ['Walking Lunge', 'Sumo squat', 'Split squats', 'Deficit Reverse Lunge'];
      } else {
        selectedItems.value = [];
      }
    };

    const program4 = (day) => {
      if (day === 'Monday') {
        selectedItems.value = ['Cardio', 'Cardio Legs', 'Cardio Breath'];
      } else if (day === 'Tuesday') {
        selectedItems.value = [];
      } else if (day === 'Wednesday') {
        selectedItems.value = ['Cardio-t', 'Cardio Breath', 'Cardio Legs'];
      } else if (day === 'Friday') {
        selectedItems.value = ['Cardio Breath', 'Cardio Legs', 'Cardio-t'];
      } else if (day === 'Sunday') {
        selectedItems.value = [];
      }
    };

    const program5 = (day) => {
      if (day === 'Monday') {
        selectedItems.value = ['Squat', 'Deadlift', 'Front squat', 'Lunge', 'Sumo squat'];
      } else if (day === 'Tuesday') {
        selectedItems.value = ['Dumbbell press', 'Dumbell flye', 'Cable pull', 'Triceps'];
      } else if (day === 'Wednesday') {
        selectedItems.value = ['Hold up', 'Lying Lateral', 'Barbell Bent-Over', 'Trap Raise'];
      } else if (day === 'Friday') {
        selectedItems.value = ['Squat', 'Deadlift', 'Front squat', 'Lunge', 'Sumo squat'];
      } else if (day === 'Sunday') {
        selectedItems.value = [];
      }
    };

    const program6 = (day) => {
      if (day === 'Monday') {
        selectedItems.value = [];
      } else if (day === 'Tuesday') {
        selectedItems.value = ['Bench Press', 'Pull ups', 'Cable pull', 'Bicep curl', 'Triceps'];
      } else if (day === 'Wednesday') {
        selectedItems.value = [];
      } else if (day === 'Saturday') {
        selectedItems.value = ['Squat', 'Front squat', 'Goblet', 'Deficit Reverse Lunge'];
      } else {
        selectedItems.value = [];
      }
    };

    const toggleDay = (day) => {
      selectedDay.value = day === expandedDay.value ? null : day;
      expandedDay.value = day === expandedDay.value ? null : day;
      getUserResponses();
    };

    const loadVideo = (item) => {
      if (videosMap.hasOwnProperty(item)) {
        selectedVideo.value = videosMap[item];
        selectedExerciseTitle.value = item;
        selectedExerciseDescription.value = exerciseDescriptions[item] || 'Description not available.';
      } else {
        console.error(`Video URL not found for item: ${item}`);
      }
    };

    const closeVideo = () => {
      selectedVideo.value = null;
      selectedExerciseTitle.value = '';
      selectedExerciseDescription.value = '';
    };

    const calculateDays = () => {
      const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const currentDate = new Date();
      const currentDayIndex = currentDate.getDay();
      const nextDayDate = new Date(currentDate);
      nextDayDate.setDate(currentDate.getDate() + 1);

      for (let i = 0; i < daysOfWeek.length; i++) {
        const dayDate = new Date(nextDayDate);
        dayDate.setDate(nextDayDate.getDate() + i);
        days.value.push({ name: daysOfWeek[(currentDayIndex + i) % 7], date: formatDate(dayDate) });
      }
    };

    const formatDate = (date) => {
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    };

    calculateDays();

    return {
      userEmail,
      selectedItems,
      selectedDay,
      selectedVideo,
      selectedExerciseTitle,
      selectedExerciseDescription,
      days,
      toggleDay,
      loadVideo,
      closeVideo,
    };
  },
};
</script>

<style scoped>
/* General Styles */
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  background-color: #f4f4f4;
}
.item-option{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

}
.wrap-f{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 40vh;
}
.container-d {
display: flex;
    width: 100%;
    max-width: 1200px;
    height: 85vh;
    border-radius: 12px;
    background: linear-gradient(145deg, #81f390, #ffffff);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    padding: 20px;
}

.section {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  margin-right: 20px;
}

.section:last-child {
  margin-right: 0;
}

.section-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
      gap: 12px;
}

.cof {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.cof > span {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.day-list,
.items-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.day-list li,
.items-list li {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.day-list li:hover,
.items-list li:hover {
  background-color: #2ecc71;
  color: white;
  transform: translateY(-3px);
}

.day-list li.selected {
  background-color: #2ecc71;
  color: white;
}

.day-text,
.item-text {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.rest-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.rest-day img {
  width: 200px;
  height: auto;
}

.video-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-player {
  width: 100%;
  max-width: 30vh;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.back-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #27ae60;
}

.gym-details-section {
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.gym-details-section h2 {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.gym-details-section p {
  font-size: 16px;
  color: #555;
  margin-bottom: 20px;
}

.recommendations {
  margin-top: 20px;
}

.recommendations h3 {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.recommendations ul {
  list-style-type: disc;
  padding-left: 20px;
}

.recommendations ul li {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
