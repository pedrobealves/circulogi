import * as vNG from "v-network-graph";
import { useNodeCollision } from "./event-node-collision";
import { useNodeSelect } from "./event-node-select";
import { useLogicPropagation } from "./event-logic-propagation";
import { useActionsNode } from "./event-actions-node";
import { useSaveState } from "./event-save-state";
// Função para otimizar o registro de manipuladores de eventos
export function useNodeEventHandlers() {
  // Inicialize dependências fora dos manipuladores para evitar recriação repetitiva
  const { solve } = useLogicPropagation();
  const { save } = useSaveState();
  const { handleNodeCollision } = useNodeCollision();
  const {
    selectNode,
    deselectNodes,
    nodesConnDeHighlight,
    nodesConnHighlight,
  } = useNodeSelect();

  function throttle<T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ): T {
    let lastTime = 0;

    return function (...args: any[]) {
      const now = Date.now();
      if (now - lastTime >= delay) {
        lastTime = now;
        func(...args);
      }
    } as T;
  }

  const { executeAction } = useActionsNode();

  // Usa o throttle do Lodash para limitar a frequência do evento
  const throttledHandleNodeCollision = throttle((node) => {
    handleNodeCollision(node);
  }, 50); // 50ms de intervalo entre chamadas (ajuste conforme necessário)

  const eventHandlers: vNG.EventHandlers = {
    "node:click": ({ node }) => {
      solve(node);
      executeAction(node);
    },
    "node:pointerdown": ({ node }) => {
      selectNode(node); // Seleciona o nó
      nodesConnHighlight(node); // Destaca as conexões
    },
    "node:pointerup": () => {
      nodesConnDeHighlight(); // Remove o destaque das conexões
      save();
    },
    "node:pointermove": (node) => {
      throttledHandleNodeCollision(node); // Lida com colisões de forma otimizada
    },
    "view:click": () => {
      deselectNodes();
    },
  };

  return {
    eventHandlers,
  };
}
