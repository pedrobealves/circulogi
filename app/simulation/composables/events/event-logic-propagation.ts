import type { Node } from "~/simulation/types/node";
import { NodeType } from "~/simulation/types/nodeType";
import { NodeRole } from "~/simulation/types/nodeRole";
import { useSimulationStore } from "@/simulation/stores/simulation";
import { Actions } from "~/simulation/types/actions";
import type { Edge } from "v-network-graph";

// Types and interfaces
interface NodeOperation {
  (inputValues: number[]): number;
}

// Constants
const NODE_COLORS = {
  ACTIVE: "#00AA11",
  INACTIVE: "#FF4D4D",
  DEFAULT: "#9B9B9B",
} as const;

export function useLogicPropagation() {
  const circuitStore = useSimulationStore();

  // Node operations map
  const nodeOperations: Record<string, NodeOperation> = {
    AND: (values) => Number(values.every((value) => value === 1)),
    OR: (values) => Number(values.some((value) => value === 1)),
    NOT: (values) => Number(values[0] !== 1),
    XOR: (values) =>
      values
        .filter((v): v is number => v !== undefined)
        .reduce((acc, value) => acc ^ value, 0),
    NAND: (values) => Number(!values.every((value) => value === 1)),
    NOR: (values) => Number(!values.some((value) => value === 1)),
    XNOR: (values) =>
      Number(
        values
          .filter((v): v is number => v !== undefined)
          .reduce((acc, value) => acc ^ value, 0) === 0
      ),
    OUT: (values) => values[0] ?? -1,
    CONN: (values) => values[0] ?? -1,
  };

  // Helper functions
  const updateNodeValue = (node: Node, value: number) => {
    node.value = node.inverted ? Number(!value) : value;
    node.color = getColorForValue(node.value);
  };

  const getColorForValue = (value: number): string => {
    if (value === 1) return NODE_COLORS.ACTIVE;
    if (value === 0) return NODE_COLORS.INACTIVE;
    return NODE_COLORS.DEFAULT;
  };

  const processSequentialLogic = (
    currentNode: Node,
    inputNode: Node,
    nodes: Record<string, Node>
  ) => {
    const isClockTrigger = (node: Node) =>
      inputNode.outputs[0] &&
      nodes[inputNode.outputs[0]]?.label === NodeType.CLK &&
      inputNode.value === 1;

    switch (currentNode.type) {
      case "D":
        if (isClockTrigger(currentNode)) {
          const inputValue = getValueByLabel(
            currentNode.inputs,
            nodes,
            NodeType.CLK,
            false
          );
          currentNode.value = Number(
            getValueByLabel(currentNode.inputs, nodes, NodeType.CLK, true)
              ? inputValue
              : !inputValue
          );
        }
        break;

      case "T":
        if (isClockTrigger(currentNode)) {
          currentNode.value = Number(!currentNode.value);
        }
        break;

      case "SR":
        if (isClockTrigger(currentNode)) {
          const sValue = searchValueByAlias(currentNode.inputs, nodes, "S");
          const rValue = searchValueByAlias(currentNode.inputs, nodes, "R");

          if (sValue && !rValue) currentNode.value = 1;
          else if (!sValue && rValue) currentNode.value = 0;
          else if (sValue && rValue) console.log("Invalid SR state");
        }
        break;

      case "JK":
        if (isClockTrigger(currentNode)) {
          const jValue = searchValueByAlias(currentNode.inputs, nodes, "J");
          const kValue = searchValueByAlias(currentNode.inputs, nodes, "K");

          if (jValue && !kValue) currentNode.value = 1;
          else if (!jValue && kValue) currentNode.value = 0;
          else if (jValue && kValue)
            currentNode.value = Number(!currentNode.value);
        }
        break;
    }
  };

  const propagateLogic = (
    startNodeId: string,
    inputNode: Node,
    nodes: Record<string, Node>
  ) => {
    const queue: string[] = [startNodeId];
    const processedNodes: string[] = [];

    console.log("Processing node", queue);

    while (queue.length > 0) {
      const currentNodeId = queue.shift()!;
      const currentNode = nodes[currentNodeId];

      if (!currentNode || processedNodes.includes(currentNodeId)) continue;
      processedNodes.push(currentNodeId);

      const inputValues = currentNode.inputs.map((inputId) => {
        const value = nodes[inputId]?.value;
        const toValue = value === -1 ? 0 : value;

        if (nodes[inputId] && toValue !== undefined) {
          nodes[inputId].value = toValue;
        }

        return toValue;
      });

      if (nodeOperations[currentNode.type]) {
        const operation = nodeOperations[currentNode.type];
        if (operation) {
          currentNode.value = operation(
            inputValues.filter(
              (v): v is number => v !== null && v !== undefined
            )
          );
        }
      } else {
        processSequentialLogic(currentNode, inputNode, nodes);
      }

      if (currentNode.value !== null) {
        updateNodeValue(currentNode, currentNode.value);
      }

      queue.push(...currentNode.outputs);
    }
  };

  function solve(inputNodeId: string) {
    if (circuitStore.selectedAction !== Actions.SELECT) return;

    const inputNode = circuitStore.getNode(inputNodeId);
    if (
      !inputNode ||
      (inputNode.role !== NodeRole.INPUT && inputNode.type !== NodeType.CLK)
    ) {
      console.log("Invalid input node");
      return;
    }

    // Toggle input node value and update its color
    if (inputNode.type !== NodeType.CLK) {
      const userValue = Number(!inputNode.value);
      updateNodeValue(inputNode, userValue);
    }

    // Propagar para TODOS os outputs, não apenas o primeiro
    inputNode.outputs.forEach((outputNodeId) => {
      if (outputNodeId && circuitStore.nodes[outputNodeId]) {
        propagateLogic(
          circuitStore.nodes[outputNodeId].id,
          inputNode,
          circuitStore.nodes
        );
      }
    });

    updateEdgeColors();
  }

  function getValueByLabel(
    inputs: string[],
    nodes: Record<string, Node>,
    matchType: string,
    isMatch: boolean = true
  ): number {
    const targetNode = inputs.find((inputId) =>
      isMatch
        ? nodes[inputId]?.label === matchType
        : nodes[inputId]?.label !== matchType
    );
    return targetNode ? nodes[targetNode]?.value ?? -1 : -1;
  }

  function searchValueByAlias(
    inputs: string[],
    nodes: Record<string, Node>,
    matchType: string
  ): number {
    const targetNode = inputs.find(
      (inputId) => nodes[inputId]?.alias === matchType
    );
    return targetNode ? nodes[targetNode]?.value ?? -1 : -1;
  }

  function updateEdgeColors() {
    console.log("Updating edge colors");
    Object.values(circuitStore.edges).forEach((edge) => {
      const sourceNode = circuitStore.nodes[edge.source];
      const targetNode = circuitStore.nodes[edge.target];

      if (!sourceNode || !targetNode) return;

      let value = sourceNode.value;
      if (targetNode.inverted) value = targetNode.value;

      edge.color = getColorForValue(value ?? 0);
    });
  }

  return { solve };
}
