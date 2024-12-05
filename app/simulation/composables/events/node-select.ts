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
    if (
      !node ||
      (node.type !== "IN" && node.type !== "OUT") ||
      node.role != "COMPONENT"
    )
      return;

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
      node.color = "#1D62C9";
    });

    nodesOriginalColors.set(node.id, node.color);
    node.color = "#1D62C9";
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

  function updateLabels() {
    // Função para atualizar o label de um nó, seja AND, OR, NOT, etc.
    const updateNodeLabel = (node: any) => {
      if (
        node.label === "CLK" ||
        node.label.slice(0, 2) === "S_" ||
        node.label.slice(0, 2) === "R_" ||
        node.label.slice(0, 2) === "J_" ||
        node.label.slice(0, 2) === "K_"
      )
        return;

      if (node.label.slice(0, 2) === "Q_" || node.label.slice(0, 4) === "~(Q_")
        return;

      if (!node.inputs[0]) return;

      const mainNode = circuitStore.getNode(node.inputs[0]);
      if (!mainNode || !mainNode.inputs || mainNode.inputs.length < 1) return;

      // Lógica para tratar o nó do tipo NOT
      if (mainNode.type === NodeType.NOT && mainNode.inputs[0]) {
        const inputNode = circuitStore.getNode(mainNode.inputs[0]);
        if (inputNode) {
          node.label = circuitStore.generateNodeLabel(
            [inputNode.label ?? ""],
            mainNode.type
          );
        }
        return;
      }

      // Lógica para tratar nós binários (AND, OR, etc.)
      if (
        mainNode.inputs.length >= 2 &&
        mainNode.inputs[0] &&
        mainNode.inputs[1]
      ) {
        const inputNode1 = circuitStore.getNode(mainNode.inputs[0]);
        const inputNode2 = circuitStore.getNode(mainNode.inputs[1]);
        if (inputNode1 && inputNode2) {
          node.label = circuitStore.generateNodeLabel(
            [inputNode1.label ?? "", inputNode2.label ?? ""],
            mainNode.type
          );
        }
      }
    };

    // Atualiza os nós de tipo 'CONN' (conexão)
    const nodes = circuitStore.getNodesByType(NodeType.CONN);
    const reversedNodes = [...nodes].reverse();
    reversedNodes.forEach(updateNodeLabel);

    // Atualiza os nós de tipo 'OUT' (saída)
    const nodesIn = circuitStore.getNodesByType(NodeType.OUT);
    const reversedNodesIn = [...nodesIn].reverse();
    reversedNodesIn.forEach((node) => {
      if (node.role === "COMPONENT") {
        updateNodeLabel(node);
      }
    });
  }

  watch(
    connDetect,
    (newValue) => {
      if (newValue) {
        nodesConnDeHighlight();
        updateLabels();
        circuitStore.isConnDetection = false;
      }
    },
    { immediate: false }
  );

  return { selectNode, nodesConnHighlight, nodesConnDeHighlight };
}
