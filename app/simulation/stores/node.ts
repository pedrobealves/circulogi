import type { Node } from "~/simulation/types/node";

export const useNodesStore = defineStore("nodes", () => {
  const nodes = reactive<Record<string, Node>>({});

  const layouts = reactive({
    nodes: {} as Record<string, { type: string }>,
  });

  function addNode(node: Node) {
    nodes[node.id] = node;

    layouts.nodes[node.id] = { type: node.type }; // Atualiza o layout com o tipo do nó
  }

  function getNode(nodeId: string) {
    return nodes[nodeId];
  }

  const nodeCount = computed(() => Object.keys(nodes).length);

  function removeNode(nodeId: string) {
    delete nodes[nodeId];
  }

  return {
    nodes,
    getNode,
    addNode,
    removeNode,
    nodeCount,
    layouts,
  };
});
