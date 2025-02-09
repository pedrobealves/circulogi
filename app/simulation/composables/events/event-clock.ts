import { useInterval } from "./event-interval";
import { useSimulationStore } from "@/simulation/stores/simulation";
import { useLogicPropagation } from "./event-logic-propagation";
import { NodeType } from "../../types/nodeType";
import { useNodesStore } from "../../stores/node";
import type { Node } from "~/simulation/types/node";
import type { ClockNode } from "../../types/clock";

export function useClock() {
  const simulationStore = useSimulationStore();
  const nodesStore = useNodesStore();

  function toggleClk(nodeId: string) {
    useLogicPropagation().solve(nodeId);
  }

  function startClock() {
    simulationStore.clkNodes = Object.values(nodesStore.nodes)
      .filter((node): node is ClockNode => node.type === NodeType.CLK)
      .map((node) => {
        const intervalInstance = useInterval(
          () => toggleClk(node.id),
          node.configurations.CLOCK_NUMBER || 500
        );
        return { ...node, intervalInstance };
      });

    if (simulationStore.clkNodes.length > 0) {
      console.log("Clocks started");
      simulationStore.clkNodes.forEach((node) => {
        node.intervalInstance?.start();
      });
      simulationStore.actClk = true;
    }
  }

  function stopClock() {
    simulationStore.clkNodes.forEach((node) => {
      node.intervalInstance?.stop();
    });
    simulationStore.actClk = false;
  }

  function addClkNode(node: Node) {
    if (!node.configurations) {
      return;
    }

    const intervalInstance = useInterval(
      () => toggleClk(node.id),
      node.configurations.CLOCK_NUMBER || 500
    );

    const newNode = { ...node, intervalInstance };
    simulationStore.clkNodes.push(newNode);

    if (!simulationStore.actClk) {
      console.log("Clock started");
      newNode.intervalInstance.start();
      simulationStore.actClk = true;
    } else {
      newNode.intervalInstance.start();
    }
  }

  function updateClockInterval(nodeId: string, newInterval: number) {
    const node = simulationStore.clkNodes.find((n) => n.id === nodeId);
    if (node) {
      node.intervalInstance?.stop();

      const intervalInstance = useInterval(
        () => toggleClk(node.id),
        newInterval
      );

      node.configurations.CLOCK_NUMBER = newInterval;
      node.intervalInstance = intervalInstance;

      if (simulationStore.actClk) {
        intervalInstance.start();
      }
    }
  }

  return { startClock, stopClock, addClkNode, updateClockInterval };
}
