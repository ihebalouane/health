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
        <!-- Image container -->
        <div class="image-container">
          <img
            v-if="selectedImage"
            :src="selectedImage"
            alt="Selected Meal"
            class="meal-image"
            @click="openModal"
          />
        </div>
      </div>

      <!-- Modal overlay -->
      <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h3>Description</h3>
          <p>{{ selectedDescription }}</p>

          <h3>Advice</h3>
          <p>{{ advice }}</p>

          <button @click="closeModal">Close</button>
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
        {
          name: 'Breakfast',
          Bulk: {
            image: '/diet/bulk/1.jpg',
            description: 'A hearty start to the day.',
          },
          Cut: {
            image: '/diet/cut/1.jpg',
            description: 'A light and healthy breakfast.',
          },
        },
        {
          name: 'After Snack',
          Bulk: {
            image: '/diet/bulk/After snack.jpg',
            description: 'A substantial snack to keep you powered.',
          },
        },
        {
          name: 'Lunch',
          Bulk: {
            image: '/diet/bulk/2.jpg',
            description: 'A large, energy-packed midday meal.',
          },
          Cut: {
            image: '/diet/cut/2.jpg',
            description: 'A balanced, calorie-controlled lunch.',
          },
        },
        {
          name: 'Mid Snack',
          Bulk: {
            image: '/diet/bulk/Mid snack.png',
            description: 'A nutritious snack to sustain your energy.',
          },
        },
        {
          name: 'Dinner',
          Bulk: {
            image: '/diet/bulk/dinner.jpeg',
            description: 'A robust and hearty dinner to end your day.',
          },
          Cut: {
            image: '/diet/cut/3.jpeg',
            description: 'A light dinner to support your fitness goals.',
          },
        },
        {
          name: 'Evening Snack',
          Bulk: {
            image: '/diet/bulk/Evening snack.jpg',
            description: 'A final snack to top off your daily caloric intake.',
          },
        },
      ]);
  
      const selectedMeal = ref('');
      const selectedImage = ref('');
      const selectedDescription = ref('');
      const showData = ref(false);
      const programType = ref('');
      const deficiencies = ref([]);
      const advice = ref('');
      const isModalOpen = ref(false);
  
      // Advice recommendations based on deficiencies
      const deficiencyAdvice = {
        iron: 'Increase intake of iron-rich foods such as red meat, leafy greens, and legumes.',
        vitaminA: 'Consider consuming more foods like sweet potatoes, carrots, and spinach for vitamin A.',
        vitaminB: 'Include sources of B vitamins like whole grains, meat, and eggs in your diet.',
        vitaminD: 'Get more sunlight and consume foods rich in vitamin D, such as fish and fortified dairy.',
        calcium: 'Consume more dairy products, leafy greens, and fortified foods for calcium.',
        magnesium: 'Eat more nuts, seeds, and whole grains to increase magnesium intake.',
        zinc: 'Include more zinc-rich foods like shellfish, meat, and legumes in your diet.',
      };
  
      // Filter meals based on the availability of "Cut" data
      const filteredMeals = computed(() => {
        if (programType.value === 'Cut') {
          return meals.value.filter((meal) => meal.Cut);
        }
        return meals.value;
      });
  
      const selectMeal = (meal) => {
        selectedMeal.value = meal.name;
        if (meal[programType.value]) {
          selectedImage.value = meal[programType.value].image;
          selectedDescription.value = meal[programType.value].description;
        }
      };
  
      // Open the modal
      const openModal = () => {
        isModalOpen.value = true;
      };
  
      // Close the modal
      const closeModal = () => {
        isModalOpen.value = false;
      };
  
      // Fetch user data and set deficiencies and advice
      const fetchUserData = async () => {
        try {
          const userEmail = localStorage.getItem('email');
          const q = query(collection(projectFirestore, 'userResponses'), where('userEmail', '==', userEmail));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            const data = doc.data();
  
            // Store the program type
            programType.value = data.programType;
  
            // Show data if program type is either "Bulk" or "Cut"
            showData.value = ['Bulk', 'Cut'].includes(programType.value);
  
            // Retrieve deficiencies and set advice accordingly
            if (data.deficiencies) {
              deficiencies.value = data.deficiencies;
              setAdviceBasedOnDeficiencies();
            }
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      // Set advice based on the user's deficiencies
      const setAdviceBasedOnDeficiencies = () => {
        const userDeficiencies = deficiencies.value;
        let adviceArray = [];
        
        userDeficiencies.forEach((deficiency) => {
          if (deficiencyAdvice[deficiency]) {
            adviceArray.push(deficiencyAdvice[deficiency]);
          }
        });
        
        advice.value = adviceArray.join('. ');
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
        programType,
        deficiencies,
        advice,
        isModalOpen,
        openModal,
        closeModal,
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
    transition: filter 0.3s;
  }
  
  .container.blurred {
    filter: blur(5px);
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
    display: flex;
    justify-content: center;
    flex-direction: column;
    border: 2px solid #00796b;
    border-radius: 10px;
    background-color: #e0f7fa;
    padding: 20px;
  }
  
  .image-container {
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
  }
  
  .meal-image {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
    border-radius: 10px;
    cursor: pointer;
  }
  
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
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    max-width: 600px;
    width: 90%;
  }
  
  .modal-content h3 {
    color: #00796b;
    margin-bottom: 10px;
  }
  
  .modal-content p {
    color: #333;
    margin-bottom: 20px;
  }
  
  .modal-content button {
    padding: 8px 16px;
    background-color: #00796b;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>