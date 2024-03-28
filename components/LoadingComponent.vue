<template>
  <div class="loading-overlay">
    <div class="loading-animation">
      <div class="ball ball1"></div>
      <div class="ball ball2"></div>
      <div class="ball ball3"></div>
    </div>
  </div>
</template>

<script>
export default {
  // You can add props, data, methods, etc. if needed
};
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5); /* Semi-transparent white background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure the loading overlay appears on top of other content */
}

.loading-animation {
  display: flex;
}

.ball {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: 0 10px;
  animation: bounce 0.8s infinite alternate ease-in-out; /* Adjust animation duration and easing */
}

.ball1 {
  background-color: #3498db; /* Blue */
}

.ball2 {
  background-color: #e74c3c; /* Red */
}

.ball3 {
  background-color: #2ecc71; /* Green */
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-30px); /* Adjust the bounce height as needed */
  }
}
</style>
