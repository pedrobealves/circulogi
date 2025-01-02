import { useInterval } from "./event-interval";
import { useSimulationStore } from "@/simulation/stores/simulation";
import { useLogicPropagation } from "./event-logic-propagation";
import { NodeType } from "../../types/nodeType";
import { useNodesStore } from "../../stores/node";
import type { Node } from "~/simulation/types/node";

export function useClock() {
  const simulationStore = useSimulationStore();
  const nodesStore = useNodesStore();

  const toggleClk = () => {
    simulationStore.clkNodes.forEach((node: { id: string }) => {
      if (node) {
        useLogicPropagation().solve(node.id);
      }
    });
  };

  // Usando o composable
  const { isRunning, start, stop } = useInterval(toggleClk, 5000);

  function startClock() {
    simulationStore.clkNodes = Object.values(nodesStore.nodes).filter(
      (node) => node.type === NodeType.CLK
    );
    if (simulationStore.clkNodes.length > 0) {
      console.log("Clock started");
      start();
      simulationStore.actClk = true;
    }
  }

  function stopClock() {
    stop();
    simulationStore.actClk = false;
  }

  function addClkNode(node: Node) {
    simulationStore.clkNodes.push(node);
    if (!simulationStore.actClk) {
      console.log("Clock started");
      start();
      simulationStore.actClk = true;
    }
  }

  return { startClock, stopClock, addClkNode };
}
