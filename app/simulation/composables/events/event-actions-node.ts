import { useSimulationStore } from "~/simulation/stores/simulation";
import { Actions } from "~/simulation/types/actions";
import { NodeType } from "~/simulation/types/nodeType";
import { useNodeDelete } from "~/simulation/composables/node/node-delete";

export function useActionsNode() {
  const circuitStore = useSimulationStore();
  const { deleteNode } = useNodeDelete();

  function executeAction(nodeId: string) {
    const option: Actions = circuitStore.selectedAction ?? Actions.SELECT;

    if (option === Actions.SELECT) return;

    // Objeto de mapeamento de ações com a execução direta da função
    const actions: { [key in Actions]?: (nodeId: string) => void } = {
      [Actions.DELETE]: deleteNode,
    };

    // Aqui, a função é chamada diretamente
    actions[option]?.(nodeId);
  }

  return { executeAction };
}
