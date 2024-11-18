import { NodeType } from "~/simulation/types/nodeType";
import { NodeRole } from "~/simulation/types/nodeRole";
import { useNodeFactory } from "@/simulation/composables/node-factory";
import { useEdgeFactory } from "@/simulation/composables/edge-factory";
import * as vNG from "v-network-graph";
import type { Node } from "~/simulation/types/node";

import { useNodesStore } from "./node";
import { useEdgesStore } from "./edge";

import { useComponentFactory } from "~/simulation/composables/component-factory";

export const useCircuitStore = defineStore("circuit", () => {
  const nodesStore = useNodesStore();
  const edgesStore = useEdgesStore();
  const { createNode } = useNodeFactory();
  const { createEdge } = useEdgeFactory();
  const { createComponent } = useComponentFactory();

  const roleConditions = [NodeRole.INPUT, NodeRole.OUTPUT];
  const typeConditions = [NodeType.IN, NodeType.OUT, NodeType.CONN];

  const selectedNodes = ref<Node>();

  function createComponentAndAdd(type: NodeType) {
    const component = createComponent(type);

    if (component) {
      const { mainNode, nodes, edges } = component;
      nodesStore.addNode(mainNode);
      nodes.forEach((node) => nodesStore.addNode(node));
      edges.forEach((edge) => edgesStore.addEdge(edge));
    }
  }

  function selectNode(nodeId: string) {
    const node = nodesStore.getNode(nodeId);
    selectedNodes.value = node;
  }

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

    //console.log(sourceInputs, targetOutputs);

    if (sourceInputs[0] === targetOutputs[0]) {
      console.log("Conexão inválida!");
      return;
    }

    const connectionNode: Node = createNode(NodeType.CONN, NodeRole.COMPONENT);

    connectionNode.inputs.push(...sourceInputs); // O CONNECTION recebe a
    connectionNode.outputs.push(...targetOutputs);

    nodesStore.addNode(connectionNode);

    console.log(sourceInputs);

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

      console.log(node?.id);

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
  }

  function isComponent(node: Node): boolean {
    return (
      !roleConditions.includes(node.role as NodeRole) &&
      !typeConditions.includes(node.type as NodeType)
    );
  }

  return {
    createComponentAndAdd,
    nodes: nodesStore.nodes,
    getNode: nodesStore.getNode,
    edges: edgesStore.edges,
    addNode: nodesStore.addNode,
    layout: nodesStore.layouts,
    connectionNodes,
    selectNode,
    selectedNodes,
    isComponent,
  };
});
