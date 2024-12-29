<script setup lang="ts">
import { useSimulationStore } from "@/simulation/stores/simulation";
import { NodeType } from "~/simulation/types/nodeType";
import { useNetworkGraph } from "~/simulation/composables/network-graph";
import { useNodeEventHandlers } from "~/simulation/composables/node-event-handlers";
import { NodeRole } from "@/simulation/types/nodeRole";
import ToolbarOptions from "@/simulation/components/ToolbarOptions.vue";

const circuitStore = useSimulationStore();

const { configs } = useNetworkGraph();

const { eventHandlers } = useNodeEventHandlers();

const getFillColor = computed(() => (nodeId: any) => {
  const node = circuitStore.getNode(nodeId);

  if (!node) return "transparent";

  const color = {
    [NodeType.CONN]: node.color,
    [NodeType.OUT]: node.color,
    [NodeType.IN]: node.role === NodeRole.INPUT ? node.color : "transparent",
    [NodeType.CLK]: node.color,
  } as const;

  return color[node.type as keyof typeof color] || "transparent";
});

const getStrokeColor = computed(() => (nodeId: any) => {
  const node = circuitStore.getNode(nodeId);

  if (!node) return "black";

  if (node.type === NodeType.NOTE) return "transparent";

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
  if (node.type === NodeType.NOTE) return node.note;

  return circuitStore.isComponent(node) ? node.type : "";
});

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
  circuitStore.startClock();

  circuitStore.setGraph(graph);

  setTimeout(() => {
    uploadCover();
  }, 3000);
});

async function uploadCover() {
  if (!graph.value) return;
  const svgText = await graph.value.exportAsSvgText();

  // Criar um elemento <img> temporário para carregar o SVG
  const svgImage = new Image();
  const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
  const svgUrl = URL.createObjectURL(svgBlob);
  svgImage.src = svgUrl;

  // Quando a imagem estiver carregada, desenhá-la no canvas e exportar como PNG
  svgImage.onload = () => {
    // Criar o canvas e desenhar a imagem
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = svgImage.width;
    canvas.height = svgImage.height;

    if (ctx) {
      ctx.drawImage(svgImage, 0, 0, svgImage.width, svgImage.height);

      canvas.toBlob(async (blob) => {
        if (blob) {
          const formData = new FormData();
          formData.append("file", blob);
          formData.append("name", circuitStore.circuit?.id || "");
          formData.append("path", "circuits");

          try {
            const response = await $fetch("/api/v1/circuits/image", {
              method: "POST",
              body: formData,
            });

            await $fetch(`/api/v1/circuits/${circuitStore.circuit?.id}`, {
              method: "PUT",
              body: {
                thumbnail: response.url,
              },
            });
          } catch (err) {
          } finally {
            URL.revokeObjectURL(svgUrl);
          }
        }
      }, "image/png");
    }
  };
}

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
    <TopBar />
    <Share />
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
