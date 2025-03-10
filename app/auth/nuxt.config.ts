export default defineNuxtConfig({
  modules: ["@nuxtjs/i18n"],
  i18n: {
    langDir: "locales",
    locales: [
      { code: "pt", file: "pt.json" },
      { code: "en", file: "en.json" },
    ],
  },
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/dashboard",
      exclude: ["/", "/register"],
    },
  },
});
