<template>
  <div class="center-container no-margin">
    <div class="container-d no-margin">
      <div class="section day-list-section no-margin">
        <div class="cof no-margin">
          <span>Workout Plan</span>
        </div>

        <div class="section-content no-margin">
          <ul class="day-list no-margin">
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
            <ul class="items-list no-margin">
              <li v-for="(item, index) in selectedItems" :key="index" @click="loadVideo(item)" class="item-option">
                <span class="item-text">{{ item }}</span>
              </li>
              <li class="rest-day" v-if="selectedItems.length === 0">
                <img src="../../assets/images/zzzz.png" alt="">
              </li>
            </ul>
          </div>
        </transition-group>
      </div>

      <transition name="fade" mode="out-in">
        <div class="section video-section no-margin" v-if="selectedVideo || selectedExerciseTitle">
          <div class="section-content no-margin">
            <h3 class="exercise-title">{{ selectedExerciseTitle }}</h3>
            <video v-if="selectedVideo" controls loop :src="selectedVideo" class="video-player no-margin">
              Your browser does not support the video tag.
            </video>
            <button class="back-button" @click="closeVideo">Back</button>
          </div>
        </div>
      </transition>

      <div class="section gym-details-section no-margin">
        <div class="section-content no-margin">
          <h2>Workout Details</h2>
          <p v-if="selectedExerciseDescription">{{ selectedExerciseDescription }}</p>

          <div class="recommendations no-margin">
            <h3>Recommendations:</h3>
            <ul class="no-margin">
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
  <br>
</template>

<script>
import { ref, onMounted } from 'vue';
import { projectFirestore } from '@/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { videosMap } from './video'; 

export default {
  middleware: 'auth',
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
        selectedItems.value = ['Bench Press','Dumbbell press', 'Cable Crossover','Landmine Press'];
      } else if (day === 'Tuesday') { 
        selectedItems.value = ['Lat Pulldowns','Dumbell Single','Pull ups', 'Pulls', ];
      } else if (day === 'Friday') { 
        selectedItems.value = ['Squat','Deadlift','Front squat', 'Goblet', 'Lunge'];
      } else if (day === 'Thursday') { 
        selectedItems.value = ['Cable pull','Front raise','Face Pull', 'High Pull', 'Raise'];
      } else {
        selectedItems.value = [];
      }
    };

    const program2 = (day) => {
      if (day === 'Monday') { 
        selectedItems.value = ['Upper Chest', 'Dumbell flye','Lying triceps','Triceps','Cardio','Cardio-t'];
      } else if (day === 'Tuesday') { 
        selectedItems.value = ['Lying Lateral','Trap Raise','Dips','Bar triceps','Cardio legs','Cardio ex'];
      } else if (day === 'Wednesday') { 
        selectedItems.value = [];
      } else if (day === 'Thursday') { 
        selectedItems.value = ['Seated Dumbbell Clean', 'Raise', 'High Pull', 'Cable pull'];
      } else if (day === 'Friday') { 
        selectedItems.value = ['Walking Lunge', 'Sumo squat','Split squats','Deficit Reverse Lunge'];
      } else {
        selectedItems.value = [];
      }
    };

    const program3 = (day) => {
      if (day === 'Monday') { 
        selectedItems.value = ['Bench Press', 'Dumbell flye','Lying triceps','Triceps','Cardio','Cardio 2'];
      } else if (day === 'Tuesday') {
        selectedItems.value = ['Lying Lateral','Trap Raise','Dips','Bar Triceps','Cardio legs','Cardio ex'];
      } else if (day === 'Wednesday') { 
        selectedItems.value = [];
      } else if (day === 'Friday') { 
        selectedItems.value = ['Seated Dumbbell Clean', 'Raise', 'High Pull', 'Cable pull'];
      } else if (day === 'Sunday') { 
        selectedItems.value = ['Walking Lunge', 'Sumo squat','Split squats','Deficit Reverse Lunge'];
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

<style>
.center-container {
  display: flex;
  border-radius: 14px;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.container-d {
  display: flex;
    width: 155vh;
    max-width: 100%;
    align-items: stretch;
    height: 75vh;
    border-radius: 12px;
    background: linear-gradient(286deg, #0000009c -36.4%, #2ecc71 131.27%), radial-gradient(562.84% 91.43% at 104.01% 112.43%, rgb(255 255 255) 0%, rgba(0, 0, 0, 0.00) 100%);
    box-shadow: 0 20px 50px rgba(233, 228, 228, 0.1);
    overflow: hidden;
    border: 1px solid #00000045;
    padding: 10px;
    margin: 90px 0px;

}

.section {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
  justify-content: center;
}

.section-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-left: 1px solid #fafafa;
}

.wrap-f {
  display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    width: 50vh;
    border-left: 1px solid #fafafa;
    gap: 66px;
}



.cof {
  display: flex;
  justify-content: center;
  align-items: center;
}

.cof > span {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
}

.day-list,
.items-list {
  height: 100%;
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 15px;
    justify-content: center;
}

.day-list li,
.items-list li {
  display: flex;
  height: min-content;
  cursor: pointer;
  border-radius: 5px;
  align-items: center;
  padding: 15px;
  text-align: center;
  border: 1px solid #fafafafa;
}
.rest-day{
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
  border: none !important;
  cursor: none;
  background: none;
  
}
.rest-day:hover{
  background: none;
}
.rest-day > img {
  width: 380px;
    height: 380px;
}
.day-list li:hover,
.items-list >.item-option:hover,
.day-list li.selected,
.items-list li.selected {
  background-color: #2ecc71;
  color: white;
  opacity: 0.9;
}

.day-list li:not(:last-child),
.items-list li:not(:last-child) {
  border: 1px solid #fafafafa;
}

.day-text,
.item-text {
  font-weight: 500;
  font-size: 16px;
  color: #ffffff;
}

.item-option {
  width: calc(50% - 10px); 
  margin: 5px;
  box-sizing: border-box;
}

.items-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    flex-direction: row;
}

/* Exercise Title Styles */
.exercise-title {
  font-size: 22px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20px;
  text-align: center;
  letter-spacing: 1px;
  line-height: 1.5;
  text-transform: capitalize;
}

.gym-details-section {
  background-color: #f9f9f9;
  padding: 20px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 40vh;
}

.gym-details-section h2 {
  margin-bottom: 10px;
  color: #222;
  font-weight: bold;
  font-size: 22px;
  text-transform: capitalize;
  letter-spacing: 0.5px;
}

.gym-details-section p {
  color: #555;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 10px;
}

.flex-col {
  flex-direction: column;
  gap: 40px;
}

.chooseoptions {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
}

.video-section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.video-player {
  display: flex;
  max-width: 60%;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  align-items: center;
  justify-content: center;
}

.back-button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.back-button:hover {
  background-color: #27ae60;
}

.recommendations {
  margin-top: 20px;
}

.recommendations h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

.recommendations ul {
  list-style-type: disc;
  padding-left: 20px;
}

.recommendations ul li {
  font-size: 14px;
  line-height: 1.6;
  color: #555;
}

.recommendations ul li:first-child {
  margin-top: 5px;
}

recommedations ul li:last-child {
  margin-bottom: 0;
}

.fade-enter-active, .fade-leave-active {
}
.fade-enter, .fade-leave-to  {
  opacity: 0;
}

</style>
