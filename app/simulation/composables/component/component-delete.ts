import type { Node } from "~/simulation/types/node";
import { useNodesStore } from "@/simulation/stores/node";
import { useEdgesStore } from "@/simulation/stores/edge";
import { useNodeFactory } from "~/simulation/composables/node/node-factory";
import { useEdgeFactory } from "~/simulation/composables/edge/edge-factory";
import { NodeType } from "@/simulation/types/nodeType";
import { NodeRole } from "@/simulation/types/nodeRole";
import { useSimulationStore } from "@/simulation/stores/simulation";
import { useConnectionNodes } from "@/simulation/composables/node/node-connection";

export function useComponentDelete() {
  const simulationStore = useSimulationStore();
  const nodesStore = useNodesStore();
  const edgesStore = useEdgesStore();
  const { createNode } = useNodeFactory();
  const { createEdge } = useEdgeFactory();
  const { deleteConnection } = useConnectionNodes();

  function deleteComponent(mainNode: Node): void {
    if (!mainNode) {
      console.warn("Nó principal não fornecido!");
      return;
    }

    const nodes = nodesStore.nodes;

    // Verifica se há nós de conexão associados (entradas e saídas)
    // Remover nós de conexão conectados às entradas do nó principal
    mainNode.inputs.forEach((inputId) => {
      const inputNode = nodesStore.getNode(inputId);
      if (inputNode && inputNode.type === "CONN") {
        // Se for um nó de tipo CONN, chama a função para removê-lo
        deleteConnection(inputNode);
      }
    });

    // Remover nós de conexão conectados às saídas do nó principal
    mainNode.outputs.forEach((outputId) => {
      const outputNode = nodesStore.getNode(outputId);
      if (outputNode && outputNode.type === "CONN") {
        // Se for um nó de tipo CONN, chama a função para removê-lo
        deleteConnection(outputNode);
      }
    });

    // Passo 1: Identificar os nós envolvidos no componente
    const inputNodes = mainNode.inputs.map((inputId) => nodes[inputId]);
    const outputNodes = mainNode.outputs.map((outputId) => nodes[outputId]);

    // Passo 2: Remover as arestas que conectam os nós de entrada e saída
    // Remover arestas de entrada
    inputNodes.forEach((inputNode) => {
      if (inputNode) {
        inputNode.outputs = inputNode.outputs.filter(
          (id) => id !== mainNode.id
        );
        // Remover as arestas correspondentes dos edges
        edgesStore.removeEdge(inputNode.id, mainNode.id);
      }
    });

    // Remover arestas de saída
    outputNodes.forEach((outputNode) => {
      if (outputNode) {
        outputNode.inputs = outputNode.inputs.filter(
          (id) => id !== mainNode.id
        );
        edgesStore.removeEdge(mainNode.id, outputNode.id);
      }
    });

    // Passo 3: Remover as referências nos nós de entrada e saída
    mainNode.inputs = [];
    mainNode.outputs = [];

    // Passo 4: Deletar o nó principal, nós de entrada e nós de saída
    // Remover os nós do circuito
    nodesStore.removeNode(mainNode.id);
    inputNodes.forEach((node) => node && nodesStore.removeNode(node.id));
    outputNodes.forEach((node) => node && nodesStore.removeNode(node.id));
  }

  return { deleteComponent };
}
