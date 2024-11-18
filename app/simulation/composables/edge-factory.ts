import { nanoid } from "nanoid";
import type { Edge } from "~/simulation/types/edge";

export function useEdgeFactory() {
  function createEdge(
    sourceId: string,
    targetId: string,
    width: number = 8,
    color: string = "#808080"
  ): Edge {
    return {
      id: nanoid(),
      source: sourceId,
      target: targetId,
      width,
      color,
    };
  }

  return { createEdge };
}
