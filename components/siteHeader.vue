<template>
  <div>
    <Disclosure as="nav" class="bg-white-800" v-slot="{ open }">
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex flex-shrink-0 items-center">
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
                  v-for="item in filteredNavigation"
                  :key="item.name"
                  :href="item.href"
                  :class="[
                    item.current
                      ? 'bg-green-300 text-black'
                      : 'text-black-300 hover:bg-#2ecc71-700 hover:text-#2ecc71',
                    'rounded-md px-3 py-2 text-sm font-medium',
                  ]"
                  :aria-current="item.current ? 'page' : undefined"
                >{{ item.name }}</NuxtLink>
              </div>
            </div>
          </div>
          <div class="ml-4 flex items-center sm:ml-6">
            <template v-if="isUserAuthenticated">
              <div class="relative" @click="toggleProfileDropdown">
                <button class="bg-white rounded-full h-10 w-10 flex items-center justify-center focus:outline-none transition duration-300 ease-in-out hover:opacity-80">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    :class="{'rotate-180': profileDropdownOpen, 'rotate-0': !profileDropdownOpen}"
                    class="w-4 h-4 ml-2 transition-transform duration-300 ease-in-out"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <div v-if="profileDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </NuxtLink>
                  <NuxtLink to="/profile/messages" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Messages
                  </NuxtLink>
                  <button
                    @click="logoutUser"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <NuxtLink to="/login">
                <button
                  class="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded-md mr-2 text-sm"
                >
                  Log in
                </button>
              </NuxtLink>
              <NuxtLink to="/signup">
                <button
                  class="bg-white hover:bg-gray-200 text-green-500 px-3 py-1 rounded-md text-sm"
                >
                  Sign Up
                </button>
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>

      <DisclosurePanel class="sm:hidden">
        <div class="space-y-1 px-2 pb-3 pt-2">
          <DisclosureButton
            v-for="item in filteredNavigation"
            :key="item.name"
            as="a"
            :to="item.href"
            :class="[
              item.current
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'block rounded-md px-3 py-2 text-base font-medium',
            ]"
            :aria-current="item.current ? 'page' : undefined"
          >{{ item.name }}</DisclosureButton>
          <DisclosureButton as="button" @click="toggleDropdown" class="block rounded-md px-3 py-2 text-base font-medium">
            More
          </DisclosureButton>
          <div v-if="dropdownOpen" class="space-y-1 px-2 pb-3 pt-2">
            <NuxtLink
              v-for="dropdownItem in dropdownItems"
              :key="dropdownItem.name"
              :href="dropdownItem.href"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >{{ dropdownItem.name }}</NuxtLink>
            <div class="border-t border-gray-200"></div>
            <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Profile
            </NuxtLink>
            <NuxtLink to="/messages" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Messages
            </NuxtLink>
            <button
              @click="logoutUser"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { useRouter, useRoute } from "vue-router";
import { isAuthenticated, userEmail, logout } from "@/firebase/config";
import { ref, onMounted, watch, computed } from "vue";
import { projectFirestore } from "@/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

const router = useRouter();
const route = useRoute();

const profession = ref(null);
const isUserAuthenticated = computed(() => isAuthenticated.value);

const navigation = ref([]);
const filteredNavigation = ref([]);
const dropdownOpen = ref(false);
const profileDropdownOpen = ref(false);

const initializeNavigation = () => {
  const currentRouteName = route.name;
  navigation.value = [
    { name: "Home", href: "/", current: currentRouteName === "index" },
    { name: "Program", href: "/plan", current: currentRouteName === "plan" },
    {
      name: "Diet",
      href: "/plan/diet",
      current: currentRouteName === "plan-diet",
    },
    {
      name: "About us",
      href: "/aboutus",
      current: currentRouteName === "aboutus",
    },
    {
      name: "Contact",
      href: "/contact",
      current: currentRouteName === "contact",
    },
  ];

  filteredNavigation.value = [...navigation.value];

  if (profession.value === "Admin") {
    filteredNavigation.value.push({ name: "Admin", href: "/admin", current: currentRouteName === "admin" });
  }
};



// Function to log out the user
const logoutUser = async () => {
  try {
    await logout();
    console.log("User logged out");
    router.push("/login");
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
};

// Function to fetch the user's profession
const fetchUserProfession = async () => {
  try {
    const userQuery = query(
      collection(projectFirestore, "profile"),
      where("userEmail", "==", userEmail.value)
    );
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      profession.value = userData.profession;

      initializeNavigation();
    } else {
      console.log("userSnapshot is Empty");
    }
  } catch (error) {
    console.error("Error fetching user profession:", error);
  }
};

// Toggle dropdown menu
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// Toggle profile dropdown
const toggleProfileDropdown = () => {
  profileDropdownOpen.value = !profileDropdownOpen.value;
};

onMounted(() => {
  if (typeof window !== "undefined" && window.localStorage) {
    const email = window.localStorage.getItem("email");
    initializeNavigation();

    if (email) {
      userEmail.value = email;
    }
  }
});

watch(
  () => route.name,
  () => {
    initializeNavigation();
  }
);
</script>

<style scoped>
.profile-picture-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
}
</style>
