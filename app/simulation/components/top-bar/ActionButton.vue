<script setup lang="ts">
defineProps<{
  tooltip: string;
}>();
</script>

<template>
  <div class="relative flex flex-col items-center group">
    <button
      class="flex w-11 h-11 bg-white rounded-full items-center justify-center cursor-pointer hover:bg-zinc-950 hover:text-white duration-300 transition-colors"
      @click="$emit('click')"
    >
      <slot />
    </button>
    <div
      class="absolute top-0 flex flex-col items-center mt-14 hidden group-hover:flex"
    >
      <div class="w-2.5 h-2.5 -mb-2 rotate-45 bg-black" />
      <span
        class="relative z-10 text-white text-center text-xs rounded-lg leading-none whitespace-no-wrap bg-black px-3 py-2 w-32"
      >
        {{ tooltip }}
      </span>
    </div>
  </div>
</template>
