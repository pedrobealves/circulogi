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
  },
  {
    label: Actions.DELETE,
    icon: "M18 6L6 18M6 6l12 12",
  },
];

// Estado reativo para verificar o item selecionado
const selectedAction = computed(() => circuitStore.selectedAction);

// Handler para definir a ação selecionada
const selectAction = (label: Actions) => {
  if (selectedAction.value !== label) {
    circuitStore.setSelectedAction(label);
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
