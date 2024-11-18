import * as vNG from "v-network-graph";
import { useNodeCollision } from "./events/node-collision";
import { useNodeSelect } from "./events/node-select";
export function useNodeEventHandlers() {
  const eventHandlers: vNG.EventHandlers = {
    "node:click": ({ node }) => {
      //console.log(`Node ${node} click`);
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
