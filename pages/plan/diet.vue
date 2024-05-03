<template>
  <div class="container">
    <!-- Meal list on the left side -->
    <div class="meal-list-section">
      <ul class="meal-list">
        <!-- Loop through the filtered list of meals -->
        <li
          v-for="(meal, index) in filteredMeals"
          :key="index"
          @click="selectMeal(meal)"
          :class="{ selected: selectedMeal === meal.name }"
        >
          <span class="meal-text">{{ meal.name }}</span>
        </li>
      </ul>
    </div>

    <!-- Image and description display in the middle -->
    <div class="image-display-section" v-if="showData">
      <div class="image-container">
        <img
          v-if="selectedImage"
          :src="selectedImage"
          alt="Selected Meal"
          class="meal-image"
        />
      </div>

      <!-- Description box -->
      <div class="description-box" v-if="selectedDescription">
        <p>{{ selectedDescription }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { projectFirestore } from '@/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default {
  setup() {
    // Define the list of meals with images and descriptions for different program types
    const meals = ref([
      { name: 'Breakfast', 
        Bulk: { image: '/diet/bulk/1.jpg', description: 'A hearty start to the day.' },
        Cut: { image: '/diet/cut/1.jpg', description: 'A light and healthy breakfast.' }
      },
      { name: 'After Snack', 
        Bulk: { image: '/diet/bulk/After snack.jpg', description: 'A substantial snack to keep you powered.' }
      },
      { name: 'Lunch', 
        Bulk: { image: '/diet/bulk/2.jpg', description: 'A large, energy-packed midday meal.' },
        Cut: { image: '/diet/cut/2.jpg', description: 'A balanced, calorie-controlled lunch.' }
      },
      { name: 'Mid Snack', 
        Bulk: { image: '/diet/bulk/Mid snack.png', description: 'A nutritious snack to sustain your energy.' },
      },
      { name: 'Dinner', 
        Bulk: { image: '/diet/bulk/dinner.jpeg', description: 'A robust and hearty dinner to end your day.' },
        Cut: { image: '/diet/cut/3.jpeg', description: 'A light dinner to support your fitness goals.' }
      },
      { name: 'Evening Snack', 
        Bulk: { image: '/diet/bulk/Evening snack.jpg', description: 'A final snack to top off your daily caloric intake.' }
      }
    ]);

    const selectedMeal = ref('');
    const selectedImage = ref('');
    const selectedDescription = ref('');
    const showData = ref(false);
    const programType = ref('');

    // Computed property to filter meals based on the availability of "Cut" data
    const filteredMeals = computed(() => {
      if (programType.value === 'Cut') {
        // Return only meals that have "Cut" data
        return meals.value.filter((meal) => meal.Cut);
      }
      // Return all meals if programType is not "Cut"
      return meals.value;
    });

    const selectMeal = (meal) => {
      selectedMeal.value = meal.name;
      if (meal[programType.value]) { // Check if the meal has specific data for the program type
        selectedImage.value = meal[programType.value].image;
        selectedDescription.value = meal[programType.value].description;
      }
    };

    const fetchUserData = async () => {
      try {
        const userEmail = localStorage.getItem('email');
        const q = query(collection(projectFirestore, 'userResponses'), where('userEmail', '==', userEmail));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          programType.value = data.programType; // Store the program type
          showData.value = ['Bulk', 'Cut'].includes(programType.value); // Show data if program type is either
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    onMounted(() => {
      fetchUserData();
    });

    return {
      filteredMeals,
      selectedMeal,
      selectedImage,
      selectedDescription,
      selectMeal,
      showData,
      programType
    };
  },
};
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
}

.meal-list-section {
  flex: 1;
  margin-right: 20px;
}

.meal-list {
  list-style-type: none;
  padding: 0;
}

.meal-list li {
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.meal-list li.selected,
.meal-list li:hover {
  background-color: #e0f7fa;
}

.meal-text {
  font-size: 16px;
  color: #00796b;
}

.image-display-section {
  flex: 2;
}

.image-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #00796b;
  border-radius: 10px;
  background-color: #e0f7fa;
}

.meal-image {
  max-width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
  border-radius: 10px;
}

.description-box {
  padding: 10px;
  border-top: 2px solid #00796b;
  color: #00796b;
}
</style>
