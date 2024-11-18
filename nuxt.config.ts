// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    renderJsonPayloads: false,
  },

  extends: ["app/auth", "app/simulation", "app/website", "app/common"],

  modules: ["@pinia/nuxt", "nuxt-workers"],
  pinia: {
    storesDirs: ["./stores/**"],
  },
});