import { useCircuitStore } from "~/simulation/stores/circuit";

export function useSaveState() {
  const circuitStore = useCircuitStore();

  function save() {
    circuitStore.save();
  }

  return { save };
}
