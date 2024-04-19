<template>
  <div class="page">
    <BgAnimations/>
    <div class="home-section-1">
      <div class="left-content">
        <p>welcome {{ userEmail }}</p>
        <h1 class="title">Health+</h1>
        <p class="description">Your ultimate destination for achieving your fitness goals</p>
        <div class="buttons">
          <button class="get-started-button" @click="scrollToSection2">Get Started</button>
          <button class="learn-more-button" @click="scrollToSection4">Learn More</button>
        </div>
      </div>
      <div class="right-content">
        <img src="~/assets/images/homepic.png" alt="Placeholder Image" class="placeholder-image">
      </div>
    </div>
    <div class="separator"></div>
    <!-- Section 2 -->
    <div id="section-2" class="home-section-2">
      <div class="program-box">
        <img src="~/assets/images/program2.jpg" alt="Program 1" class="program-image">
        <h2 class="program-title">Bulk Edition</h2>
        <p class="program-description">Bulk Edition Description</p>
        <!-- Update router-link to conditionally render based on authentication status -->
        <router-link v-if="isAuthenticated" :to="{ path: '/form/bulk/qst1' }" class="get-started-button">Get Started</router-link>
        <router-link v-else to="/login" class="get-started-button">Get Started</router-link>
      </div>
      <div class="program-box">
        <img src="~/assets/images/program2.jpg" alt="Program 2" class="program-image">
        <h2 class="program-title">Cut Edition</h2>
        <p class="program-description">Cut Edition Description</p>
        <!-- Update router-link to conditionally render based on authentication status -->
        <router-link v-if="isAuthenticated" :to="{ path: '/form/cut/qst1' }" class="get-started-button">Get Started</router-link>
        <router-link v-else to="/login" class="get-started-button">Get Started</router-link>
      </div>
    </div>
    <div class="separator"></div>
    <!-- Section 3 -->
    <div id="section-3" class="home-section-3">
      <div class="program-box">
        <img src="~/assets/images/program3.jpg" alt="Program 3" class="program-image">
        <div class="description-container">
          <h2 class="program-title">Program 3</h2>
          <div class="program-description">
            <p class="description-title">Program Description:</p>
            <p>Aliquam erat volutpat. Nulla facilisi. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi at varius felis.</p>
          </div>
          <!-- Update router-link to conditionally render based on authentication status -->
          <router-link v-if="isAuthenticated" to="/plan" class="get-started-button">Get Started</router-link>
          <router-link v-else to="/login" class="get-started-button">Get Started</router-link>
        </div>
      </div>
    </div>
    <div class="separator"></div>
    <!--Section 4 carousel-->
    <div>
      <Carousel :items-to-show="2" :wrap-around="true">
        <Slide v-for="(slide, index) in carouselItems" :key="index">
          <div class="carousel__item">
            <img :src="slide.image" alt="Slide {{ index + 1 }}" class="carousel-image">
            <div class="carousel-description">
              <h3>{{ slide.title }}</h3>
              <p>{{ slide.description }}</p>
            </div>
          </div>
        </Slide>
        <template #addons>
          <Navigation />
        </template>
      </Carousel>
    </div>
    <!-- FAQ Section -->
    <div id="faq-section" class="faq-section">
      <h2 class="faq-title">Frequently Asked Questions</h2>
      <div class="faq-item">
        <h3 class="question">Question 1: What are the benefits of regular exercise?</h3>
        <p class="answer">Regular exercise has numerous benefits, including improved cardiovascular health, increased muscle strength and flexibility, better mood and mental health, and weight management.</p>
      </div>
      <div class="faq-item">
        <h3 class="question">Question 2: How often should I exercise?</h3>
        <p class="answer">It's recommended to engage in at least 150 minutes of moderate-intensity aerobic exercise or 75 minutes of vigorous-intensity aerobic exercise per week, along with muscle-strengthening activities on two or more days a week.</p>
      </div>
      <div class="faq-item">
        <h3 class="question">Question 3: Can I exercise if I have a medical condition?</h3>
        <p class="answer">In most cases, yes. However, it's important to consult with your healthcare provider before starting any new exercise program, especially if you have a medical condition or any concerns about your health.</p>
      </div>
      <div class="faq-item">
        <h3 class="question">Question 4: What should I eat before and after exercising?</h3>
        <p class="answer">Before exercising, it's good to have a balanced meal or snack that includes carbohydrates for energy and protein for muscle repair. After exercising, focus on replenishing fluids and consuming a combination of protein and carbohydrates to aid in recovery.</p>
      </div>
      <div class="faq-item">
        <h3 class="question">Question 5: How do I stay motivated to exercise regularly?</h3>
        <p class="answer">Staying motivated can be challenging, but setting specific goals, finding activities you enjoy, varying your routine, and seeking support from friends, family, or a fitness community can help maintain motivation over time.</p>
      </div>
    </div>
    <router-link to="/profile/messages" class="messages-circle">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    </router-link>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Carousel, Navigation, Slide } from 'vue3-carousel'
