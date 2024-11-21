import type { Node } from "~/simulation/types/node";
import { NodeType } from "~/simulation/types/nodeType";
import { NodeRole } from "~/simulation/types/nodeRole";
import { useCircuitStore } from "@/simulation/stores/circuit";
import { Actions } from "~/simulation/types/actions";

export function useLogicPropagation() {
  const circuitStore = useCircuitStore();

  function solve(inputNodeId: string) {
    if (circuitStore.selectedAction !== Actions.SELECT) return;

    const inputNode = circuitStore.getNode(inputNodeId);

    if (inputNode?.role !== NodeRole.INPUT) {
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

    while (queue.length > 0) {
      const currentNodeId = queue.shift()!;
      const currentNode = nodes[currentNodeId];

      if (!currentNode) continue;

      const inputValues = currentNode.inputs.map(
        (inputId) => nodes[inputId]?.value
      );

      console.log(inputValues);

      if (inputValues.some((value) => value === -1)) {
        break;
      }

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
        case "OUT":
        case "CONN":
          currentNode.value = inputValues[0] ?? -1;
          break;
        default:
          currentNode.value = -1; // Caso padrão, sem valor
      }

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

  function updateEdgeColors() {
    Object.values(circuitStore.edges).forEach((edge) => {
      const sourceNode = circuitStore.nodes[edge.source];
      const targetNode = circuitStore.nodes[edge.target];

      // Atualize a cor da aresta com base nos valores dos nós
      if (sourceNode && targetNode) {
        if (sourceNode.value === 1) {
          edge.color = "#00AA11"; // Ativo
        } else if (sourceNode.value === 0) {
          edge.color = "#FF4D4D"; // Inativo
        } else {
          edge.color = "#9B9B9B"; // Padrão
        }
      }
    });
  }

  return { solve };
}
