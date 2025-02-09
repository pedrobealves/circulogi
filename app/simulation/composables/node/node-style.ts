import { NodeType } from "~/simulation/types/nodeType";
import { useSimulationStore } from "@/simulation/stores/simulation";
import { NodeRole } from "@/simulation/types/nodeRole";

export function useNodeStyle() {
  const circuitStore = useSimulationStore();

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

    if (node.type === NodeType.TEXT) return "transparent";

    return isComponent(node) ? "black" : node.color;
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
    if (node.type === NodeType.TEXT) return node.configurations?.INPUT_TEXT;

    return isComponent(node) ? node.type : "";
  });

  return { getFillColor, getStrokeColor, getRadius, showType };
}
