// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },
  extends: [
    "app/auth",
    "app/simulation",
    "app/website",
    "app/common",
    "app/circuit",
  ],
  modules: [
    "@nuxtjs/supabase",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@prisma/nuxt",
    "unplugin-icons/nuxt",
  ],
  i18n: {
    lazy: false,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root", // recommended
    },
    strategy: "no_prefix",
  },
  prisma: {
    generateClient: false,
  },
});
