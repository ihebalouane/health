<template>
  <div class="center-container">
    <div class="container">
      <div class="section day-list-section">
        <div class="section-content">
          <ul class="day-list">
            <li v-for="(day, index) in days" :key="index"
                :class="{ 'selected': selectedDay === day.name }"
                @click="showItems(day.name)">
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
          <h3 class="exercise-title">{{ selectedExerciseTitle }}</h3> <!-- Display the exercise title -->
          <video v-if="selectedVideo" controls loop :src="selectedVideo" class="video-player">
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <div class="section gym-details-section">
        <div class="section gym-details-section">
  <div class="section-content">
    <h2>Workout Details</h2>
    <p>{{ userEmail }}</p>
    <p v-if="selectedExerciseDescription">{{ selectedExerciseDescription }}</p> <!-- Display the exercise description -->

    <!-- Recommendations for Clients -->
    <div class="recommendations">
      <h3>Recommendations:</h3>
      <ul>
        <li>Sleep 7-9 hours every night for proper recovery and muscle growth.</li>
        <li>Avoid alcohol consumption as it can hinder muscle recovery and performance.</li>
        <li>Avoid tobacco use to maintain optimal lung function and overall health.</li>
        <li>Manage stress through relaxation techniques like meditation or yoga.</li>
        <!-- Add more recommendations as needed -->
      </ul>
    </div>
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
import { videosMap } from './video'; // Importing the videos map

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

    // Map of exercises to their descriptions
    const exerciseDescriptions = {
      'Bench Press': 'A strength training exercise that works your chest muscles. Performed lying flat on a bench.',
      'Lat Pulldowns': 'A back exercise focusing on the latissimus dorsi muscles. Done using a lat pulldown machine.',
      'Squat': 'A lower body exercise that targets the quads, glutes, and hamstrings. Performed standing and bending at the knees.',
      // Add more exercises and their descriptions as needed
    };

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

    // Function for the specific program 1: Beginner's muscle building
    const program1 = (day) => {
      if (day === 'Monday') { //Chest day + Triceps
        selectedItems.value = ['Bench Press','Dumbbell press', 'Cable Crossover','Landmine Press'];
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
        selectedItems.value = ['Squat', 'Front squat', 'Goblet', 'Deficit Reverse Lunge'];
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

    // Function to load video and description based on the selected item
    const loadVideo = (item) => {
      if (videosMap.hasOwnProperty(item)) {
        selectedVideo.value = videosMap[item];
        selectedExerciseTitle.value = item;
        selectedExerciseDescription.value = exerciseDescriptions[item] || 'Description not available.';
      } else {
        console.error(`Video URL not found for item: ${item}`);
      }
    };

    // Function to calculate and set the days of the week starting from the next Monday
    const calculateDays = () => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const currentDate = new Date();
  
  // Calculate the starting day index as the day after the current day
  const currentDayIndex = currentDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  const nextDayDate = new Date(currentDate);
  nextDayDate.setDate(currentDate.getDate() + 1); // Calculate the date for the next day

  for (let i = 0; i < daysOfWeek.length; i++) {
    const dayDate = new Date(nextDayDate);
    dayDate.setDate(nextDayDate.getDate() + i);
    days.value.push({ name: daysOfWeek[(currentDayIndex + i) % 7], date: formatDate(dayDate) });
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
      selectedExerciseTitle,
      selectedExerciseDescription,
      days,
      showItems,
      loadVideo,
    };
  },
};
</script>

<style>
/* General Styles */
.center-container {
  display: flex;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom left, #2ecc71, #ffffff); /* Background gradient */
}

.container {
  display: flex;
  width: 95%;
  max-width: 1500px;
  align-items: stretch;
  height: 600px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 20px 50px rgba(233, 228, 228, 0.1);
  overflow: hidden;
}

/* Section Styles */
.section {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.section-content {
  height: 100%;
}

.day-list,
.items-list {
  padding: 0;
  margin: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.day-list li,
.items-list li {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.day-list li:hover,
.items-list li:hover,
.day-list li.selected,
.items-list li.selected {
  background-color: #2ecc71;
  color: white;
  opacity: 0.9;
  transform: translateY(-5px);
}

.day-list li:not(:last-child),
.items-list li:not(:last-child) {
  margin-bottom: 10px;
}

.day-text,
.item-text {
  font-weight: 500;
  font-size: 16px;
  color: #424242;
}

/* Exercise Title Styles */
.exercise-title {
  font-size: 20px; /* Increase the font size for better visibility */
  font-weight: bold; /* Make the title bold */
  color: #333333; /* Dark gray color for modern look */
  margin-bottom: 20px; /* Add space below the title */
  text-align: center; /* Center-align the title */
  letter-spacing: 1px; /* Add slight spacing between letters for a cleaner look */
  line-height: 1.5; /* Add a comfortable line height */
  text-transform: capitalize; /* Capitalize each word for a neat appearance */
}


/* Gym Details Section Styles */
/* Gym Details Section Styles */
.gym-details-section {
  background-color: #f9f9f9; /* Light background color */
  padding: 20px; /* Padding around the content */
  border-bottom-left-radius: 15px; /* Rounded corners */
  border-bottom-right-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Slight shadow */
}

.gym-details-section h2 {
  margin-bottom: 10px; /* Reduced margin for a compact look */
  color: #222; /* Darker text color */
  font-weight: bold; /* Maintain bold weight */
  font-size: 22px; /* Slightly smaller font size */
  text-transform: capitalize; /* Capitalize each word */
  letter-spacing: 0.5px; /* Slight letter spacing */
}

.gym-details-section p {
  color: #555; /* Medium gray text color for a modern look */
  font-size: 14px; /* Standard font size */
  line-height: 1.4; /* Slightly reduced line height */
  margin-bottom: 10px; /* Add margin below paragraphs for spacing */
}


/* Video Player Styles */
.video-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 80px;
  height: 100%; /* Make the height of the video section match the entire container height */
}

.video-player {
  max-width: 100%;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Recommendations Section Styles */
.recommendations {
  margin-top: 20px; /* Add space above recommendations */
}

.recommendations h3 {
  font-size: 18px; /* Increase font size for recommendation title */
  margin-bottom: 10px; /* Add space below title */
  color: #333; /* Dark gray text color */
}

.recommendations ul {
  list-style-type: disc; /* Use bullet points for recommendations */
  padding-left: 20px; /* Indent the bullet points */
}

.recommendations ul li {
  font-size: 14px; /* Set font size for recommendations */
  line-height: 1.6; /* Increase line height for better readability */
  color: #555; /* Medium gray text color */
}

.recommendations ul li:first-child {
  margin-top: 5px; /* Add a small margin at the top of the list */
}

.recommendations ul li:last-child {
  margin-bottom: 0; /* Remove margin at the bottom of the list */
}

</style>