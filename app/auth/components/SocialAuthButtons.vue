<script setup lang="ts">
import GitHubLogo from "~icons/radix-icons/github-logo";
import FaBrandsGoogle from "~icons/fa-brands/google";
import LucideSpinner from "~icons/lucide/loader-2";

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  onGitHubAuth: {
    type: Function as PropType<() => void>,
    required: true,
  },
  onGoogleAuth: {
    type: Function as PropType<() => void>,
    required: true,
  },
});
</script>

<template>
  <div class="relative">
    <div class="absolute inset-0 flex items-center">
      <span class="w-full border-t" />
    </div>
    <div class="relative flex justify-center text-xs uppercase">
      <span class="bg-background px-2 text-muted-foreground">
        {{ $t("continue") }}
      </span>
    </div>
  </div>
  <div class="flex flex-col gap-4">
    <Button
      variant="outline"
      type="button"
      @click="props.onGitHubAuth"
      :disabled="props.isLoading"
    >
      <LucideSpinner v-if="props.isLoading" class="mr-2 h-4 w-4 animate-spin" />
      <GitHubLogo v-else class="mr-2 h-4 w-4" />
      GitHub
    </Button>
    <Button
      variant="outline"
      type="button"
      @click="props.onGoogleAuth"
      :disabled="props.isLoading"
    >
      <LucideSpinner v-if="props.isLoading" class="mr-2 h-4 w-4 animate-spin" />
      <FaBrandsGoogle v-else class="mr-2 h-4 w-4" />
      Google
    </Button>
  </div>
</template>
