export default defineNuxtConfig({
  // https://nuxt.com/docs/api/configuration/nuxt-config
  modules: ["shadcn-nuxt", "unplugin-icons/nuxt"],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./app/common/components/ui",
  },
});
