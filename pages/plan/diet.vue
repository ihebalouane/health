<template>
  <title>Diet</title>
  <div class="page-container">
    <h1 class="page-title">Personalized Meal Plan</h1>
    <div class="green-box">
      <div class="container">
        <div class="meal-list-section">
          <ul class="meal-list">
            <li v-for="(meal, index) in filteredMeals" :key="index" @click="selectMeal(meal)" :class="{ selected: selectedMeal === meal }">
              <span class="meal-text">{{ meal }}</span>
            </li>
          </ul>
        </div>
        <div class="image-display-section" v-if="showData">
          <div class="image-container">
            <div class="meal-name" v-if="selectedMeal">{{ selectedMeal }}</div>
            <img v-if="selectedImage" :src="selectedImage" alt="Selected Meal" class="meal-image" @click="openModal" />
          </div>
        </div>
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
    </div>
  </div>
  <br>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { projectFirestore } from '@/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default {
  setup() {
    const mealImages = {
      'Grilled chicken': 'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%201%2FGrilled%20chicken%20breast.jpg?alt=media&token=f1dbb2cf-aa85-4acf-b38b-d35c42294633',
      'Greek yogurt':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%201%2FGreek%20yogurt%20with%20mixed%20berries%20and%20a%20handful%20of%20almonds.jpg?alt=media&token=139faab9-e710-4117-892c-d436b73377d8',
      'Whole wheat toast':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%201%2Fwhole%20wheat%20toast.png?alt=media&token=9c8664e5-e322-4541-8785-adc0520a4ff6',
      'Scrambled eggs':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%201%2FScrambled%20eggs.jpg?alt=media&token=f92e6dde-203a-4a1a-8c86-2593e0520aa6',
      'Baked salamon':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%201%2FBaked%20salamon.jpeg?alt=media&token=a37caee0-bef6-4fe4-a5de-da39cdaf8433',
      'Cereale': 'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%201%2FCereale.jpg?alt=media&token=b28572aa-5252-4b44-a831-5d27a4f3450e',
      'Edamame beans':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%202%20vegan%2FEdamame%20beans.jpg?alt=media&token=a6ac9bd0-1d3c-4255-b0bf-c9c1879c6e37',
      'Grilled tofu with stir-fried vegetables':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%202%20vegan%2FGrilled%20tofu%20with%20stir-fried%20vegetables.jpeg?alt=media&token=81997593-95c3-4a90-93fd-73295b65593a',
      'Hummus scaled':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%202%20vegan%2FHummus-scaled.jpg?alt=media&token=7cbf41fe-799e-48ba-8b7f-754c452653c8',
      'Lentil soup with whole grain bread and a side salad':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%202%20vegan%2FLentil%20soup%20with%20whole%20grain%20bread.jpg?alt=media&token=04657997-51b6-4f08-bb2a-a926c13f1ac4',
      'Protein oatmeal with sliced bananas':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%20high%20blood%2FProtein-Oatmeal-with-Bananas.jpg?alt=media&token=ad91df4d-057d-4d32-b9d5-80de3ce2c31e',
      'Cottage cheese with pineapple chunks':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%20high%20blood%2FPineapple%20and%20cottage%20cheese%20Bowl.jpg?alt=media&token=c10d93ec-9e4a-45ca-98a4-009953d79b87',
      'Turkey and avocado wrap':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%20high%20blood%2Fveggie-turkey-wrap.jpg?alt=media&token=d4cbf059-6424-4052-8cc1-9cad1fb12ae0',
      'Protein bar':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%20high%20blood%2Fcrunchy%20protein%20bars.jpg?alt=media&token=65121b97-c037-45a6-8639-ee1434fa2a3c',
      'Beef stir-fry with mixed':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%20high%20blood%2FBeef%20and%20Vegetable%20Stir.jpg?alt=media&token=5a297792-33b4-4eed-b85a-911bdac5f926',
      'A small apple with a tablespoon of almond butter':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%20diabetes%2FA%20small%20apple%20with%20a%20tablespoon%20of%20almond%20butter.jpg?alt=media&token=a510ad92-5857-4a10-8b56-433e07cf1a9e',
      'A side of quinoa or brown rice':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%20diabetes%2FA%20side%20of%20quinoa%20or%20brown%20rice.jpg?alt=media&token=a0d3e04a-92d3-4d8d-98cc-d683f9cf8d5b',
      'Carrot sticks with hummus':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%20diabetes%2FCarrot%20sticks%20with%20hummus.jpg?alt=media&token=d08e037b-a4b2-4915-a27c-1ed8788934ca',
      'Steamed broccoli or asparagus':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%20diabetes%2FSteamed%20broccoli%20or%20asparagus.jpg?alt=media&token=12b4db47-3adf-4507-90f4-3553132f8f01',
      'Steel cut oats':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%202%2FSteel-Cut-Oats-Recipe.jpg?alt=media&token=193da136-da23-49c1-881b-100df0136edc',
      'Salad chicken':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%202%2Fsalad%20chicken.jpg?alt=media&token=47c429fa-2305-4afb-bbc8-00bf5bb7a1cb',
      'Omelet made with egg':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%202%2Fbest-omelette-recipe-1.jpg?alt=media&token=7bc184bf-dfe7-433c-9993-ad651cbe7c4f',
      'Oatmeal made with rolled oats':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%20cholesterol%2FOatmeal%20made%20with%20rolled%20oats.jpg?alt=media&token=8af10cac-1c52-490f-8fcb-ce477c9c0293',
      'Walnuts or almonds':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%20cholesterol%2FWalnuts%20or%20almonds.jpg?alt=media&token=689d0c28-a112-4258-9cf5-3fa216791b85',
      'Quinoa or wild rice pilaf':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%20cholesterol%2FQuinoa%20or%20wild%20rice%20pilaf%20with%20diced%20vegetables.jpg?alt=media&token=1c2543c3-b3ee-4725-9ac6-1ca409199806',
      'Mixed salad':'https://firebasestorage.googleapis.com/v0/b/health-6b124.appspot.com/o/Diet%2FMeal%20cholesterol%2FMixed%20salad.jpg?alt=media&token=59016b90-c496-4df2-8f97-414afea12d2e',
    };

    const selectedMeal = ref('');
    const selectedImage = ref('');
    const selectedDescription = ref('');
    const showData = ref(false);
    const programType = ref('');
    const diet = ref('');
    const selectedRiskFactors = ref([]); 
    const deficiencies = ref([]);
    const advice = ref('');
    const isModalOpen = ref(false);

    const mealDescriptions = {
      'Grilled chicken': 'A lean source of protein, perfect for muscle building and recovery.',
      'Greek yogurt': 'Rich in protein and probiotics, great for digestive health and muscle repair.',
      'Whole wheat toast': 'A healthy source of complex carbohydrates, providing sustained energy.',
      'Scrambled eggs': 'Packed with protein and essential vitamins, ideal for a nutritious breakfast.',
      'Baked salamon': 'High in omega-3 fatty acids, excellent for heart health and inflammation reduction.',
      'Cereale': 'Whole grain cereal rich in fiber and essential nutrients, perfect for a nutritious start.',
      'Edamame beans': 'A great plant-based protein source, high in fiber and essential amino acids.',
      'Grilled tofu with stir-fried vegetables': 'A balanced vegan meal, rich in protein, vitamins, and minerals.',
      'Hummus scaled': 'Creamy and nutritious, made from chickpeas, high in fiber and plant-based protein.',
      'Lentil soup with whole grain bread and a side salad': 'Rich in protein, fiber, and essential nutrients, perfect for a hearty meal.',
      'Protein oatmeal with sliced bananas': 'A heart-healthy breakfast option rich in fiber and potassium.',
      'Cottage cheese with pineapple chunks': 'A high-protein, low-fat option with a touch of natural sweetness.',
      'Turkey and avocado wrap': 'A balanced meal with lean protein, healthy fats, and fiber.',
      'Protein bar': 'Convenient and nutritious, great for muscle repair and energy boost.',
      'Beef stir-fry with mixed': 'High in protein and packed with vitamins from fresh vegetables.',
      'A small apple with a tablespoon of almond butter': 'A balanced snack with fiber, healthy fats, and protein.',
      'A side of quinoa or brown rice': 'Complex carbohydrates providing sustained energy without spiking blood sugar.',
      'Carrot sticks with hummus': 'A healthy snack with fiber and plant-based protein.',
      'Steamed broccoli or asparagus': 'Low-calorie, nutrient-dense vegetables great for overall health.',
      'Steel cut oats': 'A nutritious breakfast option rich in fiber and slow-digesting carbohydrates.',
      'Salad chicken': 'A low-calorie, high-protein meal perfect for lean muscle maintenance.',
      'Omelet made with egg': 'Packed with protein and essential nutrients, ideal for muscle repair.',
      'Oatmeal made with rolled oats': 'Heart-healthy, rich in fiber and can help lower cholesterol levels.',
      'Walnuts or almonds': 'High in healthy fats and can improve heart health.',
      'Quinoa or wild rice pilaf': 'A nutritious side rich in fiber, protein, and essential nutrients.',
      'Mixed salad': 'A fresh and nutrient-dense option great for overall health.'
    };
    
    const deficiencyAdvice = {
      iron: 'Increase intake of iron-rich foods such as red meat, leafy greens, and legumes.',
      vitaminA: 'Consider consuming more foods like sweet potatoes, carrots, and spinach for vitamin A.',
      vitaminB: 'Include sources of B vitamins like whole grains, meat, and eggs in your diet.',
      vitaminD: 'Get more sunlight and consume foods rich in vitamin D, such as fish and fortified dairy.',
      calcium: 'Consume more dairy products, leafy greens, and fortified foods for calcium.',
      magnesium: 'Eat more nuts, seeds, and whole grains to increase magnesium intake.',
      zinc: 'Include more zinc-rich foods like shellfish, meat, and legumes in your diet.',
    };

    const filteredMeals = computed(() => {
      if (diet.value === 'Vegetarian' || diet.value === 'Vegan') {
        return ['Cereale', 'Hummus scaled', 'Lentil soup with whole grain bread and a side salad', 'Edamame beans', 'Grilled tofu with stir-fried vegetables'];
      } else if (programType.value === 'Bulk') {
        if (selectedRiskFactors.value.includes('bloodPressure')) {
          return ['Protein oatmeal with sliced bananas', 'Cottage cheese with pineapple chunks', 'Turkey and avocado wrap', 'Protein bar', 'Beef stir-fry with mixed'];
        } else if (selectedRiskFactors.value.includes('diabetes')) {
          return ['Greek yogurt', 'A small apple with a tablespoon of almond butter', 'A side of quinoa or brown rice', 'Carrot sticks with hummus', 'Steamed broccoli or asparagus'];
        } else if (selectedRiskFactors.value.includes('cholesterol')) {
          return ['Oatmeal made with rolled oats', 'Walnuts or almonds', 'Quinoa or wild rice pilaf', 'Mixed salad', 'Lentil soup with whole grain bread and a side salad'];
        } else {
          return ['Scrambled eggs', 'Greek yogurt', 'Grilled chicken', 'Whole wheat toast', 'Baked salamon'];
        }
      } else if (programType.value === 'Cut') {
        if (selectedRiskFactors.value.includes('bloodPressure')) {
          return ['Protein oatmeal with sliced bananas', 'Cottage cheese with pineapple chunks', 'Turkey and avocado wrap', 'Protein bar', 'Beef stir-fry with mixed'];
        } else if (selectedRiskFactors.value.includes('diabetes')) {
          return ['Greek yogurt', 'A small apple with a tablespoon of almond butter', 'A side of quinoa or brown rice', 'Carrot sticks with hummus', 'Steamed broccoli or asparagus'];
        } else if (selectedRiskFactors.value.includes('cholesterol')) {
          return ['Oatmeal made with rolled oats', 'Walnuts or almonds', 'Quinoa or wild rice pilaf', 'Mixed salad', 'Lentil soup with whole grain bread and a side salad'];
        } else {
          return ['Steel cut oats', 'Salad chicken', 'Hummus scaled', 'Beef stir-fry with mixed', 'Omelet made with egg'];
        }
      }
    });

    const selectMeal = (mealName) => {
      selectedMeal.value = mealName;
      if (mealImages[mealName]) {
        selectedImage.value = mealImages[mealName];
      }
      if (mealDescriptions[mealName]) {
        selectedDescription.value = mealDescriptions[mealName];
      }
    };

    const openModal = () => {
      isModalOpen.value = true;
    };
    const closeModal = () => {
      isModalOpen.value = false;
    };

    const fetchUserData = async () => {
      try {
        const userEmail = localStorage.getItem('email');
        const q = query(collection(projectFirestore, 'userResponses'), where('userEmail', '==', userEmail));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          programType.value = data.programType;
          showData.value = ['Bulk', 'Cut'].includes(programType.value);
          if (data.selectedRiskFactors) {
            selectedRiskFactors.value = data.selectedRiskFactors;
          }
          if (data.deficiencies) {
            deficiencies.value = data.deficiencies;
            setAdviceBasedOnDeficiencies();
          }
          if (data.diet) {
            diet.value = data.diet;
          }
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

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
      selectedRiskFactors,
      deficiencies,
      advice,
      isModalOpen,
      openModal,
      closeModal,
    };
  },
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: black;
  margin-bottom: 20px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.green-box {
  background: linear-gradient(to bottom left, #2ecc71, #ffffff); 
  border-radius: 20px;
  width: 100%;
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
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s, transform 0.2s;
  border: 1px solid #ddd;
}

.meal-list li.selected,
.meal-list li:hover {
  background-color: #e0f7fa;
  transform: scale(1.05);
}

.meal-text {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.image-display-section {
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container {
  position: relative;
  border: 2px solid #2ecc71;
  border-radius: 10px;
  overflow: hidden;
}

.meal-name {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  text-align: center;
  padding: 10px;
  font-size: 18px;
  font-weight: bold;
}

.meal-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: cover;
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
  color: #2ecc71;
  margin-bottom: 10px;
}

.modal-content p {
  color: #333;
  margin-bottom: 20px;
}

.modal-content button {
  padding: 8px 16px;
  background-color: #2ecc71;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
