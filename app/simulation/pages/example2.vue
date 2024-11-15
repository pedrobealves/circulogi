<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import * as vNG from "v-network-graph";
import {
  ForceLayout,
  type ForceEdgeDatum,
  type ForceNodeDatum,
} from "v-network-graph/lib/force-layout";

const nodeCount = ref(14);

let layoutHandler: vNG.LayoutHandler = new ForceLayout({
  createSimulation: (d3, nodes, edges) => {
    // d3-force parameters
    const forceLink = d3
      .forceLink<ForceNodeDatum, ForceEdgeDatum>(edges)
      .id((d: ForceNodeDatum) => d.id);
    return d3
      .forceSimulation(nodes)
      .force("edge", forceLink.distance(120).strength(2))
      .force("collide", d3.forceCollide(50).strength(0.01))
      .tick(100)
      .alpha(0)
      .stop();
  },
});

interface Node extends vNG.Node {
  size: number;
  color: string;
  label?: boolean;
  id?: string;
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

enum types {
  IN = "IN",
  AND = "AND",
  OR = "OR",
  NOT = "NOT",
  OUT = "OUT",
  CONN = "CONN",
}

enum roles {
  INPUT = "INPUT",
  COMPONENT = "COMPONENT",
  OUTPUT = "OUTPUT",
}

const nodes: Record<string, Node> = reactive({
  node0: {
    name: "node0",
    type: "AND",
    role: "COMPONENT",
    inputs: ["node1", "node2"],
    outputs: ["node3"],
    value: -1,
    maxInputs: 2,
    maxOutputs: 1,
    size: 32,
    color: "black",
  },
  node1: {
    name: "node1",
    type: "IN",
    role: "COMPONENT",
    inputs: [],
    outputs: ["node0"],
    maxInputs: 1,
    maxOutputs: 1,
    value: -1,
    size: 12,
    color: "black",
  },
  node2: {
    name: "node2",
    type: "IN",
    role: "COMPONENT",
    inputs: [],
    outputs: ["node0"],
    maxInputs: 1,
    maxOutputs: 1,
    value: -1,
    size: 12,
    color: "black",
  },
  node3: {
    name: "node3",
    type: "OUT",
    role: "COMPONENT",
    inputs: ["node0"],
    outputs: [],
    maxInputs: 1,
    maxOutputs: 1,
    value: -1,
    size: 12,
    color: "black",
  },
  node4: {
    name: "node4",
    type: "AND",
    role: "COMPONENT",
    inputs: ["node5", "node6"],
    outputs: ["node7"],
    value: -1,
    size: 32,
    color: "black",
  },
  node5: {
    name: "node5",
    type: "IN",
    role: "COMPONENT",
    inputs: [],
    outputs: ["node4"],
    value: -1,
    size: 12,
    color: "black",
  },
  node6: {
    name: "node6",
    type: "IN",
    role: "COMPONENT",
    inputs: [],
    outputs: ["node4"],
    value: -1,
    size: 12,
    color: "black",
  },
  node7: {
    name: "node7",
    type: "OUT",
    role: "COMPONENT",
    inputs: ["node4"],
    outputs: [],
    value: -1,
    size: 12,
    color: "black",
  },
  node8: {
    name: "node8",
    type: "OUT",
    role: "COMPONENT",
    inputs: ["node9"],
    outputs: [],
    value: -1,
    size: 12,
    color: "black",
  },
  node9: {
    name: "node9",
    type: "IN",
    role: "INPUT",
    inputs: [],
    outputs: ["node8"],
    value: -1,
    size: 32,
    color: "black",
  },
  node10: {
    name: "node10",
    type: "OUT",
    role: "COMPONENT",
    inputs: ["node11"],
    outputs: [],
    value: -1,
    size: 12,
    color: "black",
  },
  node11: {
    name: "node11",
    type: "IN",
    role: "INPUT",
    inputs: [],
    outputs: ["node10"],
    value: -1,
    size: 32,
    color: "black",
  },
  node12: {
    name: "node12",
    type: "IN",
    role: "COMPONENT",
    inputs: [],
    outputs: ["node13"],
    value: -1,
    size: 12,
    color: "black",
  },
  node13: {
    name: "node13",
    type: "OUT",
    role: "OUTPUT",
    inputs: ["node12"],
    outputs: [],
    value: -1,
    size: 32,
    color: "black",
  },
});

const edges: Record<string, Edge> = reactive({
  edge1: { source: "node1", target: "node0", width: 8, color: "#808080" },
  edge2: { source: "node2", target: "node0", width: 8, color: "#808080" },
  edge3: { source: "node0", target: "node3", width: 8, color: "#808080" },
  edge4: { source: "node5", target: "node4", width: 8, color: "#808080" },
  edge5: { source: "node6", target: "node4", width: 8, color: "#808080" },
  edge6: { source: "node4", target: "node7", width: 8, color: "#808080" },
  edge7: { source: "node9", target: "node8", width: 8, color: "#808080" },
  edge8: { source: "node11", target: "node10", width: 8, color: "#808080" },
  edge9: { source: "node12", target: "node13", width: 8, color: "#808080" },
});

const nextEdgeIndex = ref(Object.keys(edges).length + 1);

const layouts = ref({
  nodes: {
    node0: { type: "AND" },
    node1: { type: "IN" },
    node2: { type: "IN" },
    node3: { type: "OUT" },
    node4: { type: "AND" },
    node5: { type: "IN" },
    node6: { type: "IN" },
    node7: { type: "OUT" },
  },
});

const selectedNodes = ref<Node>();

buildNetwork(nodeCount.value, nodes, edges);

const collisionRadius: number = 50; // Raio de colisão, pode ser ajustado conforme necessário

interface Nodes {
  [key: string]: Node;
}

// Função para calcular a distância entre dois pontos
function calculateDistance(point1: vNG.Position, point2: vNG.Position): number {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Verificar colisão, ignorando um nó específico
function isColliding(
  targetNode: vNG.Position,
  nodesPosition: NodesPosition,
  nodeToIgnore: string
): string {
  //console.log(targetNode)

  for (const nodeId in nodes) {
    if (nodeId === nodeToIgnore) continue;
    if (nodes[nodeId].type !== "IN" && nodes[nodeId].type !== "OUT") continue;

    const distance = calculateDistance(targetNode, nodesPosition[nodeId]);
    if (distance <= collisionRadius) {
      return nodeId; // Colisão detectada
    }
  }
  return "node"; // Nenhuma colisão detectada
}

watch(nodeCount, () => {
  buildNetwork(nodeCount.value, nodes, edges);
});

interface NodePosition {
  x: number;
  y: number;
  type: string;
}

interface NodesPosition {
  [key: string]: NodePosition;
}

// Flag para controlar a execução da detecção de colisão
const isCollisionDetectionInProgress = ref(false);
const currentNode = ref<any>(null); // Variável para armazenar o nó atual
const currentColliding = ref<any>(null); // Variável para armazenar o nó atual

// Função para iniciar a detecção de colisão
function detectCollision(node: Node) {
  if (!node) return; // Verifique se o nó é válido

  const colliding: string = currentColliding.value;

  if (colliding !== "node") {
    console.log("Colisão detectada!");

    const targetNode: Node = nodes[colliding];
    const sourceNode: Node = nodes[Object.keys(node)[0]];

    if (sourceNode.role !== "COMPONENT" || targetNode.role !== "COMPONENT") {
      console.log("Conexão inválida!");
      return;
    }

    if (sourceNode.type === targetNode.type) {
      console.log("Conexão inválida!");
      return;
    }

    // Determina a direção da conexão
    const sourceInputs =
      sourceNode.type === "OUT" ? sourceNode.inputs : targetNode.inputs;
    const targetOutputs =
      sourceNode.type === "OUT" ? targetNode.outputs : sourceNode.outputs;

    if (sourceInputs[0] === targetOutputs[0]) {
      console.log("Conexão inválida!");
      return;
    }

    const connectionNode: Node = {
      name: "node" + nodeCount.value,
      type: "CONN",
      inputs: [],
      outputs: [],
      maxInputs: 1,
      maxOutputs: 1,
      role: "COMPONENT",
      size: 12,
      color: "black",
    };

    nodeCount.value++;

    connectionNode.inputs.push(...sourceInputs); // O CONNECTION recebe a
    connectionNode.outputs.push(...targetOutputs);

    console.log(connectionNode);

    nodes[connectionNode.name] = connectionNode;
    // Conecta os inputs do nó CONNECTION aos nós que eram inputs de sourceNode
    sourceInputs.forEach((inputId) => {
      edges[`edge${nextEdgeIndex.value}`] = {
        source: inputId,
        target: connectionNode.name,
        width: 8,
        color: "#808080",
      };

      nodes[inputId].outputs = nodes[inputId].outputs.filter(
        (input) =>
          input !==
          (sourceNode.type === "OUT" ? sourceNode.name : targetNode.name)
      );

      nodes[inputId].outputs.push(connectionNode.name);

      nextEdgeIndex.value++;
    });

    targetOutputs.forEach((outputId) => {
      edges[`edge${nextEdgeIndex.value}`] = {
        source: connectionNode.name,
        target: outputId,
        width: 8,
        color: "#808080",
      };

      nodes[outputId].inputs = nodes[outputId].inputs.filter(
        (input) =>
          input !==
          (sourceNode.type === "OUT" ? targetNode.name : sourceNode.name)
      );

      nodes[outputId].inputs.push(connectionNode.name);

      nextEdgeIndex.value++;
    });

    // Remove os nós IN e OUT originais
    delete nodes[sourceNode.name];
    delete nodes[targetNode.name];

    Object.keys(edges).forEach((key, index) => {
      edges[key].color = "#808081";
    });

    Object.values(nodes).forEach((node) => (node.color = "black"));

    //console.log(edges);
  }
}

// Watcher para a variável isCollisionDetectionInProgress
watch(
  isCollisionDetectionInProgress,
  (newValue, oldValue) => {
    if ((newValue = !oldValue)) {
      // A flag foi alterada para true, inicie a detecção de colisão
      detectCollision(currentNode.value);
    }
  },
  { immediate: false }
);

function propagateValueFromInput(
  inputNodeId: string,
  nodes: Record<string, Node>
) {
  const queue: string[] = [inputNodeId]; // Usamos uma fila para propagar os valores

  console.log("Propagating value from input node", inputNodeId);

  while (queue.length > 0) {
    const currentNodeId = queue.shift()!;
    const currentNode = nodes[currentNodeId];

    console.log(currentNode);

    if (!currentNode) {
      continue; // Se o nó não existe, continua
    }

    // Coletar valores das entradas, incluindo entradas de outros nós
    const inputValues = currentNode.inputs.map(
      (inputId) => nodes[inputId]?.value
    );

    console.log("Input values", inputValues);

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
      case "OUT":
      case "CONN":
        currentNode.value = inputValues[0];
        break;
      default:
        currentNode.value = -1; // Caso padrão, sem valor
    }

    // Atualizar a cor do nó com base no valor calculado
    if (currentNode.value === 1) {
      currentNode.color = "green"; // Ativo
    } else if (currentNode.value === 0) {
      currentNode.color = "red"; // Inativo
    }

    // Adicionar nós de saída na fila para que possamos atualizar seus valores
    queue.push(...currentNode.outputs); // Propagar para os nós conectados
  }

  updateEdgeColors(nodes, edges);

  // Após atualizar os nós, atualiza as cores das arestas
}

function updateEdgeColors(
  nodes: Record<string, Node>,
  edges: Record<string, Edge>
) {
  Object.values(edges).forEach((edge) => {
    const sourceNode = nodes[edge.source];
    const targetNode = nodes[edge.target];

    // Atualize a cor da aresta com base nos valores dos nós
    if (sourceNode && targetNode) {
      if (sourceNode.value === 1) {
        edge.color = "green"; // Ativo
      } else if (sourceNode.value === 0) {
        edge.color = "red"; // Inativo
      } else {
        edge.color = "#808080"; // Padrão
      }
    }
  });
}

const eventHandlers: vNG.EventHandlers = {
  "node:click": ({ node }) => {
    console.log(`Node ${nodes[node].name} click`);

    if (nodes[node].role === "INPUT") {
      // Aqui você deve implementar a lógica para obter o valor do usuário,
      // por exemplo, através de um prompt ou de um campo de entrada.
      const userValue = nodes[node].value === 1 ? 0 : 1;
      nodes[node].value = userValue;
      nodes[node].color = nodes[node].value === 1 ? "green" : "red"; // Atualiza a cor do nó de entrada
      propagateValueFromInput(nodes[node].outputs[0], nodes); // Propaga o valor para outros nós
    }
  },
  "node:pointerdown": ({ node }) => {
    console.log(`Node ${nodes[node].name} clicked`);
    selectedNodes.value = nodes[node];

    // if (nodes[node].type !== "IN" && nodes[node].type !== "OUT") return;

    // const type = nodes[node].type === "IN" ? "OUT" : "IN";

    // Object.values(nodes)
    //   .filter(
    //     (item) =>
    //       item.type === type &&
    //       item.role === "COMPONENT" &&
    //       (item.outputs[0] != nodes[node].inputs[0] ||
    //         item.inputs[0] != nodes[node].outputs[0])
    //   )
    //   .forEach((node) => (node.color = "blue"));
  },
  "node:pointerup": ({ node }) => {
    console.log(`Node ${nodes[node].name} clicked`);

    //Object.values(nodes).forEach((node) => (node.color = "black"));
  },
  "node:pointermove": (node) => {
    currentNode.value = node;
    const nodeToIgnore: string = Object.keys(node)[0]; // O nó que deve ser ignorado
    if (
      selectedNodes.value?.type !== "IN" &&
      selectedNodes.value?.type !== "OUT"
    )
      return;
    const colliding: string = isColliding(
      node[nodeToIgnore],
      JSON.parse(JSON.stringify(layouts.value)).nodes,
      nodeToIgnore
    );

    if (colliding !== "node") {
      currentColliding.value = colliding;
      isCollisionDetectionInProgress.value = true; // Redefina a flag após a conclusão
    } else {
      isCollisionDetectionInProgress.value = false; // Redefina a flag após a conclusão
    }
  },
};

const configs = reactive(
  vNG.defineConfigs({
    node: {
      normal: {
        type: "circle",
        radius: (node) => node.size, // Use the value of each node object
        color: "transparent",
        strokeWidth: 3,
        strokeColor: "green",
      },
      selectable: true,
      label: {
        visible: (node) => !!node.label,
      },
      hover: {
        radius: (node) => node.size,
        color: "transparent",
      },
      focusring: {
        visible: false,
        color: "green",
      },
    },
    edge: {
      normal: {
        width: (edge) => edge.width, // Use the value of each edge object
        color: (edge) => edge.color,
        dasharray: (edge) => (edge.dashed ? "4" : "0"),
      },
      hover: {
        width: (edge) => edge.width,
        color: (edge) => edge.color,
      },
      type: "straight",
      margin: 0,
      marker: {
        target: {
          type: "arrow",
          width: 2.5,
          height: 2.5,
          margin: -1,
          offset: 0,
          units: "strokeWidth",
          color: null,
        },
      },
    },
    view: {
      layoutHandler,
      scalingObjects: true,
      minZoomLevel: 0.1,
      maxZoomLevel: 16,
    },
  })
);

function buildNetwork(count: number, nodes: vNG.Nodes, edges: vNG.Edges) {}

const zoomLevel = ref(1.5);

const getFillColor = computed(() => (nodeId: any) => {
  const node = nodes[nodeId];

  const color = {
    [types.CONN]: node.color,
    [types.OUT]: node.color,
    [types.IN]: node.role === roles.INPUT ? node.color : "transparent",
  } as const;

  return color[node.type as keyof typeof color] || "transparent";
});

const roleConditions = [roles.INPUT, roles.OUTPUT];

const typeConditions = [types.IN, types.OUT, types.CONN];

function isComponent(node: Node): boolean {
  return (
    !roleConditions.includes(node.role as roles) &&
    !typeConditions.includes(node.type as types)
  );
}

const getStrokeColor = computed(() => (nodeId: any) => {
  const node = nodes[nodeId];

  return isComponent(node) ? "black" : node.color;
});

const getRadius = computed(() => (radius: number, nodeId: any) => {
  const node = nodes[nodeId];

  const value = {
    [types.OUT]: radius,
    [types.IN]: radius - 12,
  } as const;

  return value[node.type as keyof typeof value] || radius - 4;
});

const showType = computed(() => (nodeId: any) => {
  const node = nodes[nodeId];

  return isComponent(node) ? node.type : "";
});
</script>

<template>
  <v-network-graph
    class="graph"
    v-model:layouts="layouts"
    :nodes="nodes"
    :edges="edges"
    :configs="configs"
    :event-handlers="eventHandlers"
  >
    <template #override-node="{ nodeId, scale, config, ...slotProps }">
      <circle
        :r="getRadius(config.radius, nodeId)"
        :fill="getFillColor(nodeId)"
        v-bind="slotProps"
      />
      <!-- Use v-html to interpret escape sequences for icon characters. -->
      <text
        font-family="Inter"
        :font-size="21 * scale"
        fill="#000"
        text-anchor="middle"
        dominant-baseline="central"
        font-weight="600"
        style="pointer-events: none"
      >
        {{ showType(nodeId) }}
      </text>
      <circle
        :r="config.radius * scale"
        fill="none"
        :stroke="getStrokeColor(nodeId)"
        :stroke-width="3"
        v-bind="slotProps"
      />
    </template>
  </v-network-graph>
</template>
<style>
.graph {
  border: 1px solid #000;
  height: 100dvh;
  width: 100dvw;
}

html,
body,
#__nuxt {
  height: 100dvh;
  width: 100dvw;
  margin: 0;
  padding: 0;
  position: fixed;
  overflow: hidden;
}
</style>
