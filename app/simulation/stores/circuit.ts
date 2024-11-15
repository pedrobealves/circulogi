import { nanoid } from "nanoid";
import * as vNG from "v-network-graph";

enum NodeType {
  IN = "IN",
  OUT = "OUT",
  AND = "AND",
  OR = "OR",
  NOT = "NOT",
  CONNECTION = "CONNECTION",
}

enum NodeRole {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
  COMPONENT = "COMPONENT", // Para portas lógicas ou outros elementos
}

interface Node extends vNG.Node {
  size: number;
  color: string;
  label?: boolean;
  id: string;
  name: string;
  type: string; // IN, AND, OR, OUT, etc.
  role: string; // INPUT, OUTPUT, etc.
  inputs: string[]; // IDs dos nós de entrada
  outputs: string[]; // IDs dos nós de saída
  maxInputs?: number; // Número máximo de entradas permitidas (ex.: AND: 2,
  maxOutputs?: number; // Número máximo de saídas permitidas (geralmente 1)
  value?: number | null;
  delay?: number;
}
interface Edge extends vNG.Edge {
  width: number;
  color: string;
  dashed?: boolean;
}

export const useCircuitStore = defineStore("circuit", () => {
  // Estrutura de armazenamento dos nós e arestas
  const nodes = reactive<Record<string, Node>>({});
  const edges = reactive<Record<string, Edge>>({});

  // Função para adicionar um novo nó
  function addNode(node: Node) {
    nodes[node.id] = node;
  }

  // Função para remover um nó e suas arestas associadas
  function removeNode(nodeId: string) {
    // Remover as arestas que têm o nó como origem ou destino
    for (const edgeId in edges) {
      const edge = edges[edgeId];
      if (edge && (edge.source === nodeId || edge.target === nodeId)) {
        delete edges[edgeId];
      }
    }
    // Remover o próprio nó
    delete nodes[nodeId];
  }

  // Função para remover uma aresta específica
  function removeEdge(edgeId: string) {
    delete edges[edgeId];
  }

  // Função para criar um componente básico, como AND
  function createComponent(type: NodeType): Node {
    const id = nanoid();
    return {
      id,
      name: `${type} Component`,
      type,
      role: NodeRole.COMPONENT,
      inputs: [],
      outputs: [],
      value: null,
      delay: 0,
    };
  }

  // Função para criar um nó de entrada
  function createInputNode(): Node {
    const id = nanoid();
    return {
      id,
      name: "Input Node",
      type: NodeType.IN,
      role: NodeRole.INPUT,
      inputs: [],
      outputs: [],
      value: 0,
      delay: 0,
    };
  }

  // Função para criar um nó de saída
  function createOutputNode(): Node {
    const id = nanoid();
    return {
      id,
      name: "Output Node",
      type: NodeType.OUT,
      role: NodeRole.OUTPUT,
      inputs: [],
      outputs: [],
      value: null,
      delay: 0,
    };
  }

  // Função para adicionar uma nova aresta (conexão)
  function addEdge(edge: Edge) {
    edges[edge.id] = edge;
  }

  // Função para conectar nós, removendo os nós de entrada/saída e criando um de conexão
  function connectNodes(sourceId: string, targetId: string) {
    const sourceNode = nodes[sourceId];
    const targetNode = nodes[targetId];

    if (!sourceNode || !targetNode) return;

    const connectionNode: Node = {
      id: nanoid(),
      name: "Connection Node",
      type: NodeType.CONNECTION,
      role: NodeRole.COMPONENT,
      inputs: [sourceNode.id],
      outputs: [targetNode.id],
      value: null,
      delay: 0,
    };

    // Adicionar nó de conexão ao circuito
    addNode(connectionNode);

    // Conectar arestas entre source → connection e connection → target
    addEdge({
      id: nanoid(),
      source: sourceNode.id,
      target: connectionNode.id,
      color: "gray",
      width: 8,
    });

    addEdge({
      id: nanoid(),
      source: connectionNode.id,
      target: targetNode.id,
      color: "gray",
      width: 8,
    });

    // Atualizar as listas de outputs e inputs dos nós source e target
    sourceNode.outputs.push(connectionNode.id);
    targetNode.inputs.push(connectionNode.id);
  }

  return {
    nodes,
    edges,
    addNode,
    addEdge,
    createComponent,
    createInputNode,
    createOutputNode,
    connectNodes,
  };
});
