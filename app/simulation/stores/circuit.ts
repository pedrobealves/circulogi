import { NodeType } from "~/simulation/types/nodeType";
import { NodeRole } from "~/simulation/types/nodeRole";
import { useNodeFactory } from "@/simulation/composables/node-factory";
import { useEdgeFactory } from "@/simulation/composables/edge-factory";
import * as vNG from "v-network-graph";
import type { Node } from "~/simulation/types/node";
import { Actions } from "~/simulation/types/actions";
import type { Circuit } from "~/simulation/types/circuit";
import { useNodesStore } from "./node";
import { useEdgesStore } from "./edge";
import { useInterval } from "@/simulation/composables/clock";

import { useComponentFactory } from "~/simulation/composables/component-factory";
import { useLogicPropagation } from "../composables/events/logic-propagation";

export const useCircuitStore = defineStore("circuit", () => {
  const circuit = ref<Circuit>();

  const nodesStore = useNodesStore();
  const edgesStore = useEdgesStore();
  const { createNode } = useNodeFactory();
  const { createEdge } = useEdgeFactory();
  const { createComponent } = useComponentFactory();
  const autoSave = ref(false);

  const selectedAction = ref<Actions>();
  const counter = ref(0);
  const layout = nodesStore.layouts;
  const clkNodes = ref<Node[]>([]);
  const actClk = ref(false);

  function $reset() {
    nodesStore.$reset();
    edgesStore.$reset();
    autoSave.value = false;
    selectedAction.value = undefined;
    circuit.value = undefined;
    counter.value = 0;
    layout.nodes = {};
    clkNodes.value = [];
    actClk.value = false;
  }

  const toggleClk = () => {
    clkNodes.value.forEach((node) => {
      console.log("Toggling CLK node", node.id);
      console.log("CLK node value", node.value);
      //node.value = node.value === 1 ? 0 : 1;
      //node.color = node.value === 1 ? "#00AA11" : "#FF4D4D";
      console.log("CLK node value2", node.value);
      if (node) {
        const outputNodeId = node.outputs[0];
        if (outputNodeId === undefined) {
          console.log("Invalid output node");
          return;
        }
        const outputNode = nodesStore.getNode(outputNodeId);
        if (!outputNode) {
          console.log("Invalid output node");
          return;
        }

        console.log("Output node value", outputNode.value);
        outputNode.value = node.value;
        outputNode.color = outputNode.value === 1 ? "#00AA11" : "#FF4D4D";
      }
    });
  };

  // Usando o composable
  const { isRunning, start, stop } = useInterval(toggleClk, 1000);

  function startClock() {
    actClk.value = true;
    start();
  }

  function stopClock() {
    stop();
  }

  const roleConditions = [NodeRole.INPUT, NodeRole.OUTPUT];
  const typeConditions = [
    NodeType.IN,
    NodeType.OUT,
    NodeType.CONN,
    NodeType.CLK,
  ];

  const graphState = computed(() => ({
    nodes: nodesStore.nodes,
    edges: edgesStore.edges,
  }));

  watch(
    graphState,
    () => {
      if (autoSave.value) save();
    },
    { deep: true }
  );

  async function save() {
    const nodes = Object.values(nodesStore.nodes);
    const edges = Object.values(edgesStore.edges);
    const count = counter.value;
    const layoutCircuit = layout;

    const circuitUpdated = {
      nodes,
      edges,
      count,
      layout: layoutCircuit,
    };

    if (circuit.value) {
      await $fetch(`/api/v1/circuits/${circuit.value.id}`, {
        method: "PUT",
        body: {
          content: JSON.stringify(circuitUpdated),
        },
      });
    }
  }

  async function deleteCircuit(CircuitId: string) {
    if (CircuitId) {
      await $fetch(`/api/v1/circuits/${CircuitId}`, {
        method: "DELETE",
      });
    }
  }

  function addClkNode(node: Node) {
    clkNodes.value.push(node);
    startClock();
  }

  const setSelectedAction = (action: Actions) => {
    selectedAction.value = action;
  };

  const logicTypes: NodeType[] = Object.values(NodeType).filter(
    (value) =>
      value !== NodeType.IN &&
      value !== NodeType.OUT &&
      value !== NodeType.CONN &&
      value !== NodeType.CLK &&
      value !== NodeType.NOTE
  );

  const selectedNodes = ref<Node>();

  const isConnDetection = ref(false);

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
    [NodeType.NOTE]: "",
  };

  function loadCircuit(content: any) {
    if (!content) return;
    const circuitContent = JSON.parse(content);
    nodesStore.setNodes(circuitContent.nodes);
    edgesStore.setEdges(circuitContent.edges);
    layout.nodes = circuitContent.layout.nodes;
    counter.value = circuitContent.count;
    autoSave.value = true;
  }

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
    let index = counter.value;

    while (index >= 0) {
      label = String.fromCharCode((index % 26) + 97) + label; // 97 é o código ASCII de 'a'
      index = Math.floor(index / 26) - 1;
    }

    counter.value++;

    return label;
  }

  function createComponentAndAdd(type: NodeType) {
    const component = createComponent(type);

    if (component) {
      const { mainNode, nodes, edges } = component;
      nodesStore.addNode(mainNode);
      nodes.forEach((node) => nodesStore.addNode(node));
      edges.forEach((edge) => edgesStore.addEdge(edge));
    }
  }

  function createNoteNode(text: string) {
    const component = useNodeFactory().createNode(
      NodeType.NOTE,
      NodeRole.COMPONENT,
      32,
      0,
      0
    );
    component.note = text;
    nodesStore.addNode(component);
    save();
  }

  function selectNode(nodeId: string) {
    const node = nodesStore.getNode(nodeId);
    selectedNodes.value = node;
  }

  function connectionNodes(sourceNode: Node, targetNode: Node) {
    if (sourceNode.role !== "COMPONENT" || targetNode.role !== "COMPONENT") {
      console.log("Conexão inválida!");
      return;
    }

    if (sourceNode.type === targetNode.type) {
      console.log("Conexão inválida!");
      return;
    }

    const sourceInputs =
      sourceNode.type === "OUT" ? sourceNode.inputs : targetNode.inputs;
    const targetOutputs =
      sourceNode.type === "OUT" ? targetNode.outputs : sourceNode.outputs;

    //console.log(sourceInputs, targetOutputs);

    if (sourceInputs[0] === targetOutputs[0]) {
      console.log("Conexão inválida!");
      return;
    }

    const connectionNode: Node = createNode(NodeType.CONN, NodeRole.COMPONENT);

    connectionNode.label =
      targetNode.type === NodeType.IN ? targetNode.label : sourceNode.label;

    connectionNode.inputs.push(...sourceInputs); // O CONNECTION recebe a
    connectionNode.outputs.push(...targetOutputs);

    nodesStore.addNode(connectionNode);

    sourceInputs.forEach((inputId) => {
      edgesStore.addEdge(createEdge(inputId, connectionNode.id));

      const node = nodesStore.getNode(inputId);

      if (node) {
        node.outputs = node.outputs.filter(
          (input) =>
            input !==
            (sourceNode.type === "OUT" ? sourceNode.id : targetNode.id)
        );

        node.outputs.push(connectionNode.id);
      }
    });

    targetOutputs.forEach((outputId) => {
      edgesStore.addEdge(createEdge(connectionNode.id, outputId));

      const node = nodesStore.getNode(outputId);

      console.log(node?.id);

      if (node) {
        node.inputs = node.inputs.filter(
          (input) =>
            input !==
            (sourceNode.type === "OUT" ? targetNode.id : sourceNode.id)
        );

        node.inputs.push(connectionNode.id);
      }
    });

    nodesStore.removeNode(sourceNode.id);
    nodesStore.removeNode(targetNode.id);

    isConnDetection.value = true;
  }

  function deleteConnection(connectionNode: Node) {
    // Certificar-se de que o nó de conexão é realmente do tipo "CONN"
    if (connectionNode.type !== "CONN") {
      console.log("Nó de conexão inválido!");
      return;
    }

    if (!connectionNode.inputs[0] || !connectionNode.outputs[0]) return;

    // Recuperar os nós de entrada e saída relacionados
    const sourceNode = nodesStore.getNode(connectionNode.inputs[0]);
    const targetNode = nodesStore.getNode(connectionNode.outputs[0]);

    if (!sourceNode || !targetNode) {
      console.log("Nós de origem ou destino não encontrados!");
      return;
    }

    const nodeIn = createNode(NodeType.IN, NodeRole.COMPONENT);
    const nodeOut = createNode(NodeType.OUT, NodeRole.COMPONENT);

    // Restaurar os nós de entrada e saída
    // Restaurar as entradas do nó de origem
    sourceNode.outputs = sourceNode.outputs.filter(
      (outputId) => outputId !== connectionNode.id
    );
    sourceNode.outputs.push(nodeOut.id);

    nodeIn.outputs.push(targetNode.id);

    // Restaurar as saídas do nó de destino
    targetNode.inputs = targetNode.inputs.filter(
      (inputId) => inputId !== connectionNode.id
    );
    targetNode.inputs.push(nodeIn.id);

    nodeOut.inputs.push(sourceNode.id);

    nodesStore.addNode(nodeIn);
    nodesStore.addNode(nodeOut);

    // Remover as arestas associadas ao nó de conexão
    edgesStore.removeEdge(sourceNode.id, connectionNode.id);
    edgesStore.removeEdge(connectionNode.id, targetNode.id);

    // Criar arestas novas para os nós de entrada e saída
    edgesStore.addEdge(createEdge(sourceNode.id, nodeOut.id));
    edgesStore.addEdge(createEdge(nodeIn.id, targetNode.id));

    // Remover o nó de conexão da store de nós
    nodesStore.removeNode(connectionNode.id);

    console.log(`Nó de conexão ${connectionNode.id} removido com sucesso`);
  }

  function getNodesByType(type: NodeType): Node[] {
    return Object.values(nodesStore.nodes).filter(
      (node) => node.type === type && node.role === "COMPONENT"
    );
  }

  function isComponent(node: Node): boolean {
    return (
      !roleConditions.includes(node.role as NodeRole) &&
      !typeConditions.includes(node.type as NodeType)
    );
  }

  function deleteComponent(mainNode: Node): void {
    if (!mainNode) {
      console.warn("Nó principal não fornecido!");
      return;
    }

    const nodes = nodesStore.nodes;

    // Verifica se há nós de conexão associados (entradas e saídas)
    // Remover nós de conexão conectados às entradas do nó principal
    mainNode.inputs.forEach((inputId) => {
      const inputNode = nodesStore.getNode(inputId);
      if (inputNode && inputNode.type === "CONN") {
        // Se for um nó de tipo CONN, chama a função para removê-lo
        deleteConnection(inputNode);
      }
    });

    // Remover nós de conexão conectados às saídas do nó principal
    mainNode.outputs.forEach((outputId) => {
      const outputNode = nodesStore.getNode(outputId);
      if (outputNode && outputNode.type === "CONN") {
        // Se for um nó de tipo CONN, chama a função para removê-lo
        deleteConnection(outputNode);
      }
    });

    // Passo 1: Identificar os nós envolvidos no componente
    const inputNodes = mainNode.inputs.map((inputId) => nodes[inputId]);
    const outputNodes = mainNode.outputs.map((outputId) => nodes[outputId]);

    // Passo 2: Remover as arestas que conectam os nós de entrada e saída
    // Remover arestas de entrada
    inputNodes.forEach((inputNode) => {
      if (inputNode) {
        inputNode.outputs = inputNode.outputs.filter(
          (id) => id !== mainNode.id
        );
        // Remover as arestas correspondentes dos edges
        edgesStore.removeEdge(inputNode.id, mainNode.id);
      }
    });

    // Remover arestas de saída
    outputNodes.forEach((outputNode) => {
      if (outputNode) {
        outputNode.inputs = outputNode.inputs.filter(
          (id) => id !== mainNode.id
        );
        edgesStore.removeEdge(mainNode.id, outputNode.id);
      }
    });

    // Passo 3: Remover as referências nos nós de entrada e saída
    mainNode.inputs = [];
    mainNode.outputs = [];

    // Passo 4: Deletar o nó principal, nós de entrada e nós de saída
    // Remover os nós do circuito
    nodesStore.removeNode(mainNode.id);
    inputNodes.forEach((node) => node && nodesStore.removeNode(node.id));
    outputNodes.forEach((node) => node && nodesStore.removeNode(node.id));
  }

  return {
    circuit,
    save,
    createComponentAndAdd,
    nodes: nodesStore.nodes,
    getNode: nodesStore.getNode,
    edges: edgesStore.edges,
    addNode: nodesStore.addNode,
    layout,
    connectionNodes,
    selectNode,
    selectedNodes,
    isComponent,
    getNodesByType,
    isConnDetection,
    logicTypes,
    setSelectedAction,
    selectedAction,
    deleteComponent,
    deleteConnection,
    generateLabel,
    generateNodeLabel,
    createNoteNode,
    addClkNode,
    actClk,
    deleteCircuit,
    loadCircuit,
    $reset,
  };
});
