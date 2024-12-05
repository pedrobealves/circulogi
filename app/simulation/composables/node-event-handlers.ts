import * as vNG from "v-network-graph";
import { useNodeCollision } from "./events/node-collision";
import { useNodeSelect } from "./events/node-select";
import { useLogicPropagation } from "./events/logic-propagation";
import { useActionsNode } from "./events/actions-node";
// Função para otimizar o registro de manipuladores de eventos
export function useNodeEventHandlers() {
  // Inicialize dependências fora dos manipuladores para evitar recriação repetitiva
  const { solve } = useLogicPropagation();
  const { handleNodeCollision } = useNodeCollision();
  const { selectNode, nodesConnDeHighlight, nodesConnHighlight } =
    useNodeSelect();

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

  const { executeAction, openNote } = useActionsNode();

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
    },
    "node:pointermove": (node) => {
      throttledHandleNodeCollision(node); // Lida com colisões de forma otimizada
    },
  };

  return {
    eventHandlers,
  };
}
