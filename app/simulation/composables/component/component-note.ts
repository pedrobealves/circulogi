import { useSimulationStore } from "~/simulation/stores/simulation";
import { NodeType } from "~/simulation/types/nodeType";

export function useComponentNote() {
  const circuitStore = useSimulationStore();

  function openNote(nodeId: string) {
    const node = circuitStore.getNode(nodeId);

    if (node?.type !== NodeType.TEXT) return;

    if (node.value) {
      node.color = "transparent";
    } else {
      node.color = "black";
    }
  }

  return { openNote };
}
