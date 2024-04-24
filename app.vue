<template>
  <div class="flex flex-col min-h-screen">
    <SiteHeader v-if="showHeaderFooter" />
    <main class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 grow items-start w-full">
      <NuxtPage />
    </main>
    <SiteFooter v-if="showHeaderFooter" />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    showHeaderFooter() {
      const noHeaderFooterRoutes = ['/login', '/signup','/plan','/profile','/profile/messages'];
      const formRoutes = '/form/';

      // Check if the current route path is within the form folder
      const isInFormFolder = this.$route.path.includes(formRoutes);

      // Check if the current route path is not in the noHeaderFooterRoutes and not within the form folder
      return !noHeaderFooterRoutes.includes(this.$route.path) && !isInFormFolder;
    },
  },
}
</script>
