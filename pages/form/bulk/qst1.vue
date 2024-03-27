<template>
  <div class="mx-0">
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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { projectFirestore, auth } from '../../../firebase/config';
import { collection, addDoc, doc, getDoc, updateDoc,setDoc } from 'firebase/firestore';

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

      const userDocRef = doc(projectFirestore, 'users', user.uid);
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

      router.push('/form/bulk/qst2'); 
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
</style>
