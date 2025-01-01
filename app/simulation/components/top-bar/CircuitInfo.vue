<script setup lang="ts">
defineProps<{
  name?: string;
}>();
</script>

<template>
  <div class="flex flex-col h-full p-1.5 rounded-full w-full bg-[#E7E7E7]">
    <div
      class="flex flex-row px-4 py-2 justify-between items-center bg-white w-full h-full rounded-full"
    >
      <div class="flex flex-row items-center gap-2 max-w-full w-full">
        <IconCircuit />
        <h3
          class="text-[color:var(--dark,#363636)] font-inter text-lg font-semibold leading-normal overflow-hidden text-ellipsis whitespace-nowrap max-w-64"
        >
          {{ name }}
        </h3>
      </div>
      <div class="ml-2">
        <IconChevronDown />
      </div>
    </div>
  </div>
</template>
