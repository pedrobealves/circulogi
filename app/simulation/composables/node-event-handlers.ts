import * as vNG from "v-network-graph";
import { useNodeCollision } from "./events/node-collision";
import { useNodeSelect } from "./events/node-select";
import { useLogicPropagation } from "./events/logic-propagation";

export function useNodeEventHandlers() {
  const eventHandlers: vNG.EventHandlers = {
    "node:click": ({ node }) => {
      useLogicPropagation().solve(node);
    },
    "node:pointerdown": ({ node }) => {
      useNodeSelect().selectNode(node);
    },
    "node:pointerup": ({ node }) => {
      //console.log(`Node ${node} pointer up`);
    },
    "node:pointermove": (node) => {
      useNodeCollision().handleNodeCollision(node);
    },
  };

  return {
    eventHandlers,
  };
}
