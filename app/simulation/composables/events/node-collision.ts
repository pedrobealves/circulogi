import * as vNG from "v-network-graph";
import { useSimulationStore } from "@/simulation/stores/simulation";
import type { Node } from "~/simulation/types/node";
import { computed, ref, watch } from "vue";

// Types and interfaces
interface NodePosition {
  x?: number;
  y?: number;
  type: string;
}

interface NodesPosition {
  [key: string]: NodePosition;
}

interface CollisionState {
  isDetecting: boolean;
  currentNode: any | null;
  collidingNode: string | null;
}

interface CollisionConfig {
  radius: number;
  validTypes: string[];
}

export function useNodeCollision() {
  // Store initialization
  const circuitStore = useSimulationStore();
  const nodes = circuitStore.nodes;

  // Computed properties
  const layoutNodes = computed(() => circuitStore.layout.nodes);

  // Configuration
  const config: CollisionConfig = {
    radius: 50,
    validTypes: ["IN", "OUT"],
  };

  // State management
  const state = reactive<CollisionState>({
    isDetecting: false,
    currentNode: null,
    collidingNode: null,
  });

  // Utility functions
  const calculateDistance = (
    point1: vNG.Position,
    point2: vNG.Position
  ): number => {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const isValidNodeType = (node: Node): boolean => {
    return config.validTypes.includes(node.type);
  };

  // Core collision detection
  const findCollidingNode = (
    targetNode: vNG.Position,
    nodesPosition: NodesPosition,
    nodeToIgnore: string
  ): string => {
    for (const nodeId in nodes) {
      if (
        nodeId === nodeToIgnore ||
        !nodes[nodeId] ||
        !isValidNodeType(nodes[nodeId])
      ) {
        continue;
      }

      const nodePosition = nodesPosition[nodeId];
      if (!nodePosition?.x || !nodePosition?.y) continue;

      const distance = calculateDistance(
        targetNode,
        nodePosition as vNG.Position
      );

      if (distance <= config.radius) {
        return nodeId;
      }
    }

    return "node";
  };

  // Handle node movement and collision
  const handleNodeCollision = (node: { [name: string]: vNG.Position }) => {
    const nodeId = Object.keys(node)[0] || "";
    const targetNode = node[nodeId];

    if (!targetNode || !isValidNodeForCollision(nodeId)) {
      resetCollisionState();
      return;
    }

    const collidingNodeId = findCollidingNode(
      targetNode,
      layoutNodes.value,
      nodeId
    );

    updateCollisionState(node, collidingNodeId);
  };

  // Helper functions
  const isValidNodeForCollision = (nodeId: string): boolean => {
    const selectedNodes = circuitStore.selectedNodes;
    return !!selectedNodes && isValidNodeType(selectedNodes);
  };

  const updateCollisionState = (
    node: { [name: string]: vNG.Position },
    collidingNodeId: string
  ) => {
    state.currentNode = node;

    if (collidingNodeId !== "node") {
      state.collidingNode = collidingNodeId;
      state.isDetecting = true;
      console.log("Colisão detectada com o nó: ", collidingNodeId);
    } else {
      resetCollisionState();
    }
  };

  const resetCollisionState = () => {
    state.isDetecting = false;
    state.collidingNode = null;
  };

  // Process collision and create connection
  const processCollision = (node: Node) => {
    if (!node) return;

    const collidingNodeId = state.collidingNode;
    if (collidingNodeId === "node" || !collidingNodeId) return;

    const sourceNodeId = Object.keys(node)[0] ?? "";
    if (!sourceNodeId) return;

    const sourceNode = nodes[sourceNodeId];
    const targetNode = nodes[collidingNodeId];

    if (sourceNode && targetNode) {
      circuitStore.connectionNodes(sourceNode, targetNode);
    }
  };

  // Watch for collision state changes
  watch(
    () => state.isDetecting,
    (isDetecting) => {
      if (isDetecting) {
        processCollision(state.currentNode);
      }
    }
  );

  return {
    handleNodeCollision,
    // Expose additional methods if needed
    isCollisionInProgress: computed(() => state.isDetecting),
    currentCollidingNode: computed(() => state.collidingNode),
  };
}
