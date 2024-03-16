import { defineNuxtConfig } from '@nuxt/bridge'

export default defineNuxtConfig({
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon', '@nuxt/content'],
  content: {
    //https://content.nuxtjs.org/api/configuration,
  },
  layouts: {
    bgAnimations: '~/layouts/bgAnimations.vue',
  },
  tailwindcss: {
    // Tailwind CSS configuration: https://tailwindcss.com/docs/configuration
    config: {
      darkMode: 'class',
      theme: {
        extend: {}
      }
    }
  }
})
