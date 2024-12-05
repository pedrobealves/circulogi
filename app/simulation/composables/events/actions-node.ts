import { useCircuitStore } from "~/simulation/stores/circuit";
import { Actions } from "~/simulation/types/actions";
import { NodeType } from "~/simulation/types/nodeType";
import { NodeRole } from "~/simulation/types/nodeRole";

export function useActionsNode() {
  const circuitStore = useCircuitStore();

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

  function openNote(nodeId: string) {
    const node = circuitStore.getNode(nodeId);

    if (node?.type !== NodeType.NOTE) return;

    console.log(node.value);

    if (node.value) {
      node.color = "transparent";
    } else {
      node.color = "black";
    }
  }

  function deleteNode(nodeId: string) {
    const node = circuitStore.getNode(nodeId);

    if (!node) return;

    if (
      (node.type === NodeType.IN || node.type === NodeType.OUT) &&
      node.role === NodeRole.COMPONENT
    ) {
      console.log("Não é possível deletar um nó de entrada/saída");
      return;
    }

    if (node.type === NodeType.CONN) {
      circuitStore.deleteConnection(node);
      return;
    }

    circuitStore.deleteComponent(node);

    // Aqui poderia vir o código para realmente deletar o nó
    console.log("Nó deletado com sucesso");
  }

  return { executeAction, openNote };
}
