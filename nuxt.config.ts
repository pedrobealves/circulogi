// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  extends: ["app/auth", "app/simulation", "app/website", "app/common"],
  modules: ["@pinia/nuxt", "nuxt-workers", "@nuxtjs/tailwindcss"],
  pinia: {
    storesDirs: ["./stores/**"],
  },
});
