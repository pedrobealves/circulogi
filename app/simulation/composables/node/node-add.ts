import { useSimulationStore } from "~/simulation/stores/simulation";
import { NodeType } from "~/simulation/types/nodeType";
import { NodeRole } from "~/simulation/types/nodeRole";
import { useComponentDelete } from "@/simulation/composables/component/component-delete";
import { useConnectionNodes } from "@/simulation/composables/node/node-connection";
import { useNodeFactory } from "./node-factory";
import { useComponentFactory } from "@/simulation/composables/component/component-factory";

import { useNodeLabel } from "./node-label";

export function useNodeAdd() {
  const circuitStore = useSimulationStore();
  const nodeFactory = useNodeFactory();
  const { generateNodeLabel, generateLabel } = useNodeLabel();

  function addInputNode(nodeId: string) {
    const node = circuitStore.getNode(nodeId);

    if (!node) return;

    const inputNode = nodeFactory.createNode({
      type: NodeType.IN,
      role: NodeRole.COMPONENT,
    });

    inputNode.label = inputNode.alias = generateLabel();

    const edge = useComponentFactory().connectNodes(inputNode, node);

    circuitStore.addNode(inputNode);
    circuitStore.addEdge(edge);
  }

  function addOutputNode(nodeId: string) {
    const node = circuitStore.getNode(nodeId);

    if (!node) return;

    const outputNode = nodeFactory.createNode({
      type: NodeType.OUT,
      role: NodeRole.COMPONENT,
    });

    const edge = useComponentFactory().connectNodes(node, outputNode);

    circuitStore.addNode(outputNode);
    circuitStore.addEdge(edge);
  }

  return { addInputNode, addOutputNode };
}
