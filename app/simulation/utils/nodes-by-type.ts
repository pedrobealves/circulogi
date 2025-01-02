import { NodeType } from "@/simulation/types/nodeType";
import { NodeRole } from "@/simulation/types/nodeRole";
import { useNodesStore } from "@/simulation/stores/node";
import type { Node } from "~/simulation/types/node";

export function getNodesByType(type: NodeType): Node[] {
  return Object.values(useNodesStore().nodes).filter(
    (node) => node.type === type && node.role === "COMPONENT"
  );
}
