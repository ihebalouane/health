<template>
  <div>
    <qst-header/>
  <div class="gender-question">
    <div class="gender-content">
      <h1>Choose Your Gender</h1>
      <p class="question-description">We'd love to know more about you! Pick your gender:</p>
      <div class="gender-options">
        <label class="gender-option" @click="selectGender('male')" :class="{ 'selected': selectedGender === 'male' }">
          <input type="radio" v-model="selectedGender" value="male" class="hidden-input">
          <span class="radio-btn"></span>
          Male
        </label>
        <label class="gender-option" @click="selectGender('female')" :class="{ 'selected': selectedGender === 'female' }">
          <input type="radio" v-model="selectedGender" value="female" class="hidden-input">
          <span class="radio-btn"></span>
          Female
        </label>
      </div>
      <router-link v-if="selectedGender" :to="`/form/cut/qst2`" class="next-button">Next →</router-link>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const selectedGender = ref(null);
const router = useRouter();

const selectGender = (gender) => {
  selectedGender.value = gender;
};
</script>

<style lang="scss" scoped>
.gender-question {
  text-align: center;
  margin-top: 50px;
}

.home-svg {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px; /* Adjust the size as needed */
  color: #007bff;
  text-decoration: none;
}

.gender-content {
  margin-top: 50px; /* Adjust as needed for vertical centering */
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
  color: #007bff;
}

.gender-option.selected .radio-btn {
  background-color: #007bff;
}

.hidden-input {
  position: absolute;
  opacity: 0;
}

.radio-btn {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #007bff;
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
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1.2rem;
  background-color: #007bff;
  color: #fff;
  border: 2px solid #007bff;
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.next-button:hover {
  background-color: #0056b3;
  color: #fff;
}
</style>
