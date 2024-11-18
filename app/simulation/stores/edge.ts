import type { Edge } from "~/simulation/types/edge";

export const useEdgesStore = defineStore("edges", () => {
  const edges = reactive<Record<string, Edge>>({});

  function addEdge(edge: Edge) {
    edges[edge.id] = edge;
  }

  function removeEdge(edgeId: string) {
    delete edges[edgeId];
  }

  return {
    edges,
    addEdge,
    removeEdge,
  };
});
