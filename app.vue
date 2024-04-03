<template>
  <div class="flex flex-col min-h-screen">
    <SiteHeader v-if="showHeaderFooter" />
    <main >
      <NuxtPage />
    </main>
    <SiteFooter v-if="showHeaderFooter" />
  </div>
</template>

<script>
export default {
  computed: {
    showHeaderFooter() {
      const noHeaderFooterRoutes = ['/login', '/signup','/plan'];
      const formRoutes = '/form/';

      // Check if the current route path is within the form folder
      const isInFormFolder = this.$route.path.includes(formRoutes);

      // Check if the current route path is not in the noHeaderFooterRoutes and not within the form folder
      return !noHeaderFooterRoutes.includes(this.$route.path) && !isInFormFolder;
    },
  },
}
</script>
