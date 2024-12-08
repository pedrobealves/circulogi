import { nanoid } from "nanoid";
import type { Node } from "~/simulation/types/node";
import type { Edge } from "~/simulation/types/edge";
import { NodeType } from "~/simulation/types/nodeType";
import { NodeRole } from "~/simulation/types/nodeRole";
import { useNodeFactory } from "./node-factory";
import { useEdgeFactory } from "./edge-factory";
import { useCircuitStore } from "~/simulation/stores/circuit";

export function useComponentFactory() {
  const { createNode } = useNodeFactory();
  const { createEdge } = useEdgeFactory();
  const circuitStore = useCircuitStore();

  function createComponent(
    type: NodeType
  ): { mainNode: Node; nodes: Node[]; edges: Edge[] } | null {
    const componentFactory: {
      [key in NodeType]?: () => {
        mainNode: Node;
        nodes: Node[];
        edges: Edge[];
      };
    } = {
      [NodeType.AND]: () => createDefaultComponent(NodeType.AND),
      [NodeType.OR]: () => createDefaultComponent(NodeType.OR),
      [NodeType.XOR]: () => createDefaultComponent(NodeType.XOR),
      [NodeType.NAND]: () => createDefaultComponent(NodeType.NAND),
      [NodeType.NOR]: () => createDefaultComponent(NodeType.NOR),
      [NodeType.XNOR]: () => createDefaultComponent(NodeType.XNOR),
      [NodeType.D]: () => createFlipFlopComponent(NodeType.D),
      [NodeType.JK]: () => createFlipFlopComponent(NodeType.JK),
      [NodeType.SR]: () => createFlipFlopComponent(NodeType.SR),
      [NodeType.T]: () => createFlipFlopComponent(NodeType.T),
      [NodeType.NOT]: () => createNotComponent(),
      [NodeType.IN]: () => createInputNode(NodeType.IN),
      [NodeType.CLK]: () => createInputNode(NodeType.CLK),
      [NodeType.OUT]: () => createOutputNode(),
    };

    const createComponentFunc = componentFactory[type];
    if (!createComponentFunc) {
      console.warn(`Tipo de componente desconhecido: ${type}`);
      return null;
    }
    return createComponentFunc();
  }
  // Função que cria um componente lógico padrão (AND, OR, etc.)
  function createDefaultComponent(
    type: NodeType,
    inputCount: number = 2
  ): {
    mainNode: Node;
    nodes: Node[];
    edges: Edge[];
  } {
    const mainNode = createNode(type, NodeRole.COMPONENT, 32, 2, 1); // O nó principal

    const inputNodes: Node[] = [];
    for (let i = 0; i < inputCount; i++) {
      const inputNode = createNode(NodeType.IN, NodeRole.COMPONENT);
      inputNode.label = circuitStore.generateLabel();
      inputNodes.push(inputNode);
    }
    const outputNode = createNode(NodeType.OUT, NodeRole.COMPONENT); // O nó de saída

    outputNode.label = circuitStore.generateNodeLabel(
      [inputNodes[0]?.label ?? "", inputNodes[1]?.label ?? ""],
      type
    );

    // Criar as arestas para os nós de entrada e saída
    const edges: Edge[] = inputNodes.map((inputNode) =>
      createEdge(inputNode.id, mainNode.id)
    );
    edges.push(createEdge(mainNode.id, outputNode.id));

    // Adicionar as referências de entrada e saída aos nós
    mainNode.inputs.push(...inputNodes.map((node) => node.id));
    mainNode.outputs.push(outputNode.id);

    inputNodes.forEach((inputNode) => inputNode.outputs.push(mainNode.id));
    outputNode.inputs.push(mainNode.id);

    return { mainNode, nodes: [...inputNodes, outputNode], edges };
  }

  function createFlipFlopComponent(type: NodeType): {
    mainNode: Node;
    nodes: Node[];
    edges: Edge[];
  } {
    const inputNodes: Node[] = [];
    const outputNodes: Node[] = [];

    // Cria o nó principal do Flip-Flop
    const mainNode = createNode(type, NodeRole.COMPONENT, 32);

    // Configuração específica para o Flip-Flop tipo D
    if (type === NodeType.D || type === NodeType.T) {
      const inputD = createNode(NodeType.IN, NodeRole.COMPONENT);
      const inputCLK = createNode(NodeType.IN, NodeRole.COMPONENT);

      inputD.label = circuitStore.generateLabel();
      inputCLK.label = "CLK";

      inputNodes.push(inputD, inputCLK);
    } else {
      const inputCLK = createNode(NodeType.IN, NodeRole.COMPONENT);
      const input1 = createNode(NodeType.IN, NodeRole.COMPONENT);
      const input2 = createNode(NodeType.IN, NodeRole.COMPONENT);

      inputCLK.label = "CLK";
      input1.label = type.charAt(0) + "_" + circuitStore.generateLabel();
      input2.label = type.charAt(1) + "_" + circuitStore.generateLabel();

      inputNodes.push(inputCLK, input1, input2);
    }

    // Cria os nós de saída
    const outputQ = createNode(NodeType.OUT, NodeRole.COMPONENT, 12, 1, 1);
    const outputNotQ = createNode(
      NodeType.OUT,
      NodeRole.COMPONENT,
      12,
      1,
      1,
      true
    );

    outputQ.label = "Q_" + circuitStore.generateLabel();
    outputNotQ.label = circuitStore.generateNodeLabel(
      [outputQ.label],
      NodeType.NOT
    );

    outputNodes.push(outputQ, outputNotQ);

    // Atualiza as entradas e saídas do nó principal
    mainNode.inputs.push(...inputNodes.map((node) => node.id));
    mainNode.outputs.push(...outputNodes.map((node) => node.id));

    // Conecta entradas ao nó principal
    const edges: Edge[] = inputNodes.map((inputNode) =>
      createEdge(inputNode.id, mainNode.id)
    );

    // Conecta o nó principal às saídas
    edges.push(
      ...outputNodes.map((outputNode) => createEdge(mainNode.id, outputNode.id))
    );

    // Atualiza as conexões nos nós de entrada e saída
    inputNodes.forEach((inputNode) => inputNode.outputs.push(mainNode.id));
    outputNodes.forEach((outputNode) => outputNode.inputs.push(mainNode.id));

    return { mainNode, nodes: [...inputNodes, ...outputNodes], edges };
  }

  function createInputNode(type: NodeType): {
    mainNode: Node;
    nodes: Node[];
    edges: Edge[];
  } {
    const mainNode: Node = createNode(type, NodeRole.INPUT, 32);

    const outNode = createNode(NodeType.OUT, NodeRole.COMPONENT);

    mainNode.outputs.push(outNode.id);
    outNode.inputs.push(mainNode.id);

    const edges: Edge[] = [createEdge(mainNode.id, outNode.id)];

    return { mainNode, nodes: [outNode], edges };
  }

  function createOutputNode(): {
    mainNode: Node;
    nodes: Node[];
    edges: Edge[];
  } {
    const mainNode: Node = createNode(NodeType.OUT, NodeRole.OUTPUT, 32);

    const outNode = createNode(NodeType.IN, NodeRole.COMPONENT);

    mainNode.inputs.push(outNode.id);
    outNode.outputs.push(mainNode.id);

    const edges: Edge[] = [createEdge(outNode.id, mainNode.id)];

    return { mainNode, nodes: [outNode], edges };
  }

  //Função para criar o componente NOT (com apenas uma entrada e uma saída)
  function createNotComponent(): {
    mainNode: Node;
    nodes: Node[];
    edges: Edge[];
  } {
    const mainNode: Node = createNode(
      NodeType.NOT,
      NodeRole.COMPONENT,
      32,
      1,
      1
    );

    const inNode = createNode(NodeType.IN, NodeRole.COMPONENT);
    const outNode = createNode(NodeType.OUT, NodeRole.COMPONENT);

    inNode.label = circuitStore.generateLabel();
    outNode.label = circuitStore.generateNodeLabel(
      [inNode.label],
      NodeType.NOT
    );

    const edges: Edge[] = [
      createEdge(inNode.id, mainNode.id),
      createEdge(mainNode.id, outNode.id),
    ];

    inNode.outputs.push(mainNode.id);
    outNode.inputs.push(mainNode.id);

    mainNode.inputs.push(inNode.id);
    mainNode.outputs.push(outNode.id);

    return { mainNode, nodes: [inNode, outNode], edges };
  }

  return { createComponent };
}
