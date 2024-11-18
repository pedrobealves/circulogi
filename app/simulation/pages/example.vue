<script setup lang="ts">
import { useCircuitStore } from "@/simulation/stores/circuit";
import { NodeType } from "~/simulation/types/nodeType";
import { useNetworkGraph } from "~/simulation/composables/network-graph";
import { useNodeEventHandlers } from "~/simulation/composables/node-event-handlers";

const circuitStore = useCircuitStore();

function addAndComponent() {
  // Adiciona o componente do tipo AND ao circuito
  circuitStore.createComponentAndAdd(NodeType.AND);
}

// Usando onMounted para adicionar o AND logo que o componente for montado
onMounted(() => {
  addAndComponent();
});

function addNewComponent() {
  // Aqui você cria um novo componente (por exemplo, do tipo 'AND')
  addAndComponent();
}

function addNewComponentIn() {
  // Adiciona o componente do tipo IN ao circuito
  circuitStore.createComponentAndAdd(NodeType.IN);
}

function addNewComponenOut() {
  // Adiciona o componente do tipo OUT ao circuito
  circuitStore.createComponentAndAdd(NodeType.OUT);
}

const { configs } = useNetworkGraph();

const { eventHandlers } = useNodeEventHandlers();
</script>

<template>
  <button @click="addNewComponent" class="add-button">
    Adicionar Componente AND
  </button>
  <button @click="addNewComponentIn" class="add-button">
    Adicionar Componente IN
  </button>
  <button @click="addNewComponenOut" class="add-button">
    Adicionar Componente OUT
  </button>
  <v-network-graph
    class="graph"
    v-model:layouts="circuitStore.layout"
    :nodes="circuitStore.nodes"
    :edges="circuitStore.edges"
    :configs="configs"
    :event-handlers="eventHandlers"
  />
</template>

<style>
.graph {
  border: 1px solid #000;
  height: 100dvh;
  width: 100dvw;
}

html,
body,
#__nuxt {
  height: 100dvh;
  width: 100dvw;
  margin: 0;
  padding: 0;
  position: fixed;
  overflow: hidden;
}
</style>
