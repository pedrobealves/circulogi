<script setup lang="ts">
import { useCircuitStore } from "@/simulation/stores/circuit";
import { NodeType } from "~/simulation/types/nodeType";
import { useNetworkGraph } from "~/simulation/composables/network-graph";
import { useNodeEventHandlers } from "~/simulation/composables/node-event-handlers";
import { NodeRole } from "../../types/nodeRole";
import ToolbarOptions from "../../components/ToolbarOptions.vue";

const circuitStore = useCircuitStore();

const { configs } = useNetworkGraph();

const { eventHandlers } = useNodeEventHandlers();

const getFillColor = computed(() => (nodeId: any) => {
  const node = circuitStore.getNode(nodeId);

  if (!node) return "transparent";

  const color = {
    [NodeType.CONN]: node.color,
    [NodeType.OUT]: node.color,
    [NodeType.IN]: node.role === NodeRole.INPUT ? node.color : "transparent",
  } as const;

  return color[node.type as keyof typeof color] || "transparent";
});

const getStrokeColor = computed(() => (nodeId: any) => {
  const node = circuitStore.getNode(nodeId);

  if (!node) return "black";

  return circuitStore.isComponent(node) ? "black" : node.color;
});

const getRadius = computed(() => (radius: number, nodeId: any) => {
  const node = circuitStore.getNode(nodeId);

  if (!node) return radius;

  const value = {
    [NodeType.OUT]: radius,
    [NodeType.IN]: radius - 12,
  } as const;

  return value[node.type as keyof typeof value] || radius - 4;
});

const showType = computed(() => (nodeId: any) => {
  const node = circuitStore.getNode(nodeId);

  if (!node) return "";

  return circuitStore.isComponent(node) ? node.type : "";
});

const route = useRoute();
const id = route.params.id as string;

onMounted(() => {
  circuitStore.fetchCircuit(id);
});
</script>

<template>
  <div class="board">
    <v-network-graph
      class="graph"
      v-model:layouts="circuitStore.layout"
      :nodes="circuitStore.nodes"
      :edges="circuitStore.edges"
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
    <InteractiveContainer />
    <ToolbarOptions />
  </div>
</template>

<style>
.graph {
  border: 1px solid #000;
  height: 100dvh;
  width: 100dvw;
}

.board {
  background-color: #f3f3f3;
  height: 100dvh;
  width: 100dvw;
  margin: 0;
  padding: 0;
  position: fixed;
  overflow: hidden;
}
</style>
