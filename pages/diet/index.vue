<template>
  <div class="container">
    <!-- Meal list on the left side -->
    <div class="meal-list-section">
      <ul class="meal-list">
        <!-- Loop through the list of meals -->
        <li
          v-for="(meal, index) in meals"
          :key="index"
          @click="selectMeal(meal)"
          :class="{ selected: selectedMeal === meal.name }"
        >
          <span class="meal-text">{{ meal.name }}</span>
        </li>
      </ul>
    </div>

    <!-- Image and description display in the middle -->
    <div class="image-display-section">
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
import { ref } from 'vue';

export default {
  setup() {
    // Define the list of meals and their corresponding image URLs and descriptions
    const meals = ref([
      { name: 'Breakfast', image: '/diet/1.jpg', description: 'A healthy start to the day.' },
      { name: 'After Snack', image: '/diet/After snack.jpg', description: 'A light snack to keep you going.' },
      { name: 'Lunch', image: '/diet/2.jpg', description: 'A balanced midday meal.' },
      { name: 'Mid Snack', image: '/diet/Mid morning snack.png', description: 'An energy boost in the afternoon.' },
      { name: 'Dinner', image: '/diet/dinner.jpeg', description: 'A satisfying and nutritious dinner.' },
      { name: 'Evening Snack', image: '/diet/', description: 'A small snack to end the day.' }
    ]);

    // State for the selected meal, image, and description
    const selectedMeal = ref('');
    const selectedImage = ref('');
    const selectedDescription = ref('');

    // Function to handle meal selection
    const selectMeal = (meal) => {
      selectedMeal.value = meal.name;
      selectedImage.value = meal.image;
      selectedDescription.value = meal.description;
    };

    return {
      meals,
      selectedMeal,
      selectedImage,
      selectedDescription,
      selectMeal,
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
