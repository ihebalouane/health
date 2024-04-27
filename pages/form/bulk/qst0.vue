<template>
  <div class="mx-0">
    <site-header/>
    <qst-header/>
    <BgAnimations/>
    <div class="gender-question">
      <div class="gender-content">
        <h1 class="text-3xl mb-5 text-gray-700">Choose Your Gender</h1>
        <p class="text-lg mb-3 text-gray-600">We'd love to know more about you! Pick your gender:</p>
        <div class="gender-options flex justify-center">
          <label class="gender-option flex items-center cursor-pointer text-lg text-gray-700 mr-5" @click="selectGender('male')" :class="{ 'selected': selectedGender === 'male' }">
            <input type="radio" :checked="selectedGender === 'male'" class="hidden-input">
            <span class="radio-btn w-5 h-5 rounded-full border-2 border-green-500 mr-2"></span> 
            Male
          </label>
          <label class="gender-option flex items-center cursor-pointer text-lg text-gray-700" @click="selectGender('female')" :class="{ 'selected': selectedGender === 'female' }">
            <input type="radio" :checked="selectedGender === 'female'" class="hidden-input">
            <span class="radio-btn w-5 h-5 rounded-full border-2 border-green-500 mr-2"></span> 
            Female
          </label>
        </div>
        <button v-if="selectedGender" @click="submitGender" class="next-button inline-block mt-8 px-4 py-2 text-lg bg-green-500 text-white border-2 border-green-500 rounded-md transition duration-300 hover:bg-green-600 hover:border-green-600">Next →</button>
      </div>
    </div>
    <!-- Information box -->
    <div class="explanation-box">
      <div class="info-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      </div>
      <p>We ask for this information to help you reach your goals more effectively.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { projectFirestore, auth } from '../../../firebase/config';
import { collection, addDoc, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const selectedGender = ref(null);
const router = useRouter();

const selectGender = (gender) => {
  selectedGender.value = gender;
};

const submitGender = async () => {
  try {
    const user = auth.currentUser;
    const userGender = selectedGender.value;
    
    if (user) {
      await addDoc(collection(projectFirestore, "Bulk"), {
        gender: userGender,
        programType: 'Bulk', // Set programType to 'Bulk' regardless of gender
        userEmail: user.email,
        timestamp: new Date() 
      });

      const userDocRef = doc(projectFirestore, 'userResponses', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        await updateDoc(userDocRef, {
          gender: userGender,
          programType: 'Bulk'
        });
        console.log("Gender selection saved!");
      } else {
        await setDoc(userDocRef, {
          gender: userGender,
          userEmail: user.email,
          programType: 'Bulk'
        });
        console.log("New user document created!");
      }

      router.push('/form/bulk/qst1'); 
    } else {
      console.error("User not logged in.");
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
</script>

<style lang="scss" scoped>
.gender-question {
  text-align: center;
  margin-top: 0;
}

.home-svg {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px; 
  color: #2ecc71; 
  text-decoration: none;
}

.gender-content {
  margin-top: 50px; 
}

h1 {
  font-size: 36px;
  margin-bottom: 20px;
  color: #333;
}

.question-description {
  font-size: 18px;
  margin-bottom: 15px;
  color: #555;
}

.gender-options {
  display: flex;
  justify-content: center;
}

.gender-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 20px;
  color: #333;
  margin: 0 15px;
  transition: color 0.3s;
}

.gender-option:hover {
  color: #2ecc71; 
}

.gender-option.selected .radio-btn {
  background-color: #2ecc71; 
}

.hidden-input {
  position: absolute;
  opacity: 0;
}

.radio-btn {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #2ecc71; 
  margin-right: 10px;
  position: relative;
}

.radio-btn::after {
  content: '';
  display: block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s;
}

.hidden-input:checked + .radio-btn::after {
  opacity: 1;
}

.next-button {
  display: inline-block;
  margin-top: 30px;
  padding: 5px 10px;
  font-size: 1.2rem;
  background-color: #2ecc71; 
  color: #fff;
  border: 2px solid #2ecc71; 
  border-radius: 9px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.next-button:hover {
  background-color: #27ae60; /* Changed hover background color to a slightly darker shade of green */
  color: #fff;
}

.explanation-box {
  max-width: 400px;
  margin: 20px auto;
  padding: 10px;
  border-radius: 8px;
  backdrop-filter: blur(10px); /* Add a blur effect for modernity */
  background-color: rgba(255, 255, 255, 0.5); /* Semi-transparent background color */
  color: #333;
  font-size: 1rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow for modernity */
  display: flex;
  align-items: center; /* Center content vertically */
  justify-content: center; /* Center content horizontally */
}

.info-icon {
  margin-right: 10px; /* Space between the icon and text */
}
</style>
