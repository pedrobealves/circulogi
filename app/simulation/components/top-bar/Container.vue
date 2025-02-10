<script setup lang="ts">
import { useSimulationStore } from "~/simulation/stores/simulation";
import { useSaveThumbnail } from "@/simulation/composables/events/event-save-thumbnail";
const circuitStore = useSimulationStore();
const circuit = computed(() => circuitStore.circuit);
const { uploadThumbnail } = useSaveThumbnail();

function saveCircuit() {
  console.log("Saving circuit...");
  circuitStore.save();
}
</script>

<template>
  <div
    class="flex flex-row h-14 items-center justify-start container-block w-fit absolute top-6 z-[2] left-14"
  >
    <TopBarProfileLink />
    <TopBarDivider />
    <TopBarCircuitInfo :name="circuit?.name" />
    <TopBarDivider />
    <TopBarActions @save="saveCircuit" @export="uploadThumbnail" />
  </div>
</template>
