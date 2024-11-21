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
      [NodeType.NOT]: () => createNotComponent(),
      [NodeType.IN]: () => createInputNode(),
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

  function createInputNode(): {
    mainNode: Node;
    nodes: Node[];
    edges: Edge[];
  } {
    const mainNode: Node = createNode(NodeType.IN, NodeRole.INPUT, 32);

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
