<script setup>
const links = [
  { name: 'GitHub', href: 'https://github.com', icon: 'entypo-social:github-with-circle' },
  { name: 'Twitter', href: 'https://twitter.com', icon: 'entypo-social:twitter' },
  { name: 'Facebook', href: 'https://facebook.com', icon: 'entypo-social:facebook' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com', icon: 'entypo-social:linkedin-with-circle' },
  { name: 'Instagram', href: 'https://instagram.com', icon: 'entypo-social:instagram' }
]
</script>

<template>
  <footer class="bg-green-500"> <!-- Changed background color to green -->
    <section class="mx-auto max-w-7xl px-2 sm:px-4 py-6 text-gray-300 flex flex-col items-center">
      <p>&copy; Health + 2024. All Rights Reserved</p>
      <div class="flex flex-row justify-center gap-4 mt-4">
        <a v-for="link in links" :key="link.name" :href="link.href" class="text-gray-300 hover:text-gray-400">
          <Icon :name="link.icon" size="1.5rem" />
        </a>
      </div>
    </section>
  </footer>
</template>

<style scoped>
/* Footer Styles */
footer {
  background-color: #2ecc71; /* Updated to a teal green shade for a modern look */
  padding: 1rem 0; /* Padding around the footer */
}

footer p {
  font-size: 1rem; /* Increased font size for better readability */
  color: #ffffff; /* Changed color to white for better contrast */
  margin-bottom: 0.5rem; /* Slight spacing between text and icons */
  font-weight: 500; /* Slightly bolder text */
  text-align: center; /* Centered text */
}

footer .footer-icons {
  display: flex;
  justify-content: center; /* Centered icons */
  gap: 1rem; /* Increased gap between icons */
}

footer a {
  color: #ffffff; /* Set initial icon color to white for better contrast */
  font-size: 1.5rem; /* Adjusted icon size */
  transition: color 0.2s ease-in-out; /* Smooth color transition on hover */
}

footer a:hover {
  color: #ffeb3b; /* Vibrant yellow for hover effect */
}
</style>


