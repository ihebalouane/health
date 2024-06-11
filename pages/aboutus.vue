<template>
  <title>About us</title>
    <div class="about-us">
      <h1 class="section-title">About Us</h1>
      <div class="website-info">
        <img src="~/assets/images/gymlogo.png" alt="Website Logo" class="website-logo">
        <p class="info-text">
          Welcome to <span class="brand-name">Health+</span>, your ultimate destination for achieving your fitness goals! Developed by <span class="developer-name">Iheb Alouane</span>, our website provides a platform for individuals to connect with experienced coaches who are dedicated to helping clients reach their desired fitness level.
        </p>
        <p class="info-text">
          Our team of coaches is committed to providing personalized support and guidance to clients, ensuring that their fitness journey is both effective and enjoyable. Whether you're looking to lose weight, build muscle, improve your endurance, or simply lead a healthier lifestyle, our coaches are here to help you every step of the way.
        </p>
        <p class="info-text">
          With our <span class="highlight">24/7 support system</span>, you can rest assured knowing that help is always available whenever you need it. We believe in the power of consistent follow-up and encouragement to drive progress and success.
        </p>
        <p class="info-text">
          At <span class="brand-name">Health+</span>, we understand that every individual is unique, which is why our coaches tailor fitness plans to suit your specific needs and preferences. Whether you prefer one-on-one coaching, group sessions, or virtual training, we have options that cater to you.
        </p>
        <p class="info-text">
          Join our community today and embark on a journey to transform your health and fitness with the guidance and support of our dedicated coaches. Your goals are within reach, and we're here to help you achieve them.
        </p>
        <button class="get-started-button">Get Started</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AboutUs',
  }
  </script>
  
  <style scoped>
  .about-us {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .section-title {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 40px;
  }
  
  .website-info {
    margin-top: 20px;
  }
  
  .website-logo {
    display: block;
    margin: 0 auto 20px;
    width: 150px;
    height: auto;
  }
  
  .brand-name {
    font-weight: bold;
    color: #2ecc71;
  }
  
  .developer-name {
    font-style: italic;
  }
  
  .info-text {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 20px;
  }
  
  .highlight {
    color: #f39c12;
  }
  
  .get-started-button {
    display: block;
    margin: 40px auto 0;
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
  </style>
  