<template>
  <p
    class="px-8 text-center text-sm text-muted-foreground"
    v-html="agreementText"
  ></p>
</template>

<script>
export default {
  computed: {
    agreementText() {
      return this.$t("agreementText", {
        termsOfService: `<a
          href="/terms-of-service"
          target="_blank"
          class="underline underline-offset-4 hover:text-primary"
          rel="noopener noreferrer"
        >${this.$t("termsOfService")}</a>`,
        privacyPolicy: `<a
          href="/privacy-policy"
          target="_blank"
          class="underline underline-offset-4 hover:text-primary"
          rel="noopener noreferrer"
        >${this.$t("privacyPolicy")}</a>`,
      });
    },
  },
};
</script>
