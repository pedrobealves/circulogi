import { useSimulationStore } from "~/simulation/stores/simulation";
import { NodeType } from "~/simulation/types/nodeType";
import { NodeRole } from "~/simulation/types/nodeRole";
import { useComponentDelete } from "@/simulation/composables/component/component-delete";
import { useConnectionNodes } from "@/simulation/composables/node/node-connection";

export function useNodeDelete() {
  const circuitStore = useSimulationStore();
  const { deleteConnection } = useConnectionNodes();
  const { deleteComponent } = useComponentDelete();

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
      deleteConnection(node);
      return;
    }

    deleteComponent(node);

    // Aqui poderia vir o código para realmente deletar o nó
    console.log("Nó deletado com sucesso");
  }

  return { deleteNode };
}
