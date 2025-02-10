import type { Node } from "~/simulation/types/node";
import { useNodesStore } from "@/simulation/stores/node";
import { useEdgesStore } from "@/simulation/stores/edge";
import { useNodeFactory } from "~/simulation/composables/node/node-factory";
import { useEdgeFactory } from "~/simulation/composables/edge/edge-factory";
import { NodeType } from "@/simulation/types/nodeType";
import { NodeRole } from "@/simulation/types/nodeRole";
import { useSimulationStore } from "@/simulation/stores/simulation";

export function useConnectionNodes() {
  const simulationStore = useSimulationStore();
  const nodesStore = useNodesStore();
  const edgesStore = useEdgesStore();
  const { createNode } = useNodeFactory();
  const { createEdge } = useEdgeFactory();

  function connectionNodes(sourceNode: Node, targetNode: Node) {
    if (sourceNode.role !== "COMPONENT" || targetNode.role !== "COMPONENT") {
      console.log("Conexão inválida!");
      return;
    }

    if (sourceNode.type === targetNode.type) {
      console.log("Conexão inválida!");
      return;
    }

    const sourceInputs =
      sourceNode.type === "OUT" ? sourceNode.inputs : targetNode.inputs;
    const targetOutputs =
      sourceNode.type === "OUT" ? targetNode.outputs : sourceNode.outputs;

    if (sourceInputs[0] === targetOutputs[0]) {
      console.log("Conexão inválida!");
      return;
    }

    const connectionNode: Node = createNode({
      type: NodeType.CONN,
      role: NodeRole.COMPONENT,
    });

    connectionNode.label =
      targetNode.type === NodeType.IN ? targetNode.label : sourceNode.label;

    connectionNode.alias =
      targetNode.type === NodeType.IN ? targetNode.alias : sourceNode.alias;

    connectionNode.inputs.push(...sourceInputs); // O CONNECTION recebe a
    connectionNode.outputs.push(...targetOutputs);

    nodesStore.addNode(connectionNode);

    sourceInputs.forEach((inputId) => {
      edgesStore.addEdge(createEdge(inputId, connectionNode.id));

      const node = nodesStore.getNode(inputId);

      if (node) {
        node.outputs = node.outputs.filter(
          (input) =>
            input !==
            (sourceNode.type === "OUT" ? sourceNode.id : targetNode.id)
        );

        node.outputs.push(connectionNode.id);
      }
    });

    targetOutputs.forEach((outputId) => {
      edgesStore.addEdge(createEdge(connectionNode.id, outputId));

      const node = nodesStore.getNode(outputId);

      if (node) {
        node.inputs = node.inputs.filter(
          (input) =>
            input !==
            (sourceNode.type === "OUT" ? targetNode.id : sourceNode.id)
        );

        node.inputs.push(connectionNode.id);
      }
    });

    nodesStore.removeNode(sourceNode.id);
    nodesStore.removeNode(targetNode.id);

    simulationStore.isConnDetection = true;
  }

  function deleteConnection(connectionNode: Node) {
    // Certificar-se de que o nó de conexão é realmente do tipo "CONN"
    if (connectionNode.type !== "CONN") {
      console.log("Nó de conexão inválido!");
      return;
    }

    if (!connectionNode.inputs[0] || !connectionNode.outputs[0]) return;

    // Recuperar os nós de entrada e saída relacionados
    const sourceNode = nodesStore.getNode(connectionNode.inputs[0]);
    const targetNode = nodesStore.getNode(connectionNode.outputs[0]);

    if (!sourceNode || !targetNode) {
      console.log("Nós de origem ou destino não encontrados!");
      return;
    }

    const nodeIn = createNode({ type: NodeType.IN, role: NodeRole.COMPONENT });

    nodeIn.label = connectionNode.alias;

    const nodeOut = createNode({
      type: NodeType.OUT,
      role: NodeRole.COMPONENT,
    });

    // Restaurar os nós de entrada e saída
    // Restaurar as entradas do nó de origem
    sourceNode.outputs = sourceNode.outputs.filter(
      (outputId) => outputId !== connectionNode.id
    );
    sourceNode.outputs.push(nodeOut.id);

    nodeIn.outputs.push(targetNode.id);

    // Restaurar as saídas do nó de destino
    targetNode.inputs = targetNode.inputs.filter(
      (inputId) => inputId !== connectionNode.id
    );
    targetNode.inputs.push(nodeIn.id);

    nodeOut.inputs.push(sourceNode.id);

    nodesStore.addNode(nodeIn);
    nodesStore.addNode(nodeOut);

    // Remover as arestas associadas ao nó de conexão
    edgesStore.removeEdge(sourceNode.id, connectionNode.id);
    edgesStore.removeEdge(connectionNode.id, targetNode.id);

    // Criar arestas novas para os nós de entrada e saída
    edgesStore.addEdge(createEdge(sourceNode.id, nodeOut.id));
    edgesStore.addEdge(createEdge(nodeIn.id, targetNode.id));

    // Remover o nó de conexão da store de nós
    nodesStore.removeNode(connectionNode.id);

    console.log(`Nó de conexão ${connectionNode.id} removido com sucesso`);
  }

  return { connectionNodes, deleteConnection };
}
