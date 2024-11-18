import { reactive } from "vue";
import * as vNG from "v-network-graph";
import {
  ForceLayout,
  type ForceEdgeDatum,
  type ForceNodeDatum,
} from "v-network-graph/lib/force-layout";

export function useNetworkGraph() {
  // Configuração do layout
  const layoutHandler = new ForceLayout({
    createSimulation: (d3, nodes, edges) => {
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

  // Configurações do grafo
  const configs = reactive(
    vNG.defineConfigs({
      node: {
        normal: {
          type: "circle",
          radius: (node) => node.size,
          color: "transparent",
          strokeWidth: 3,
          strokeColor: "black",
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
          color: "black",
        },
      },
      edge: {
        normal: {
          width: (edge) => edge.width,
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

  return { layoutHandler, configs };
}
