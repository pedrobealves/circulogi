<script setup lang="ts">
import { useSimulationStore } from "@/simulation/stores/simulation";
import { NodeType } from "~/simulation/types/nodeType";
import { useNetworkGraph } from "~/simulation/utils/network-graph";
import { useNodeEventHandlers } from "~/simulation/composables/events/event-handlers";
import { NodeRole } from "@/simulation/types/nodeRole";
import ToolbarOptions from "@/simulation/components/ToolbarOptions.vue";
import { useClock } from "~/simulation/composables/events/event-clock";
import { isComponent } from "~/simulation/utils/is-component";
import { useSaveThumbnail } from "@/simulation/composables/events/event-save-thumbnail";
import { useNodeStyle } from "@/simulation/composables/node/node-style";
import Properties from "~/simulation/components/Properties.vue";

const circuitStore = useSimulationStore();
const { uploadThumbnail } = useSaveThumbnail();
const { getFillColor, getStrokeColor, getRadius, showType } = useNodeStyle();

const { configs } = useNetworkGraph();

const { eventHandlers } = useNodeEventHandlers();

const route = useRoute();
const id = route.params.id as string;
try {
  const { data, error } = await useFetch(`/api/v1/circuits/${id}`, {
    headers: useRequestHeaders(["cookie"]),
  });

  if (error.value) {
    throw new Error("Erro ao buscar o circuito");
  }

  if (!data.value) {
    console.error("Dados do circuito não encontrados");
  }
  circuitStore.circuit = data.value;
} catch (error) {
  console.error("Erro ao buscar o circuito:", error);
}

onMounted(() => {
  circuitStore.loadCircuit(circuitStore.circuit?.content);
  useClock().startClock();

  circuitStore.setGraph(graph);

  setTimeout(() => {
    uploadThumbnail();
  }, 3000);
});

const graph = ref<any>();

useSeoMeta({
  title: circuitStore.circuit?.name,
  ogTitle: circuitStore.circuit?.name,
});
</script>

<template>
  <div class="board">
    <v-network-graph
      class="graph"
      ref="graph"
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
    <Tutorial />
    <TopBarContainer />
    <Share />
    <Properties />
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
