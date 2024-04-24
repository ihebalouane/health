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
                <NuxtLink
                  v-for="item in navigation"
                  :key="item.name"
                  :to="item.href"
                  :class="[item.current ? 'bg-green-300 text-black' : 'text-black-300 hover:bg-#2ecc71-700 hover:text-#2ecc71', 'rounded-md px-3 py-2 text-sm font-medium']"
                  :aria-current="item.current ? 'page' : undefined"
                >{{ item.name }}</NuxtLink>
              </div>
            </div>
          </div>
          <!-- Profile picture or login/sign-up buttons -->
          <div class="ml-4 flex items-center sm:ml-6" ref="profileDropdown">
            <!-- Profile dropdown -->
            <div class="relative" x-data="{ openProfile: false }">
              <button @click="openProfile = !openProfile" class="bg-white rounded-full h-10 w-10 flex items-center justify-center focus:outline-none transition duration-300 ease-in-out hover:opacity-80">
                <!-- SVG Profile icon -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                  <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
                </svg>
              </button>
              <!-- Profile dropdown menu -->
              <div x-show="openProfile" @click.away="openProfile = false" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <div class="py-1" role="none">
                  <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Profile</NuxtLink>
                  <NuxtLink to="/profile/messages" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem">Messages</NuxtLink>
                  <button @click="logoutUser" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left" role="menuitem">Logout</button>
                </div>
              </div>
            </div>
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
import { userEmail, logout } from '/firebase/config'; 

const router = useRouter();

const route = router.currentRoute.value;

const navigation = [
  { name: 'Home', href: '/', current: route.name == 'index' },
  { name: 'Blog', href: '/blog', current: route.name == 'blog' },
  { name: 'Projects', href: '/projects', current: route.name == 'projects' },
  { name: 'About us', href: '/aboutus', current: route.name == 'aboutus' },
]

const logoutUser = async () => {
  try {
    await logout(); 
    console.log('User logged out')
    router.push('/login'); 
  } catch (error) {
    console.error('Error logging out:', error.message);
  }
};
</script>

<style scoped>
.profile-picture-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
}
</style>
