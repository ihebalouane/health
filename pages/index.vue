<template>
  <div class="page">
    <BgAnimations />
    <div class="home-section-1">
      <div class="left-content">
        <h1 class="title">Health+</h1>
        <p class="description">
          Your ultimate destination for achieving your fitness goals
        </p>
        <div class="buttons">
          <button
            class="get-started-button"
            @click="handleGetStarted('section-2')"
          >
            Get Started
          </button>
          <button class="learn-more-button" @click="scrollToSection4">
            Learn More
          </button>
        </div>
      </div>
      <div class="right-content">
        <img
          src="~/assets/images/homepic.png"
          alt="Placeholder Image"
          class="placeholder-image"
        />
      </div>
    </div>
    <div class="separator"></div>

    <!-- Section 2 -->
    <div id="section-2" class="home-section-2">
      <div class="program-box">
        <img
          src="~/assets/images/Bulk.png"
          alt="Program 1"
          class="program-image"
        />
        <h3 class="program-title">Bulk Edition</h3>
        <p class="program-description">Gain muscle mass through specialized workout routines and nutrition plans tailored for effective muscle growth.</p>
        <button
          @click="handleProgramRedirect('/form/bulk/qst0')"
          class="get-started-button"
        >
          Get Started
        </button>
      </div>
      <div class="program-box">
        <img
          src="~/assets/images/cut.jpg"
          alt="Program 2"
          class="program-image"
        />
        <h3 class="program-title">Cut Edition</h3>
        <p class="program-description">Loss and muscle definition, providing targeted workout programs and dietary guidance to help users achieve a leaner physique.
</p>
        <button
          @click="handleProgramRedirect('/form/cut/qst0')"
          class="get-started-button"
        >
          Get Started
        </button>
      </div>
    </div>
    <div class="separator"></div>

    <!-- Section 3 -->
    <div id="section-3" class="home-section-3">
      <div class="program-box">
        <img
          src="~/assets/images/start.jpg"
          alt="Program 3"
          class="program-image"
        />
        <div class="description-container">
          <h3 class="program-title">Start your program</h3>
          <div class="program-description">
            <p>
              Step into your fitness journey with us. Our bespoke programs cater to your goals. Our tailored services are designed to help you achieve your desired level of fitness. Here you can find your program for your fitness goals
            </p>
          </div>
          <button
            @click="handleProgramRedirect('/plan')"
            class="get-started-button"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
    <div class="separator"></div>

    <!-- Section 4 carousel -->
    <div>
      <Carousel :items-to-show="2" :wrap-around="true">
        <Slide v-for="(slide, index) in carouselItems" :key="index">
          <div class="carousel__item">
            <img
              :src="slide.image"
              alt="Slide {{ index + 1 }}"
              class="carousel-image"
            />
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
    <br />

    <!-- FAQ Section -->
    <div id="faq-section" class="faq-section">
      <h2 class="faq-title">Frequently Asked Questions</h2>
      <div class="faq-container">
        <div class="faq-item" v-for="(faq, index) in faqList" :key="index">
          <div class="question-answer">
            <h3 class="question">{{ faq.question }}</h3>
            <p class="answer" :class="{ expanded: faq.expanded }">
              {{ faq.answer }}
            </p>
          </div>
          <div class="expand-icon" @click="toggleAnswer(index)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-6 h-6"
              :class="{ rotate: faq.expanded }"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages Circle -->
    <router-link
      v-if="isUserLoggedIn"
      to="/profile/messages"
      class="messages-circle"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
        />
      </svg>
    </router-link>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Carousel, Navigation, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

