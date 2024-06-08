<script setup>
const socialLinks = [
  { name: 'GitHub', href: 'https://github.com', icon: 'entypo-social:github-with-circle' },
  { name: 'Twitter', href: 'https://twitter.com', icon: 'entypo-social:twitter' },
  { name: 'Facebook', href: 'https://facebook.com', icon: 'entypo-social:facebook' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com', icon: 'entypo-social:linkedin-with-circle' },
  { name: 'Instagram', href: 'https://instagram.com', icon: 'entypo-social:instagram' }
];

const siteLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
  { name: 'Privacy Policy', href: '/privacy-policy' }
];
</script>

<template>
  <footer class="footer-container">
    <section class="footer-content">
      <nav class="site-links">
        <a v-for="link in siteLinks" :key="link.name" :href="link.href" class="site-link">
          {{ link.name }}
        </a>
      </nav>
      <div class="footer-icons">
        <a v-for="link in socialLinks" :key="link.name" :href="link.href" class="footer-link" target="_blank" rel="noopener noreferrer">
          <Icon :name="link.icon" size="1.5rem" />
        </a>
      </div>
      <p class="copyright">&copy; Health + 2024. All Rights Reserved</p>
    </section>
  </footer>
</template>

<style scoped>
/* Footer Styles */
.footer-container {
  background-color: #2ecc71; /* Teal green shade for a modern look */
  padding: 2rem 0; /* Padding around the footer */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.footer-content {
  max-width: 1000px;
  width: 100%;
  padding: 0 1rem;
}

.site-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem; /* Space between site links and icons */
}

.site-link {
  font-size: 1rem; /* Font size for site links */
  color: #ffffff; /* White color for better contrast */
  text-decoration: none; /* Remove underline */
  transition: color 0.3s ease-in-out; /* Smooth transition on hover */
}

.site-link:hover {
  color: #ffeb3b; /* Vibrant yellow for hover effect */
}

.footer-icons {
  display: flex;
  justify-content: center; /* Centered icons */
  gap: 1.5rem; /* Increased gap between icons */
  margin-bottom: 1rem; /* Space between icons and copyright text */
}

.footer-link {
  color: #ffffff; /* Initial icon color set to white for better contrast */
  font-size: 1.5rem; /* Adjusted icon size */
  transition: color 0.3s ease-in-out, transform 0.3s ease-in-out; /* Smooth transition on hover */
}

.footer-link:hover {
  color: #ffeb3b; /* Vibrant yellow for hover effect */
  transform: scale(1.1); /* Slightly enlarge the icon on hover */
}

.copyright {
  font-size: 1rem; /* Font size for copyright text */
  color: #ffffff; /* White color for better contrast */
  font-weight: 500; /* Slightly bolder text */
}
</style>
