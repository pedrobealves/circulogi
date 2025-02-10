<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { useSimulationStore } from "@/simulation/stores/simulation";

const isOwner = computed(() => {
  return user.value?.id === circuitStore.circuit?.userId;
});

const user = useSupabaseUser();
const circuitStore = useSimulationStore();

defineEmits<{
  (e: "save"): void;
  (e: "export"): void;
}>();
</script>

<template>
  <div
    class="flex w-full h-full items-center justify-center bg-[#E7E7E7] rounded-full px-[6px] gap-[3px]"
  >
    <ActionButton tooltip="Salvar" @click="$emit('save')" v-if="isOwner">
      <IconSave />
    </ActionButton>

    <ActionButton tooltip="Exportar como imagem" @click="$emit('export')">
      <IconImage />
    </ActionButton>
  </div>
</template>
