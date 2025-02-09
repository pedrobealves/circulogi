import type { Node } from "~/simulation/types/node";
import { NodeType } from "~/simulation/types/nodeType";
import { NodeRole } from "~/simulation/types/nodeRole";
import { useSimulationStore } from "@/simulation/stores/simulation";

export function useNodeLabel() {
  const simulationStore = useSimulationStore();

  const operators: Record<NodeType, string> = {
    [NodeType.AND]: "&",
    [NodeType.OR]: "|",
    [NodeType.XOR]: "^",
    [NodeType.NAND]: "&",
    [NodeType.NOR]: "|",
    [NodeType.XNOR]: "^",
    [NodeType.NOT]: "~", // Unário
    [NodeType.IN]: "",
    [NodeType.D]: "",
    [NodeType.JK]: "",
    [NodeType.T]: "",
    [NodeType.SR]: "",
    [NodeType.OUT]: "",
    [NodeType.CONN]: "",
    [NodeType.CLK]: "",
    [NodeType.TEXT]: "",
  };

  function generateNodeLabel(inputs: string[], type: NodeType): string {
    if (inputs.length === 0) {
      return type; // Caso não tenha inputs, retorna o tipo diretamente
    }
    const operator = operators[type] || "?"; // Se o tipo não tiver um operador definido, usa um placeholder

    if (type === NodeType.NOT && inputs.length === 1) {
      return `${operator}(${inputs[0]})`; // Para NOT, aplica o operador antes do único input
    }

    // Combinação para os operadores padrão (AND, OR, XOR)
    const combinedInputs = inputs.join(` ${operator} `);

    // Adiciona inversão para tipos com negação (NAND, NOR, XNOR)
    if ([NodeType.NAND, NodeType.NOR, NodeType.XNOR].includes(type)) {
      return `~(${combinedInputs})`;
    }

    return combinedInputs; // Retorna os inputs combinados para outros tipos
  }

  function generateLabel(): string {
    let label = "";
    let index = simulationStore.counter;

    while (index >= 0) {
      label = String.fromCharCode((index % 26) + 97) + label; // 97 é o código ASCII de 'a'
      index = Math.floor(index / 26) - 1;
    }

    simulationStore.counter++;

    return label;
  }

  return { generateNodeLabel, generateLabel };
}
