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
  <footer class="bg-green-600"> <!-- Changed background color to green -->
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

<style>
/* Footer Styles */
footer {
  background-color: #2ecc71; /* Updated background color to green */
}

footer p {
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

footer a {
  transition: color 0.3s ease;
}

footer a:hover {
  color: #fff; /* Updated hover color */
}
</style>
