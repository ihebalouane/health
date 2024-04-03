<template>
  <div class="center-container">
    <div class="container">
      <div class="section day-list-section">
        <div class="section-content">
          <ul class="day-list">
            <li v-for="(day, index) in days" :key="index" :class="{ 'selected': selectedDay === day.name }" @click="showItems(day.name)">
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
          <video v-if="selectedVideo" controls loop :src="selectedVideo" :style="{ width: '100%', height: '100%' }">
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <div class="section gym-details-section">
        <div class="section-content">
          <h2>Gym Details</h2>
          <p>Welcome to our gym! Our facilities offer state-of-the-art equipment and professional trainers to help you achieve your fitness goals.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import planLogic from './plan';

export default {
  mixins: [planLogic]
};
</script>

<style>
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: white;
}

.container {
  display: flex;
  width: 95%; /* Adjusted width */
  max-width: 1500px; /* Max width for the container */
  height: 500px; /* Increased height */
  border: 2px solid #ccc;
  border-radius: 10px; /* Rounded corners */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Drop shadow */
}

.section {
  flex: 1; /* Each section occupies equal space */
  overflow: hidden; /* Prevent content from overflowing */
}

.section-content {
  padding: 20px;
  height: 100%;
}

.section-content h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 24px;
}

.day-list,
.items-list {
  padding: 0;
  margin: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.day-list li,
.items-list li {
  margin: 0;
  padding: 0;
  flex: 1; /* Each list item fills the available space */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  transition: opacity 0.3s ease; /* Fade transition */
}

.day-list li:not(:last-child):after,
.items-list li:not(:last-child):after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #ccc;
}

.selected {
  opacity: 0.5; /* Reduced opacity for selected item */
}

.day-list-section,
.video-section {
  background-color: #fff; /* White background for the sections */
}

.day-text {
  transition: transform 0.2s ease; /* Smooth transition on hover */
  color: black; /* Text color related to #2ecc71 */
}

.day-list li:hover .day-text {
  transform: translateY(-5px); /* Move the text up slightly on hover */
}

.gym-details-section {
  background-color: #fff; /* White background for the gym details section */
}
</style>
