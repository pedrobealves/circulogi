import { defineStore } from "pinia";
import type { Circuit } from "~/simulation/types/circuit";

export const useCircuitStore = defineStore("circuit", () => {
  const circuits = ref<Circuit[]>([]);

  function setCircuits(newCircuits: any) {
    circuits.value = newCircuits;
  }

  function addCircuit(newCircuit: Circuit) {
    circuits.value.push(newCircuit);
  }

  function removeCircuit(circuitId: string) {
    circuits.value = circuits.value.filter((c) => c.id !== circuitId);
  }

  function updateCircuit(circuitId: string, newCircuit: Circuit) {
    const circuitIndex = circuits.value.findIndex((c) => c.id === circuitId);

    if (circuitIndex !== -1) {
      circuits.value[circuitIndex] = newCircuit;
    }
  }

  function getCircuitById(circuitId: string) {
    return circuits.value.find((c) => c.id === circuitId);
  }

  const lastCircuits = computed<Circuit[]>(() => circuits.value.slice(0, 16));

  function $reset() {
    circuits.value = [];
  }

  return {
    circuits,
    lastCircuits,
    setCircuits,
    addCircuit,
    removeCircuit,
    updateCircuit,
    getCircuitById,
    $reset,
  };
});
