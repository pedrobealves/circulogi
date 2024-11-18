import * as vNG from "v-network-graph";
import { useNodeCollision } from "./events/node-collision";
import { useNodeSelect } from "./events/node-select";
import { useLogicPropagation } from "./events/logic-propagation";

export function useNodeEventHandlers() {
  const { selectNode, nodesConnDeHighlight, nodesConnHighlight } =
    useNodeSelect();

  const eventHandlers: vNG.EventHandlers = {
    "node:click": ({ node }) => {
      useLogicPropagation().solve(node);
    },
    "node:pointerdown": ({ node }) => {
      selectNode(node);
      nodesConnHighlight(node);
    },
    "node:pointerup": ({ node }) => {
      nodesConnDeHighlight();
    },
    "node:pointermove": (node) => {
      useNodeCollision().handleNodeCollision(node);
    },
  };

  return {
    eventHandlers,
  };
}