import { isAuthenticated } from '@/firebase/config';
import userState from '@/store/userState.js'; // Update the path accordingly
import 'vue3-carousel/dist/carousel.css'


export default defineComponent({
  name: 'HomePage',
  components: {
    Carousel,
    Slide,
    Navigation,
  },
  setup () {
    const userEmail = userState.userEmail;
    return { userEmail };

  },
  data() {
    return {
      isAuthenticated: isAuthenticated,
      carouselItems: [
        {
          image: '/coach1.jpg',
          title: 'Fitness Classes',
          description: 'Join our diverse range of fitness classes tailored to your needs.'
        },
        {
          image: '/coach2.jpg',
          title: 'Personal Training',
          description: 'Get personalized training sessions with our certified trainers.'
        },
        {
          image: '/coach3.jpg',
          title: 'Nutrition Guidance',
          description: 'Receive expert guidance on nutrition to complement your fitness journey.'
        },
        
      ]
    };
  },
  methods: {
    scrollToSection2() {
      const section2 = document.getElementById('section-2');
      section2.scrollIntoView({ behavior: 'smooth' });
    },
    scrollToSection4() {
      const section4 = document.getElementById('faq-section');
      section4.scrollIntoView({ behavior: 'smooth' });
    }
  }
})
</script>

<style scoped>
/* Your existing styles */
.page {
  overflow-x: hidden;
}
/* Styles for Section 1 */
.home-section-1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 100px;
}

.messages-circle {
  position: fixed;
  bottom: 10px; /* Adjust as needed */
  right: 20px; /* Adjust as needed */
  width: 90px; /* Adjust as needed */
  height: 90px; /* Adjust as needed */
  background-color: #2ecc71; /* Example color */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff; /* Example text color */
  font-weight: bold;
  font-size: 1.2rem; /* Example font size */
  text-decoration: none; /* Remove underline from router-link */
}

.messages-circle svg {
  fill: #fff; /* Example icon color */
  width: 24px; /* Keep SVG icon size */
  height: 24px; /* Keep SVG icon size */
}

.left-content {
  flex: 1;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  color: #2ecc71;
}

.description {
  font-size: 1.5rem;
  margin-top: 20px;
  color: #444;
}

.buttons {
  margin-top: 40px;
}

.get-started-button,
.learn-more-button {
  padding: 12px 24px;
  font-size: 1.2rem;
  border: none;
  border-radius: 27px;
  margin-right: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.get-started-button {
  background-color: transparent;
  background-color: #2ecc71;
  color: #fff;
}

.learn-more-button {
  background-color: transparent;
  color: black;
  border: 1.5px solid black;
}

.get-started-button:hover{
  background-color: #27ae60;
  border-color: #27ae60;
  color: #fff;
}
.learn-more-button:hover {
  background-color: white;
  border-color: #27ae60;
  color: #27ae60;
}

.right-content {
  flex: 1;
}

.placeholder-image {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* Styles for Separator */
.separator {
  height: 2px;
  background-color: #2ecc71;
  margin: 50px auto;
  width: 80%;
}

/* Styles for Section 2 */
.home-section-2 {
  display: flex;
  justify-content: space-between;
  padding: 100px;
}

.program-box {
  flex: 1;
  text-align: center;
  border: 2px solid #2ecc71;
  border-radius: 10px;
  padding: 20px;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.program-box:not(:last-child) {
  margin-right: 40px;
}

.program-image {
  width: 100%;
  max-height: 300px; 
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 20px;
}

.program-title {
  font-size: 2rem;
  font-weight: bold;
  color: #000; 
}

/* Styles for Section 3 */
.home-section-3 {
  display: flex;
  justify-content: space-between;
  padding: 100px;
}

.description-container {
  flex: 1;
}

.program-description {
  font-size: 1.2rem;
  color: #000; 
  margin-bottom: 20px;
}

.description-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 10px;
}

.get-started-button {
  padding: 12px 24px;
  font-size: 1.2rem;
  border: none;
  border-radius: 25px;
  background-color: #2ecc71;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.get-started-button:hover {
  background-color: #27ae60;
}

/* Styles for Carousel */
.carousel-image {
  width: 100%;
  max-height: 200px; 
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
}

.carousel-description {
  padding: 10px;
  text-align: center;
}

.carousel-description h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 5px;
}

.carousel-description p {
  font-size: 1rem;
  color: #444;
}

/* Styles for FAQ Section */
.faq-section {
  padding: 100px;
}

.faq-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 40px;
}

.faq-item {
  margin-bottom: 30px;
}

.question {
  font-size: 1.8rem;
  font-weight: bold;
  color: #000; 
  margin-bottom: 10px;
}

.answer {
  font-size: 1.2rem;
  color: #444;
}
</style>