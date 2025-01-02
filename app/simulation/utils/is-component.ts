import { NodeType } from "../types/nodeType";
import { NodeRole } from "../types/nodeRole";
import type { Node } from "~/simulation/types/node";

export const roleConditions = [NodeRole.INPUT, NodeRole.OUTPUT];

export const typeConditions = [
  NodeType.IN,
  NodeType.OUT,
  NodeType.CONN,
  NodeType.CLK,
];

export function isComponent(node: Node): boolean {
  return (
    !roleConditions.includes(node.role as NodeRole) &&
    !typeConditions.includes(node.type as NodeType)
  );
}
