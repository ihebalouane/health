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
  computed: {
    showHeaderFooter() {
            const noHeaderFooterRoutes = ['/login', '/signup'];
      return !noHeaderFooterRoutes.includes(this.$route.path);
    },
  },
}
</script>