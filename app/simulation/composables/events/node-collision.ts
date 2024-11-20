import * as vNG from "v-network-graph";
import { useNodesStore } from "@/simulation/stores/node";
import { useCircuitStore } from "@/simulation/stores/circuit";

import type { Node } from "~/simulation/types/node";

export function useNodeCollision() {
  const circuitStore = useCircuitStore();

  const nodes = circuitStore.nodes;
  const layoutNodes = computed(() => circuitStore.layout.nodes);

  const collisionRadius: number = 50; // Raio de colisão, pode ser ajustado conforme necessário

  const isCollisionDetectionInProgress = ref(false);
  const currentNode = ref<any>(null); // Variável para armazenar o nó atual
  const currentColliding = ref<any>(null); // Variável para armazenar o nó atual

  interface NodePosition {
    x?: number;
    y?: number;
    type: string;
  }

  interface NodesPosition {
    [key: string]: NodePosition;
  }

  // Função para calcular a distância entre dois pontos
  function calculateDistance(
    point1: vNG.Position,
    point2: vNG.Position
  ): number {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function isColliding(
    targetNode: vNG.Position,
    nodesPosition: NodesPosition,
    nodeToIgnore: string
  ): string {
    //console.log(targetNode)

    for (const nodeId in nodes) {
      if (nodeId === nodeToIgnore) continue;
      if (
        !nodes[nodeId] ||
        (nodes[nodeId].type !== "IN" && nodes[nodeId].type !== "OUT")
      )
        continue;

      const nodePosition = nodesPosition[nodeId];
      if (!nodePosition) continue;
      if (nodePosition.x !== undefined && nodePosition.y !== undefined) {
        const distance = calculateDistance(
          targetNode,
          nodePosition as vNG.Position
        );
        if (distance <= collisionRadius) {
          return nodeId; // Colisão detectada
        }
      }
    }
    return "node"; // Nenhuma colisão detectada
  }

  function handleNodeCollision(node: { [name: string]: vNG.Position }) {
    currentNode.value = node;
    const nodeToIgnore: string = Object.keys(node)[0] || ""; // O nó que deve ser ignorado
    const targetNode = node[nodeToIgnore];

    const selectedNodes = circuitStore.selectedNodes;

    //console.log(selectedNodes);

    if (!selectedNodes) return;

    if (selectedNodes.type !== "IN" && selectedNodes.type !== "OUT") return;

    if (!targetNode) {
      return;
    }

    //console.log(JSON.parse(JSON.stringify(circuitStore.layout)).nodes);
    const colliding: string = isColliding(
      targetNode,
      layoutNodes.value,
      nodeToIgnore
    );

    if (colliding !== "node") {
      currentColliding.value = colliding;
      console.log("Colisão detectada com o nó: ", colliding);
      isCollisionDetectionInProgress.value = true; // Redefina a flag após a conclusão
    } else {
      isCollisionDetectionInProgress.value = false; // Redefina a flag após a conclusão
    }
  }

  function detectCollision(node: Node) {
    if (!node) return; // Verifique se o nó é válido

    const colliding: string = currentColliding.value;

    if (colliding !== "node") {
      const firstKey = Object.keys(node)[0] ?? "";

      const targetNode: Node = nodes[colliding]!;
      const sourceNode: Node = nodes[firstKey]!;

      circuitStore.connectionNodes(sourceNode, targetNode);
    }
  }

  watch(isCollisionDetectionInProgress, (newValue) => {
    if (newValue) {
      detectCollision(currentNode.value);
    }
  });

  return {
    handleNodeCollision,
  };
}
