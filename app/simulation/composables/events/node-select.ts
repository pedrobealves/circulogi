import { useCircuitStore } from "~/simulation/stores/circuit";

export function useNodeSelect() {
  const circuitStore = useCircuitStore();

  function selectNode(nodeId: string) {
    circuitStore.selectNode(nodeId);
  }

  return { selectNode };
}
