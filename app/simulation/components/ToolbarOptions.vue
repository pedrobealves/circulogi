<script setup lang="ts">
import { useCircuitStore } from "@/simulation/stores/circuit";
import { Actions } from "@/simulation/types/actions";
import { computed } from "vue";

// Pinia Store
const circuitStore = useCircuitStore();

// Itens do menu utilizando o enum Actions
const items = [
  {
    label: Actions.SELECT,
    icon: "M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z",
    css: "",
  },
  {
    label: Actions.DELETE,
    icon: "M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6",
    css: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23FF4D4D' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.3' d='M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6'/%3E%3C/svg%3E",
  },
];

// Estado reativo para verificar o item selecionado
const selectedAction = computed(() => circuitStore.selectedAction as Actions);

// Handler para definir a ação selecionada
const selectAction = (label: Actions) => {
  if (selectedAction.value !== label) {
    circuitStore.setSelectedAction(label);
    console.log(items.find((item) => item.label === selectedAction.value));
    document.documentElement.style.setProperty(
      "--custom-cursor",
      `url("${
        items.find((item) => item.label === selectedAction.value)?.css
      }") 32 32, pointer`
    );
  }
};

onMounted(() => {
  if (!circuitStore.selectedAction) {
    circuitStore.setSelectedAction(Actions.SELECT);
  }
});
</script>

<template>
  <ul
    class="flex flex-col gap-1 items-center justify-center rounded-2xl bg-white backdrop-blur-xl overflow-hidden container-block w-14 h-fit py-8 absolute -translate-y-1/2 left-14 top-1/2 z-[2]"
  >
    <li v-for="(item, index) in items" :key="index">
      <button
        @click="selectAction(item.label)"
        :class="[
          'item w-11 h-11 flex items-center justify-center duration-300 transition-colors rounded-2xl p-2',
          selectedAction === item.label
            ? 'border-2 border-black/5'
            : 'hover:bg-zinc-950 hover:text-white',
        ]"
      >
        <svg
          v-if="item.icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="size-6"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            :d="item.icon"
          />
        </svg>
      </button>
    </li>
  </ul>
</template>
<style>
:root {
  --custom-cursor: url("") 32 32, pointer;
}

.v-ng-node .draggable,
.v-ng-node .selectable {
  cursor: var(--custom-cursor);
}
</style>
