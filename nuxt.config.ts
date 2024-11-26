// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },
  extends: ["app/auth", "app/simulation", "app/website", "app/common"],
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase",
    "unplugin-icons/nuxt",
  ],
  pinia: {
    storesDirs: ["./stores/**"],
  },
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/app",
      exclude: ["/", "/register", "/circuit"],
    },
  },
});
