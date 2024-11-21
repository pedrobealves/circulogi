import type { Edge } from "~/simulation/types/edge";

export const useEdgesStore = defineStore("edges", () => {
  const edges = reactive<Record<string, Edge>>({});

  function addEdge(edge: Edge) {
    edges[edge.id] = edge;
  }

  function removeEdgeById(edgeId: string) {
    delete edges[edgeId];
  }

  // Remover uma aresta dada a ID de dois nós
  function removeEdge(sourceId: string, targetId: string) {
    // Encontrar a aresta que conecta os dois nós (sourceId -> targetId ou targetId -> sourceId)
    for (const edgeId in edges) {
      const edge = edges[edgeId];

      if (!edge) return;
      // Verifica se a aresta conecta esses dois nós (considerando a direção)
      if (
        (edge.source === sourceId && edge.target === targetId) ||
        (edge.source === targetId && edge.target === sourceId)
      ) {
        // Remover a aresta da store
        delete edges[edgeId];
        return; // Sai da função após encontrar e remover a aresta
      }
    }

    console.warn(
      `Nenhuma aresta encontrada entre os nós ${sourceId} e ${targetId}`
    );
  }

  return {
    edges,
    addEdge,
    removeEdge,
    removeEdgeById,
  };
});
