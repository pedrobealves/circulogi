import { useSimulationStore } from "~/simulation/stores/simulation";
import { useNodeAdd } from "@/simulation/composables/node/node-add";
import { useNodeDelete } from "@/simulation/composables/node/node-delete";
import { useClock } from "@/simulation/composables/events/event-clock";
export interface ComponentHandler {
  handleUpdate: (value: any) => Promise<boolean>;
}

const componentHandlers: Record<string, ComponentHandler> = {
  INPUT_NUMBER: {
    handleUpdate: async (value: any) => {
      const store = useSimulationStore();
      if (store.selectedNodes && store.selectedNodes.configurations) {
        if (store.selectedNodes.configurations.INPUT_NUMBER < value) {
          useNodeAdd().addInputNode(store.selectedNodes.id);
        } else {
          const checkNode = useNodeDelete().deleteInNode(
            store.selectedNodes.id
          );
          if (!checkNode) return false;
        }

        store.selectedNodes.configurations.INPUT_NUMBER = value;
      }
      return true;
    },
  },
  OUTPUT_NUMBER: {
    handleUpdate: async (value: any) => {
      const store = useSimulationStore();
      if (store.selectedNodes && store.selectedNodes.configurations) {
        if (store.selectedNodes.configurations.OUTPUT_NUMBER < value) {
          useNodeAdd().addOutputNode(store.selectedNodes.id);
        } else {
          const checkNode = useNodeDelete().deleteOutNode(
            store.selectedNodes.id
          );
          if (!checkNode) return false;
        }

        store.selectedNodes.configurations.OUTPUT_NUMBER = value;
      }
      return true;
    },
  },
  CLOCK_NUMBER: {
    handleUpdate: async (value: any) => {
      const store = useSimulationStore();

      if (store.selectedNodes) {
        useClock().updateClockInterval(store.selectedNodes.id, value);
        store.selectedNodes.configurations.CLOCK_NUMBER = value;
      }

      return true;
    },
  },
  INPUT_TEXT: {
    handleUpdate: async (value: any) => {
      const store = useSimulationStore();

      if (store.selectedNodes) {
        store.selectedNodes.configurations.INPUT_TEXT = value;
      }

      return true;
    },
  },
};

export const registerComponentHandler = (
  componentType: string,
  handler: ComponentHandler
) => {
  componentHandlers[componentType] = handler;
};

export const getComponentHandler = (
  componentType: string
): ComponentHandler | undefined => {
  return componentHandlers[componentType];
};
