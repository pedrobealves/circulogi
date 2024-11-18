import { nanoid } from "nanoid";
import type { Node } from "~/simulation/types/node";
import { NodeType } from "~/simulation/types/nodeType";
import { NodeRole } from "~/simulation/types/nodeRole";

export function useNodeFactory() {
  function createNode(
    type: NodeType,
    role: NodeRole,
    size: number = 12,
    maxInputs: number = 1,
    maxOutputs: number = 1
  ): Node {
    const id = nanoid();
    return {
      id,
      name: `${type}_${id}`,
      type,
      role,
      inputs: [],
      outputs: [],
      delay: 0,
      maxInputs,
      maxOutputs,
      value: -1,
      size,
      color: "black",
    };
  }

  return { createNode };
}
