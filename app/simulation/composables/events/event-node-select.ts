import { useSimulationStore } from "~/simulation/stores/simulation";
import { NodeType } from "~/simulation/types/nodeType";
import { getNodesByType } from "@/simulation/utils/nodes-by-type";
import { useNodeLabel } from "@/simulation/composables/node/node-label";

export function useNodeSelect() {
  const circuitStore = useSimulationStore();
  const { generateNodeLabel } = useNodeLabel();
  const nodesOriginalColors = new Map<string, string>();

  const connDetect = computed(() => circuitStore.isConnDetection);

  function selectNode(nodeId: string) {
    circuitStore.selectNode(nodeId);
  }

  function deselectNodes() {
    circuitStore.deselectNodes();
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
    const nodeFiltered = getNodesByType(targetType).filter(
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
    console.log("updateLabels");
    // Função para atualizar o label de um nó, seja AND, OR, NOT, etc.
    const updateNodeLabel = (node: any) => {
      if (!node.inputs[0]) return;

      const mainNode = circuitStore.getNode(node.inputs[0]);
      if (!mainNode || !mainNode.inputs || mainNode.inputs.length < 1) return;

      if (
        mainNode.type === NodeType.JK ||
        mainNode.type === NodeType.SR ||
        mainNode.type === NodeType.T ||
        mainNode.type === NodeType.D
      )
        return;

      // Lógica para tratar o nó do tipo NOT
      if (mainNode.type === NodeType.NOT && mainNode.inputs[0]) {
        const inputNode = circuitStore.getNode(mainNode.inputs[0]);
        if (inputNode) {
          node.label = generateNodeLabel(
            [inputNode.label ?? ""],
            mainNode.type
          );
        }
        return;
      }

      // Lógica para tratar nós binários (AND, OR, etc.)
      if (mainNode.inputs.length >= 2) {
        // Obtém todos os nós de entrada
        const inputNodes = mainNode.inputs
          .map((inputId) => circuitStore.getNode(inputId)) // Busca os nós pelos IDs
          .filter((inputNode) => inputNode !== undefined); // Remove entradas inválidas

        if (inputNodes.length === mainNode.inputs.length) {
          // Garante que todos os inputs são válidos antes de gerar o label
          node.label = generateNodeLabel(
            inputNodes.map((inputNode) => inputNode.label ?? ""), // Coleta os labels dos nós de entrada
            mainNode.type
          );
        }
      }
    };

    // Atualiza os nós de tipo 'CONN' (conexão)
    const nodes = getNodesByType(NodeType.CONN);
    const reversedNodes = [...nodes].reverse();
    reversedNodes.forEach(updateNodeLabel);

    // Atualiza os nós de tipo 'OUT' (saída)
    const nodesIn = getNodesByType(NodeType.OUT);
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

  return {
    selectNode,
    nodesConnHighlight,
    updateLabels,
    deselectNodes,
    nodesConnDeHighlight,
  };
}
