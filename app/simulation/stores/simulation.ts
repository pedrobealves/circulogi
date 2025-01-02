import { NodeType } from "~/simulation/types/nodeType";
import { NodeRole } from "~/simulation/types/nodeRole";
import { useNodeFactory } from "~/simulation/composables/node/node-factory";
import { useEdgeFactory } from "~/simulation/composables/edge/edge-factory";
import * as vNG from "v-network-graph";
import type { Node } from "~/simulation/types/node";
import { Actions } from "~/simulation/types/actions";
import type { Circuit } from "~/simulation/types/circuit";
import { useNodesStore } from "./node";
import { useEdgesStore } from "./edge";

import { useComponentFactory } from "~/simulation/composables/component/component-factory";
import { useLogicPropagation } from "../composables/events/event-logic-propagation";
import { defineStore } from "pinia";

export const useSimulationStore = defineStore("simulation", () => {
  const circuit = ref<Circuit>();

  const nodesStore = useNodesStore();
  const edgesStore = useEdgesStore();
  const { createNode } = useNodeFactory();
  const { createEdge } = useEdgeFactory();
  const { createComponent } = useComponentFactory();
  const autoSave = ref(false);
  const graph = ref<vNG.Instance>();
  const isConnDetection = ref(false);

  const selectedAction = ref<Actions>();

  const counter = ref(0);
  const layout = nodesStore.layouts;

  const clkNodes = ref<Node[]>([]);
  const actClk = ref<boolean>(false);

  function setGraph(graphInstance: any) {
    graph.value = graphInstance;
  }

  function $reset() {
    nodesStore.$reset();
    edgesStore.$reset();
    autoSave.value = false;
    selectedAction.value = undefined;
    circuit.value = undefined;
    counter.value = 0;
    layout.nodes = {};
    clkNodes.value = [];
  }

  const graphState = computed(() => ({
    nodes: nodesStore.nodes,
    edges: edgesStore.edges,
  }));

  // watch(
  //   graphState,
  //   () => {
  //     if (autoSave.value) save();
  //   },
  //   { deep: true }
  // );

  async function save() {
    try {
      const nodes = Object.values(nodesStore.nodes);
      const edges = Object.values(edgesStore.edges);
      const count = counter.value;
      const layoutCircuit = layout;

      const circuitUpdated = {
        nodes,
        edges,
        count,
        layout: layoutCircuit,
      };

      if (circuit.value) {
        const body = {
          content: JSON.stringify(circuitUpdated),
        };

        const response = await $fetch(`/api/v1/circuits/${circuit.value.id}`, {
          method: "PUT",
          body,
        });

        if (response.ok) {
          console.log("Circuito atualizado com sucesso.");
        } else {
          console.error("Erro ao atualizar o circuito: " + response.statusText);
        }
      }
    } catch (error) {
      console.error("Erro ao salvar o circuito:", error);
    }
  }

  async function deleteCircuit(CircuitId: string) {
    if (CircuitId) {
      await $fetch(`/api/v1/circuits/${CircuitId}`, {
        method: "DELETE",
      });
    }
  }

  const setSelectedAction = (action: Actions) => {
    selectedAction.value = action;
  };

  const logicTypes: NodeType[] = Object.values(NodeType).filter(
    (value) =>
      value !== NodeType.IN &&
      value !== NodeType.OUT &&
      value !== NodeType.CONN &&
      value !== NodeType.CLK &&
      value !== NodeType.NOTE
  );

  const selectedNodes = ref<Node>();

  function loadCircuit(content: any) {
    if (!content) return;
    const circuitContent = JSON.parse(content);
    nodesStore.setNodes(circuitContent.nodes);
    edgesStore.setEdges(circuitContent.edges);
    layout.nodes = circuitContent.layout.nodes;
    counter.value = circuitContent.count;
    autoSave.value = true;
  }

  function createComponentAndAdd(type: NodeType) {
    const component = createComponent(type);

    if (component) {
      const { mainNode, nodes, edges } = component;
      nodesStore.addNode(mainNode);
      nodes.forEach((node) => nodesStore.addNode(node));
      edges.forEach((edge) => edgesStore.addEdge(edge));
      save();
    }
  }

  function createNoteNode(text: string) {
    const component = useNodeFactory().createNode({
      type: NodeType.NOTE,
      role: NodeRole.COMPONENT,
      size: 32,
      maxInputs: 0,
      maxOutputs: 0,
    });
    component.note = text;
    nodesStore.addNode(component);
    save();
  }

  function selectNode(nodeId: string) {
    const node = nodesStore.getNode(nodeId);
    selectedNodes.value = node;
  }

  return {
    circuit,
    save,
    createComponentAndAdd,
    nodes: nodesStore.nodes,
    getNode: nodesStore.getNode,
    edges: edgesStore.edges,
    addNode: nodesStore.addNode,
    layout,
    selectNode,
    selectedNodes,
    isConnDetection,
    logicTypes,
    setSelectedAction,
    selectedAction,
    createNoteNode,
    actClk,
    deleteCircuit,
    loadCircuit,
    $reset,
    clkNodes,
    graph,
    setGraph,
    counter,
  };
});
