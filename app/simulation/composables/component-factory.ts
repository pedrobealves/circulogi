import { nanoid } from "nanoid";
import type { Node } from "~/simulation/types/node";
import type { Edge } from "~/simulation/types/edge";
import { NodeType } from "~/simulation/types/nodeType";
import { NodeRole } from "~/simulation/types/nodeRole";
import { useNodeFactory } from "./node-factory";
import { useEdgeFactory } from "./edge-factory";
import { useSimulationStore } from "~/simulation/stores/simulation";

interface ComponentResult {
  mainNode: Node;
  nodes: Node[];
  edges: Edge[];
}

interface ComponentConfig {
  type: NodeType;
  inputCount?: number;
}

export function useComponentFactory() {
  const nodeFactory = useNodeFactory();
  const { createEdge } = useEdgeFactory();
  const circuitStore = useSimulationStore();

  const componentFactoryMap: Record<NodeType, () => ComponentResult> = {
    [NodeType.AND]: () => createDefaultComponent({ type: NodeType.AND }),
    [NodeType.OR]: () => createDefaultComponent({ type: NodeType.OR }),
    [NodeType.XOR]: () => createDefaultComponent({ type: NodeType.XOR }),
    [NodeType.NAND]: () => createDefaultComponent({ type: NodeType.NAND }),
    [NodeType.NOR]: () => createDefaultComponent({ type: NodeType.NOR }),
    [NodeType.XNOR]: () => createDefaultComponent({ type: NodeType.XNOR }),
    [NodeType.D]: () => createFlipFlopComponent(NodeType.D),
    [NodeType.JK]: () => createFlipFlopComponent(NodeType.JK),
    [NodeType.SR]: () => createFlipFlopComponent(NodeType.SR),
    [NodeType.T]: () => createFlipFlopComponent(NodeType.T),
    [NodeType.NOT]: () => createNotComponent(),
    [NodeType.IN]: () => createInputNode(NodeType.IN),
    [NodeType.CLK]: () => createInputNode(NodeType.CLK),
    [NodeType.OUT]: () => createOutputNode(),
    [NodeType.CONN]: function (): ComponentResult {
      throw new Error("Function not implemented.");
    },
    [NodeType.NOTE]: function (): ComponentResult {
      throw new Error("Function not implemented.");
    },
  };

  function createComponent(type: NodeType): ComponentResult | null {
    const factory = componentFactoryMap[type];
    if (!factory) {
      console.warn(`Unknown component type: ${type}`);
      return null;
    }
    return factory();
  }

  function connectNodes(sourceNode: Node, targetNode: Node): Edge {
    const edge = createEdge(sourceNode.id, targetNode.id);
    sourceNode.outputs.push(targetNode.id);
    targetNode.inputs.push(sourceNode.id);
    return edge;
  }

  function setupNodeConnections(
    mainNode: Node,
    inputNodes: Node[],
    outputNodes: Node[]
  ): Edge[] {
    const edges: Edge[] = [];
    inputNodes.forEach((inputNode) => {
      edges.push(connectNodes(inputNode, mainNode));
    });
    outputNodes.forEach((outputNode) => {
      edges.push(connectNodes(mainNode, outputNode));
    });
    return edges;
  }

  function createDefaultComponent(config: ComponentConfig): ComponentResult {
    const { type, inputCount = 2 } = config;

    const mainNode = nodeFactory.createNode({
      type,
      role: NodeRole.COMPONENT,
      size: 32,
      maxInputs: 2,
      maxOutputs: 1,
    });

    const inputNodes = Array.from({ length: inputCount }, () => {
      const inputNode = nodeFactory.createNode({
        type: NodeType.IN,
        role: NodeRole.COMPONENT,
      });
      inputNode.label = inputNode.alias = circuitStore.generateLabel();
      return inputNode;
    });

    const outputNode = nodeFactory.createNode({
      type: NodeType.OUT,
      role: NodeRole.COMPONENT,
    });

    outputNode.label = circuitStore.generateNodeLabel(
      inputNodes.map((node) => node.label ?? ""),
      type
    );

    const edges = setupNodeConnections(mainNode, inputNodes, [outputNode]);
    return { mainNode, nodes: [...inputNodes, outputNode], edges };
  }

  function createFlipFlopComponent(type: NodeType): ComponentResult {
    const mainNode = nodeFactory.createNode({
      type,
      role: NodeRole.COMPONENT,
      size: 32,
    });

    const inputNodes = createFlipFlopInputs(type);
    const outputNodes = createFlipFlopOutputs();

    mainNode.inputs.push(...inputNodes.map((node) => node.id));
    mainNode.outputs.push(...outputNodes.map((node) => node.id));

    const edges = setupNodeConnections(mainNode, inputNodes, outputNodes);
    return { mainNode, nodes: [...inputNodes, ...outputNodes], edges };
  }

  function createFlipFlopInputs(type: NodeType): Node[] {
    if (type === NodeType.D || type === NodeType.T) {
      return createDTFlipFlopInputs(type);
    }
    return createJKSRFlipFlopInputs(type);
  }

  function createDTFlipFlopInputs(type: NodeType): Node[] {
    const inputDT = nodeFactory.createNode({
      type: NodeType.IN,
      role: NodeRole.COMPONENT,
      alias: type,
    });
    const inputCLK = nodeFactory.createNode({
      type: NodeType.IN,
      role: NodeRole.COMPONENT,
      alias: "CLK",
    });

    inputDT.label = type + "_" + circuitStore.generateLabel();
    inputCLK.label = inputCLK.alias = "CLK";

    return [inputDT, inputCLK];
  }

  function createJKSRFlipFlopInputs(type: NodeType): Node[] {
    const inputCLK = nodeFactory.createNode({
      type: NodeType.IN,
      role: NodeRole.COMPONENT,
      alias: "CLK",
    });
    const input1 = nodeFactory.createNode({
      type: NodeType.IN,
      role: NodeRole.COMPONENT,
      alias: type.charAt(0),
    });
    const input2 = nodeFactory.createNode({
      type: NodeType.IN,
      role: NodeRole.COMPONENT,
      alias: type.charAt(1),
    });

    inputCLK.label = "CLK";
    input1.label = type.charAt(0) + "_" + circuitStore.generateLabel();
    input2.label = type.charAt(1) + "_" + circuitStore.generateLabel();

    return [inputCLK, input1, input2];
  }

  function createFlipFlopOutputs(): Node[] {
    const outputQ = nodeFactory.createNode({
      type: NodeType.OUT,
      role: NodeRole.COMPONENT,
      size: 12,
      maxInputs: 1,
      maxOutputs: 1,
      alias: "Q",
    });

    const outputNotQ = nodeFactory.createNode({
      type: NodeType.OUT,
      role: NodeRole.COMPONENT,
      size: 12,
      maxInputs: 1,
      maxOutputs: 1,
      inverted: true,
      alias: "Q",
    });

    outputQ.label = "Q_" + circuitStore.generateLabel();
    outputNotQ.label = circuitStore.generateNodeLabel(
      [outputQ.label],
      NodeType.NOT
    );

    return [outputQ, outputNotQ];
  }

  function createInputNode(type: NodeType): ComponentResult {
    const mainNode = nodeFactory.createNode({
      type,
      role: NodeRole.INPUT,
      size: 32,
    });

    if (type === NodeType.CLK) {
      circuitStore.addClkNode(mainNode);
    }

    const outNode = nodeFactory.createNode({
      type: NodeType.OUT,
      role: NodeRole.COMPONENT,
    });

    const edges = [connectNodes(mainNode, outNode)];
    return { mainNode, nodes: [outNode], edges };
  }

  function createOutputNode(): ComponentResult {
    const mainNode = nodeFactory.createNode({
      type: NodeType.OUT,
      role: NodeRole.OUTPUT,
      size: 32,
    });

    const inNode = nodeFactory.createNode({
      type: NodeType.IN,
      role: NodeRole.COMPONENT,
    });

    const edges = [connectNodes(inNode, mainNode)];
    return { mainNode, nodes: [inNode], edges };
  }

  function createNotComponent(): ComponentResult {
    const mainNode = nodeFactory.createNode({
      type: NodeType.NOT,
      role: NodeRole.COMPONENT,
      size: 32,
      maxInputs: 1,
      maxOutputs: 1,
    });

    const inNode = nodeFactory.createNode({
      type: NodeType.IN,
      role: NodeRole.COMPONENT,
    });

    const outNode = nodeFactory.createNode({
      type: NodeType.OUT,
      role: NodeRole.COMPONENT,
    });

    inNode.label = circuitStore.generateLabel();
    outNode.label = circuitStore.generateNodeLabel(
      [inNode.label],
      NodeType.NOT
    );

    const edges = setupNodeConnections(mainNode, [inNode], [outNode]);
    return { mainNode, nodes: [inNode, outNode], edges };
  }

  return { createComponent };
}
