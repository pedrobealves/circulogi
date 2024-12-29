import type { Node } from "~/simulation/types/node";
import { NodeType } from "~/simulation/types/nodeType";
import { NodeRole } from "~/simulation/types/nodeRole";
import { useSimulationStore } from "@/simulation/stores/simulation";
import { Actions } from "~/simulation/types/actions";
import type { Edge } from "v-network-graph";

export function useLogicPropagation() {
  const circuitStore = useSimulationStore();

  function solve(inputNodeId: string) {
    if (circuitStore.selectedAction !== Actions.SELECT) return;

    const inputNode = circuitStore.getNode(inputNodeId);

    if (
      inputNode?.role !== NodeRole.INPUT &&
      inputNode?.type !== NodeType.CLK
    ) {
      console.log("Invalid input node");
      return;
    }

    const userValue = inputNode.value === 1 ? 0 : 1;
    inputNode.value = userValue;
    inputNode.color = inputNode.value === 1 ? "#00AA11" : "#FF4D4D";

    const outputNodeId = inputNode.outputs[0];

    if (outputNodeId === undefined) {
      console.log("Invalid output node");
      return;
    }

    const outputNode = circuitStore.nodes[outputNodeId];

    if (!outputNode) {
      console.log("Invalid output node");
      return;
    }

    const queue: string[] = [outputNode.id];
    const nodes = circuitStore.nodes;

    const nodesIds: string[] = [];

    while (queue.length > 0) {
      const currentNodeId = queue.shift()!;
      const currentNode = nodes[currentNodeId];

      if (!currentNode) continue;

      if (nodesIds.includes(currentNodeId)) {
        console.log("Loop detected");
        break;
      }

      nodesIds.push(currentNodeId);

      const inputValues = currentNode.inputs.map((inputId) => {
        const value = nodes[inputId]?.value;

        const toValue = value === -1 ? 0 : value;

        if (nodes[inputId]) {
          if (toValue !== undefined) {
            nodes[inputId].value = toValue;
          }
        }

        return toValue;
      });

      // if (inputValues.some((value) => value === -1)) {
      //   break;
      // }

      // Calcular novo valor baseado no tipo de nó
      switch (currentNode.type) {
        case "AND":
          currentNode.value = inputValues.every((value) => value === 1) ? 1 : 0;
          break;
        case "OR":
          currentNode.value = inputValues.some((value) => value === 1) ? 1 : 0;
          break;
        case "NOT":
          currentNode.value = inputValues[0] === 1 ? 0 : 1;
          break;
        case "XOR":
          currentNode.value = inputValues
            .filter((value): value is number => value !== undefined)
            .reduce((acc, value) => acc ^ value, 0);
          break;
        case "NAND":
          currentNode.value = inputValues.every((value) => value === 1) ? 0 : 1;
          break;
        case "NOR":
          currentNode.value = inputValues.some((value) => value === 1) ? 0 : 1;
          break;
        case "XNOR":
          currentNode.value =
            inputValues
              .filter((value): value is number => value !== undefined)
              .reduce((acc, value) => acc ^ value, 0) === 0
              ? 1
              : 0;
          break;
        case "D":
          const inputValue = getValueByLabel(
            currentNode.inputs,
            nodes,
            NodeType.CLK,
            false
          );
          if (inputNode.outputs[0]) {
            const nodeInput = nodes[inputNode.outputs[0]];
            if (nodeInput?.label === NodeType.CLK && inputNode.value === 1) {
              currentNode.value = +(getValueByLabel(
                currentNode.inputs,
                nodes,
                NodeType.CLK,
                true
              )
                ? inputValue
                : !inputValue);
            }
          }
          break;
        case "T":
          if (inputNode.outputs[0]) {
            const nodeInput = nodes[inputNode.outputs[0]];
            if (nodeInput?.label === NodeType.CLK && inputNode.value === 1) {
              currentNode.value = +!currentNode.value;
            }
          }
          break;
        case "SR":
          const sValue = searchValueByLabel(
            currentNode.inputs,
            nodes,
            "S",
            true
          ); // Valor do Set
          const rValue = searchValueByLabel(
            currentNode.inputs,
            nodes,
            "R",
            true
          ); // Valor do Reset

          if (inputNode.outputs[0]) {
            const nodeInput = nodes[inputNode.outputs[0]];
            if (nodeInput?.label === NodeType.CLK && inputNode.value === 1) {
              if (sValue && !rValue) {
                currentNode.value = 1; // Set
              } else if (!sValue && rValue) {
                currentNode.value = 0; // Reset
              } else if (sValue && rValue) {
                console.log("Invalid SR state");
              }
              // Se S e R forem ambos 0, mantém o estado anterior
            }
          }
          break;

        case "JK":
          const jValue = searchValueByLabel(
            currentNode.inputs,
            nodes,
            "J",
            true
          ); // Valor de J
          const kValue = searchValueByLabel(
            currentNode.inputs,
            nodes,
            "K",
            true
          ); // Valor de K

          if (inputNode.outputs[0]) {
            const nodeInput = nodes[inputNode.outputs[0]];
            if (nodeInput?.label === NodeType.CLK && inputNode.value === 1) {
              if (!jValue && !kValue) {
                // Mantém o estado
              } else if (jValue && !kValue) {
                currentNode.value = 1; // Set
              } else if (!jValue && kValue) {
                currentNode.value = 0; // Reset
              } else if (jValue && kValue) {
                currentNode.value = +!currentNode.value; // Toggle
              }
            }
          }
          break;
        case "OUT":
        case "CONN":
          currentNode.value = inputValues[0] ?? -1;
          break;
        default:
          currentNode.value = -1; // Caso padrão, sem valor
      }

      if (currentNode.inverted)
        currentNode.value = currentNode.value === 1 ? 0 : 1;

      // Atualizar a cor do nó com base no valor calculado
      if (currentNode.value === 1) {
        currentNode.color = "#00AA11"; // Ativo
      } else if (currentNode.value === 0) {
        currentNode.color = "#FF4D4D"; // Inativo
      }

      queue.push(...currentNode.outputs);
    }

    updateEdgeColors();
  }

  function getValueByType(
    inputs: string[],
    nodes: Record<string, Node>,
    matchType: NodeType | null,
    isMatch: boolean = true
  ): number {
    const targetNode = inputs.find((inputId) =>
      isMatch
        ? nodes[inputId]?.type === matchType
        : nodes[inputId]?.type !== matchType
    );
    return targetNode ? nodes[targetNode]?.value ?? -1 : -1;
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

  function searchValueByLabel(
    inputs: string[],
    nodes: Record<string, Node>,
    matchType: string,
    isMatch: boolean = true
  ): number {
    const targetNode = inputs.find((inputId) =>
      isMatch
        ? nodes[inputId]?.label?.charAt(0) === matchType
        : nodes[inputId]?.label?.charAt(0) !== matchType
    );
    return targetNode ? nodes[targetNode]?.value ?? -1 : -1;
  }

  function updateEdgeColors() {
    Object.values(circuitStore.edges).forEach((edge) => {
      const sourceNode = circuitStore.nodes[edge.source];
      const targetNode = circuitStore.nodes[edge.target];

      let value: number = sourceNode?.value ?? -1;

      if (targetNode?.inverted) value = value === 1 ? 0 : 1;

      // Atualize a cor da aresta com base nos valores dos nós
      if (sourceNode && targetNode) {
        if (value === 1) {
          edge.color = "#00AA11"; // Ativo
        } else if (value === 0) {
          edge.color = "#FF4D4D"; // Inativo
        } else {
          edge.color = "#9B9B9B"; // Padrão
        }
      }
    });
  }

  return { solve };
}
