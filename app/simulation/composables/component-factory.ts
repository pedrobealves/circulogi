import { nanoid } from "nanoid";
import type { Node } from "~/simulation/types/node";
import type { Edge } from "~/simulation/types/edge";
import { NodeType } from "~/simulation/types/nodeType";
import { NodeRole } from "~/simulation/types/nodeRole";
import { useNodeFactory } from "./node-factory";
import { useEdgeFactory } from "./edge-factory";

export function useComponentFactory() {
  const { createNode } = useNodeFactory();
  const { createEdge } = useEdgeFactory();

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
  function createDefaultComponent(type: NodeType): {
    mainNode: Node;
    nodes: Node[];
    edges: Edge[];
  } {
    const mainNode: Node = createNode(type, NodeRole.COMPONENT, 32, 2, 1);

    const inNode1 = createNode(NodeType.IN, NodeRole.COMPONENT);
    const inNode2 = createNode(NodeType.IN, NodeRole.COMPONENT);
    const outNode = createNode(NodeType.OUT, NodeRole.COMPONENT);

    const edges: Edge[] = [
      createEdge(inNode1.id, mainNode.id),
      createEdge(inNode2.id, mainNode.id),
      createEdge(mainNode.id, outNode.id),
    ];

    mainNode.inputs.push(inNode1.id, inNode2.id);
    mainNode.outputs.push(outNode.id);

    inNode1.outputs.push(mainNode.id);
    inNode2.outputs.push(mainNode.id);
    outNode.inputs.push(mainNode.id);

    return { mainNode, nodes: [inNode1, inNode2, outNode], edges };
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

  // Função para criar o componente NOT (com apenas uma entrada e uma saída)
  // function createNotComponent(): {
  //   mainNode: Node;
  //   nodes: Node[];
  //   edges: Edge[];
  // } {
  //   const componentId = nanoid();
  //   const mainNode: Node = {
  //     id: componentId,
  //     name: "NOT",
  //     type: NodeType.NOT,
  //     inputs: [],
  //     outputs: [],
  //     value: null,
  //     delay: 100,
  //   };

  //   const inNode = createInputNode();
  //   const outNode = createOutputNode();

  //   const edges: Edge[] = [
  //     { id: nanoid(), source: inNode.id, target: mainNode.id },
  //     { id: nanoid(), source: mainNode.id, target: outNode.id },
  //   ];

  //   mainNode.inputs.push(inNode.id);
  //   mainNode.outputs.push(outNode.id);

  //   return { mainNode, nodes: [inNode, outNode], edges };
  // }

  return { createComponent };
}
