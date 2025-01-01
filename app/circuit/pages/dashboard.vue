<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/common/components/ui/breadcrumb";
import LucideSpinner from "~icons/lucide/loader-2";

import { Separator } from "@/common/components/ui/separator";
import { SidebarTrigger } from "@/common/components/ui/sidebar";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/common/components/ui/context-menu";
import { Input } from "@/common/components/ui/input";

import { ref } from "vue";

import { useCircuitStore } from "@/circuit/store/circuit";
import { useSimulationStore } from "@/simulation/stores/simulation";
import generate from "project-name-generator";
import { useCircuit } from "@/common/composables/circuit";

const circuitStore = useCircuitStore();
const { $reset } = useSimulationStore();
const { createCircuit, renameCircuit, deleteCircuitById } = useCircuit();

function toTitleCaseAdvanced(input: string): string {
  return input
    .trim() // Remove espaços extras no início e no fim
    .toLowerCase()
    .split(/\s+/) // Divide por qualquer sequência de espaços
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const isLoading = ref(false);

async function deleteCircuit(circuitId: string) {
  try {
    deleteCircuitById(circuitId);
  } catch (error) {
    console.error("Erro ao excluir circuito:", error);
  }
}

const input = ref();
const renameInput = ref();
const showInput = ref(false);
const editableCircuitId = ref<string | null>(null);

async function openInput() {
  showInput.value = true;
  await nextTick();
  input.value?.$el?.focus();
}

async function openEdit(circuitId: string, name: string) {
  editableCircuitId.value = circuitId;
  renameInput.value = name;

  await nextTick();
  setTimeout(() => {
    const input = document.querySelector(`#editable-input-${circuitId}`);
    (input as HTMLInputElement)?.focus();
  }, 200); // Definir o foco após a renderização do input
}

const inputValue = ref(toTitleCaseAdvanced(generate({ words: 2 }).spaced)); // Valor inicial

async function createNewCircuit() {
  isLoading.value = true; // Ativar estado de carregamento
  try {
    await createCircuit(inputValue.value);
  } catch (error) {
    console.error("Erro ao criar circuito:", error);
  } finally {
    isLoading.value = false;
  }
}

async function editCircuit(circuitId: string, name: string) {
  editableCircuitId.value = null; // Desativar modo de edição
  try {
    renameCircuit(circuitId, name);
  } catch (error) {
    console.error("Erro ao criar circuito:", error);
  }
}

onMounted(async () => {
  console.log("Dashboard mounted");
  await $reset();
  console.log("Circuit store reset");
});

definePageMeta({
  layout: "main-layout",
});

useSeoMeta({
  title: "Circuits",
  ogTitle: "Circuits",
  description: "Todos os circuitos do usuário",
  ogDescription: "Todos os circuitos do usuário",
});
</script>

<template>
  <HeaderBreadcrumb>
    <template v-slot:breadcrumb>
      <BreadcrumbItem class="hidden md:block">
        <BreadcrumbLink href="#"> Construa seu circuito </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator class="hidden md:block" />
      <BreadcrumbItem>
        <BreadcrumbPage v-if="!showInput">Todos</BreadcrumbPage>
        <form
          v-if="showInput && !isLoading"
          @submit.prevent="createNewCircuit"
          class="flex items-center gap-2"
        >
          <Input
            v-model="inputValue"
            type="text"
            class="h-8 focus-visible:ring-0"
            ref="input"
          />
        </form>
        <LucideSpinner v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
      </BreadcrumbItem>
    </template>
    <template v-slot:button>
      <div class="ml-auto">
        <Button :disabled="isLoading" @click="openInput()">
          <span>+ Criar Circuito</span></Button
        >
      </div>
    </template>
  </HeaderBreadcrumb>
  <div class="flex flex-1 flex-col gap-4 p-8 pt-0">
    <div v-if="circuitStore" class="grid gap-4 md:grid-cols-5">
      <ContextMenu
        v-for="circuit in circuitStore.lastCircuits"
        :key="circuit.id"
      >
        <ContextMenuTrigger
          class="group aspect-video rounded-xl bg-gray-100 overflow-clip p-[6px] cursor-pointer"
        >
          <NuxtLink
            :to="{ name: 'circuit-id', params: { id: circuit.id } }"
            replace
          >
            <div
              class="w-full h-44 bg-gray-300 rounded-xl ring-offset-2 ring-black group-hover:ring-4 transition ease-out overflow-hidden"
            >
              <NuxtImg
                v-if="circuit.thumbnail"
                :src="circuit.thumbnail"
                class="bg-cover bg-center"
                loading="lazy"
              />
            </div>
            <div class="flex flex-wrap w-full">
              <div class="flex flex-col max-w-60 p-2 mt-1">
                <h3
                  v-if="editableCircuitId !== circuit.id"
                  class="overflow-hidden text-ellipsis whitespace-nowrap font-normal"
                >
                  {{ circuit.name }}
                </h3>
                <form
                  v-if="editableCircuitId === circuit.id"
                  @submit.prevent="editCircuit(circuit.id, renameInput)"
                  class="mb-2"
                >
                  <Input
                    v-if="editableCircuitId === circuit.id"
                    v-model="renameInput"
                    type="text"
                    class="h-8"
                    :id="`editable-input-${circuit.id}`"
                  />
                </form>
                <span class="text-gray-500 text-sm">
                  <NuxtTime :datetime="circuit.updatedAt" relative />
                </span>
              </div>
            </div>
          </NuxtLink>
        </ContextMenuTrigger>
        <ContextMenuContent class="w-64">
          <ContextMenuItem inset @click="openEdit(circuit.id, circuit.name)">
            <Trash2 class="text-muted-foreground" />
            Renomear
          </ContextMenuItem>
          <ContextMenuItem inset @click="deleteCircuit(circuit.id)">
            Excluir
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  </div>
</template>
