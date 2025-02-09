// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  runtimeConfig: {
    bdUrl: process.env.DATABASE_URL,
  },
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
    "unplugin-icons/nuxt",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase",
    "@nuxt/image",
    "nuxt-time",
    "@nuxt/content",
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
});
