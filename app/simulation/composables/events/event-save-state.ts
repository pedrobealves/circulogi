import { useSimulationStore } from "~/simulation/stores/simulation";

export function useSaveState() {
  const circuitStore = useSimulationStore();

  function save() {
    circuitStore.save();
  }

  return { save };
}