export default defineComponent({
  name: "HomePage",
  components: { Carousel, Slide, Navigation },
  setup() {
    const userEmail = ref("");
    const isUserLoggedIn = ref(false);
    const router = useRouter();

    onMounted(() => {
      userEmail.value = localStorage.getItem("email") || "";
      isUserLoggedIn.value = !!userEmail.value; // Check if user is logged in based on email
    });

    const handleGetStarted = (section) => {
      if (isUserLoggedIn.value) {
        // Scroll to the specified section if user is logged in
        document.getElementById(section).scrollIntoView({ behavior: "smooth" });
      } else {
        // Redirect to login page if user is not logged in
        router.push("/login");
      }
    };

    const handleProgramRedirect = (path) => {
      if (isUserLoggedIn.value) {
        // Redirect to the specified path if user is logged in
        router.push(path);
      } else {
        // Redirect to login page if user is not logged in
        router.push("/login");
      }
    };

    return {
      userEmail,
      handleGetStarted,
      handleProgramRedirect,
      isUserLoggedIn,
    };
  },
  data() {
    return {
      carouselItems: [
        {
          image: "/coach1.jpg",
          title: "Fitness Classes",
          description:
            "Join our diverse range of fitness classes tailored to your needs.",
        },
        {
          image: "/coach2.jpg",
          title: "Personal Training",
          description:
            "Get personalized training sessions with our certified trainers.",
        },
        {
          image: "/coach3.jpg",
          title: "Nutrition Guidance",
          description:
            "Receive expert guidance on nutrition to complement your fitness journey.",
        },
      ],
      faqList: [
        {
          question: "What are the benefits of regular exercise?",
          answer:
            "Regular exercise has numerous benefits, including improved cardiovascular health, increased muscle strength and flexibility, better mood and mental health, and weight management.",
          expanded: false,
        },
        {
          question: "How often should I exercise?",
          answer:
            "It's recommended to engage in at least 150 minutes of moderate-intensity aerobic exercise or 75 minutes of vigorous-intensity aerobic exercise per week, along with muscle-strengthening activities on two or more days a week.",
          expanded: false,
        },
        {
          question: "Can I exercise if I have a medical condition?",
          answer:
            "In most cases, yes. However, it's important to consult with your healthcare provider before starting any new exercise program, especially if you have a medical condition or are taking medications.",
          expanded: false,
        },
        {
          question: "What should I eat before and after exercise?",
          answer:
            "Before exercise, choose a meal or snack that provides carbohydrates for energy and a small amount of protein. After exercise, refuel with a meal or snack that contains protein and carbohydrates to support recovery and muscle repair.",
          expanded: false,
        },
        {
          question: "How can I stay motivated to exercise?",
          answer:
            "Setting realistic goals, tracking your progress, varying your routine, and finding a workout buddy can help you stay motivated to exercise regularly.",
          expanded: false,
        },
      ],
    };
  },
  methods: {
    scrollToSection4() {
      const faqSection = document.querySelector("#faq-section");
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: "smooth" });
      }
    },
    toggleAnswer(index) {
      this.faqList[index].expanded = !this.faqList[index].expanded;
    },
  },
});
</script>

<style scoped>
/* General Styles */
.page {
  overflow-x: hidden;
  font-family: 'Arial', sans-serif;
      background: #f4f4f400;
}

/* Section 1 */
.home-section-1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 100px;
    background: linear-gradient(45deg, #22a45ad4, #27ae6078);
    color: white;
    border-radius: 10px 10px 0px 0px;
}

.left-content {
  flex: 1;
  animation: fadeInLeft 1s;
}

.right-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeInRight 1s;
}

.title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.description {
  font-size: 1.5rem;
  margin-bottom: 40px;
}

.buttons {
  display: flex;
}

.get-started-button,
.learn-more-button {
  padding: 12px 24px;
  font-size: 1.2rem;
  border: none;
  border-radius: 27px;
  margin-right: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  border: 2px solid white;
}

.get-started-button {
  background-color: #fff;
  color: #2ecc71;
}

.learn-more-button {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.get-started-button:hover {
  background-color: #27ae60;
  color: #fff;
}

.learn-more-button:hover {
  background-color: white;
  color: #27ae60;
}

.placeholder-image {
  width: 100%;
  max-width: 500px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Section 2 */
.home-section-2 {
  display: flex;
  justify-content: space-between;
  padding: 100px;
  background-color: #f9f9f900;
}

.program-box {
  flex: 1;
  text-align: center;
  border: 2px solid #2ecc71;
  border-radius: 10px;
  padding: 20px;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.program-box:hover {
  transform: translateY(-10px);
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
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.program-description {
  font-size: 1rem;
  color: #555;
  margin-bottom: 20px;
}

.get-started-button {
  background-color: #2ecc71;
  color: white;
}

.get-started-button:hover {
  background-color: #27ae60;
}

/* Section 3 */
.home-section-3 {
  display: flex;
  justify-content: space-between;
  padding: 100px;
  background-color: #f4f4f4;
}

.description-container {
  flex: 1;
}

.carousel__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease;
}

.carousel__item:hover {
  transform: translateY(-10px);
}

.carousel-image {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 20px;
}

.carousel-description {
  text-align: center;
}

.carousel-description h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.carousel-description p {
  font-size: 1rem;
  color: #555;
}

/* FAQ Section */
.faq-section {
  padding: 100px;
  background-color: white;
}

.faq-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2ecc71;
  margin-bottom: 50px;
  text-align: center;
}

.faq-container {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  margin-bottom: 30px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
}

.question-answer {
  cursor: pointer;
}

.question {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.answer {
  font-size: 1.2rem;
  color: #555;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.answer.expanded {
  max-height: 1000px;
}

.expand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.expand-icon svg {
  fill: #555;
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.rotate {
  transform: rotate(180deg);
}

/* Messages Circle */
.messages-circle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: #2ecc71;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.messages-circle:hover {
  transform: scale(1.1);
}

.messages-circle svg {
  width: 24px;
  height: 24px;
}

/* Keyframe Animations */
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
