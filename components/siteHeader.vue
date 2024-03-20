<template>
  <div>
    <Disclosure as="nav" class="bg-white-800" v-slot="{ open }">
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <!-- Mobile menu button-->
            <DisclosureButton
              class="inline-flex items-center justify-center rounded-md p-2 text-black-400 hover:bg-black-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
              <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
          <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex flex-shrink-0 items-center">
              <!-- Website logo -->
              <img
                class="block h-8 w-auto lg:hidden"
                src="~/assets/images/gymlogo.png?color=indigo&shade=500"
                alt="Your Company"
              />
              <img
                class="hidden h-8 w-auto lg:block"
                src="~/assets/images/gymlogo.png?color=indigo&shade=500"
                alt="Your Company"
              />
            </div>
            <div class="hidden sm:ml-6 sm:block">
              <div class="flex space-x-4">
                <a
                  v-for="item in navigation"
                  :key="item.name"
                  :href="item.href"
                  :class="[item.current ? 'bg-green-300 text-black' : 'text-black-300 hover:bg-#2ecc71-700 hover:text-#2ecc71', 'rounded-md px-3 py-2 text-sm font-medium']"
                  :aria-current="item.current ? 'page' : undefined"
                >{{ item.name }}</a>
              </div>
            </div>
          </div>
          <!-- Profile picture or login/sign-up buttons -->
          <div class="ml-4 flex items-center sm:ml-6">
            <!-- Toggle between profile picture and logout button -->
            <template v-if="isAuthenticated">
              <button @click="toggleLogout" class="bg-white rounded-full h-10 w-10 flex items-center justify-center focus:outline-none">
                <!-- Render profile picture here -->
                <div class="profile-picture-placeholder"></div>
              </button>
              <!-- Logout button -->
              <button @click="toggleLogout" class="ml-2 bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm">Logout</button>
            </template>
            <template v-else>
              <router-link to="/login">
                <button class="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded-md mr-2 text-sm">Log in</button>
              </router-link>
              <router-link to="/signup">
                <button class="bg-white hover:bg-gray-200 text-green-500 px-3 py-1 rounded-md text-sm">Sign Up</button>
              </router-link>
            </template>
          </div>
        </div>
      </div>

      <DisclosurePanel class="sm:hidden">
        <div class="space-y-1 px-2 pb-3 pt-2">
          <DisclosureButton
            v-for="item in navigation"
            :key="item.name"
            as="a"
            :href="item.href"
            :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']"
            :aria-current="item.current ? 'page' : undefined"
          >{{ item.name }}</DisclosureButton>
        </div>
      </DisclosurePanel>
    </Disclosure>
  </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { useRouter } from 'vue-router';
import { isAuthenticated, logout } from '/firebase/config'; // Import the logout function

const router = useRouter();

const route = router.currentRoute.value;

const navigation = [
  { name: 'Home', href: '/', current: route.name == 'index' },
  { name: 'Blog', href: '/blog', current: route.name == 'blog' },
  { name: 'Projects', href: '/projects', current: route.name == 'projects' },
  { name: 'About us', href: '/aboutus', current: route.name == 'aboutus' },
]

const toggleLogout = async () => {
  try {
    await logout(); // Call the logout function to log out the user
    console.log('User logged out')
    router.push('/login'); // Redirect to the login page after logout
  } catch (error) {
    console.error('Error logging out:', error.message);
  }
};
</script>



<style scoped>
/* Styles for the profile picture placeholder */
.profile-picture-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
}
</style>
