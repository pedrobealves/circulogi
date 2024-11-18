import { useCircuitStore } from "~/simulation/stores/circuit";
import { NodeType } from "~/simulation/types/nodeType";

export function useNodeSelect() {
  const circuitStore = useCircuitStore();
  const nodesOriginalColors = new Map<string, string>();

  const connDetect = computed(() => circuitStore.isConnDetection);

  function selectNode(nodeId: string) {
    circuitStore.selectNode(nodeId);
  }

  function nodesConnHighlight(nodeId: string) {
    const node = circuitStore.getNode(nodeId);

    // Retorna caso o nó não exista ou não seja do tipo "IN" ou "OUT"
    if (!node || (node.type !== "IN" && node.type !== "OUT")) return;

    // Determina o tipo oposto do nó atual
    const targetType = node.type === NodeType.IN ? NodeType.OUT : NodeType.IN;

    // Filtra os nós que não correspondem à lógica de entrada/saída
    const nodeFiltered = circuitStore
      .getNodesByType(targetType)
      .filter(
        ({ inputs, outputs }) =>
          outputs[0] !== node.inputs[0] || inputs[0] !== node.outputs[0]
      );

    // Salva as cores originais e altera para "blue" em um único loop
    nodeFiltered.forEach((node) => {
      nodesOriginalColors.set(node.id, node.color);
      node.color = "blue";
    });
  }

  function nodesConnDeHighlight() {
    nodesOriginalColors.forEach((color, nodeId) => {
      const node = circuitStore.getNode(nodeId);
      if (node) {
        node.color = color; // Restaura a cor original do nó
      }
    });

    // Limpa o mapa de cores originais após restaurar as cores
    nodesOriginalColors.clear();
  }

  watch(
    connDetect,
    (newValue) => {
      if (newValue) {
        nodesConnDeHighlight();
        circuitStore.isConnDetection = false;
      }
    },
    { immediate: false }
  );

  return { selectNode, nodesConnHighlight, nodesConnDeHighlight };
}
