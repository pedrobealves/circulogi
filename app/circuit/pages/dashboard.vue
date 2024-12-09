<script setup lang="ts">
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/common/components/ui/avatar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/common/components/ui/breadcrumb";
import LucideSpinner from "~icons/lucide/loader-2";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/common/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { Separator } from "@/common/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/common/components/ui/sidebar";
import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal,
  Trash2,
  EllipsisVertical,
} from "lucide-vue-next";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/common/components/ui/context-menu";
import { Input } from "@/common/components/ui/input";

import { ref } from "vue";

import generate from "project-name-generator";
import type { Circuit } from "@prisma/client";
import { useCircuitStore } from "~/simulation/stores/circuit";

const user = useSupabaseUser();
const circuitStore = useCircuitStore();

function handleLogOut() {
  useSupabaseClient().auth.signOut();
  navigateTo("/login");
}

// This is sample data.
const data = {
  user: {
    name: user.value?.user_metadata.full_name,
    email: user.value?.email,
    avatar: "",
  },
  teams: [
    {
      name: "circulogi",
      logo: GalleryVerticalEnd,
      plan: "",
    },
  ],
  navMain: [
    {
      title: "Documentação",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introdução",
          url: "#",
        },
      ],
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Geral",
          url: "#",
        },
      ],
    },
  ],
  projects: [],
};

const activeTeam = ref(data.teams[0]);

function setActiveTeam(team: (typeof data.teams)[number]) {
  activeTeam.value = team;
}

function toTitleCaseAdvanced(input: string): string {
  return input
    .trim() // Remove espaços extras no início e no fim
    .toLowerCase()
    .split(/\s+/) // Divide por qualquer sequência de espaços
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const {
  data: circuitData,
  pending,
  error,
  refresh,
} = await useLazyFetch("/api/v1/circuits", {
  headers: useRequestHeaders(["cookie"]), // Envia os cookies na requisição
});

watchEffect(() => {
  if (!user.value) {
    return navigateTo("/login");
  }
});

const isLoading = ref(false);

async function deleteCircuit(circuitId: string) {
  const deletedCircuitId = circuitId;

  circuitData.value = circuitData.value.filter(
    (circuit: { id: string }) => circuit.id !== deletedCircuitId
  );
  try {
    await circuitStore.deleteCircuit(deletedCircuitId);
  } catch (error) {
    console.error("Erro ao excluir circuito:", error);
    await refresh();
  }
}

const input = ref();
const showInput = ref(false);
const editableCircuitId = ref<string | null>(null);

async function openInput() {
  showInput.value = true;
  await nextTick();
  input.value?.$el?.focus();
}

async function openEdit(circuitId: string) {
  editableCircuitId.value = circuitId;

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
    // Executa a chamada manualmente com `$fetch`
    const response = await $fetch("/api/v1/circuits", {
      method: "POST",
      body: {
        name: inputValue.value,
        version: "1.0.0",
      },
    });
    navigateTo(`/circuit/${response.id}`);
  } catch (error) {
    // Lida com erros, se necessário
    console.error("Erro ao criar circuito:", error);
  } finally {
    isLoading.value = false; // Desativar estado de carregamento
  }
}

async function editCircuit(circuitId: string, name: string) {
  editableCircuitId.value = null; // Desativar modo de edição
  try {
    // Executa a chamada manualmente com `$fetch`
    const response = await $fetch(`/api/v1/circuits/${circuitId}`, {
      method: "PUT",
      body: {
        name: name,
      },
    });
    const circuitIndex = circuitData.value.findIndex(
      (circuit: { id: string }) => circuit.id === circuitId
    );

    if (circuitIndex !== -1) {
      circuitData.value[circuitIndex].name = name; // Atualiza o nome no `circuitData`
    }
  } catch (error) {
    // Lida com erros, se necessário
    console.error("Erro ao criar circuito:", error);
  }
}

onMounted(async () => {
  console.log("Dashboard mounted");
  await circuitStore.$reset();
  console.log("Circuit store reset");
});
</script>

<template>
  <SidebarProvider>
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div
                    class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
                  >
                    <component :is="activeTeam?.logo" class="size-4" />
                  </div>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{
                      activeTeam?.name
                    }}</span>
                    <span class="truncate text-xs">{{ activeTeam?.plan }}</span>
                  </div>
                  <ChevronsUpDown class="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible
              v-for="item in data.navMain"
              :key="item.title"
              as-child
              :default-open="item.isActive"
              class="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger as-child>
                  <SidebarMenuButton :tooltip="item.title">
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                    <ChevronRight
                      class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem
                      v-for="subItem in item.items"
                      :key="subItem.title"
                    >
                      <SidebarMenuSubButton as-child>
                        <a :href="subItem.url">
                          <span>{{ subItem.title }}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup class="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Circuitos</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in data.projects" :key="item.name">
              <SidebarMenuButton as-child>
                <a :href="item.url">
                  <component :is="item.icon" />
                  <span>{{ item.name }}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <SidebarMenuAction show-on-hover>
                    <MoreHorizontal />
                    <span class="sr-only">MAis</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  class="w-48 rounded-lg"
                  side="bottom"
                  align="end"
                >
                  <DropdownMenuItem>
                    <Folder class="text-muted-foreground" />
                    <span>View Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Forward class="text-muted-foreground" />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 class="text-muted-foreground" />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton class="text-sidebar-foreground/70">
                <MoreHorizontal class="text-sidebar-foreground/70" />
                <span>More</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar class="h-8 w-8 rounded-lg">
                    <AvatarImage
                      :src="data.user.avatar"
                      :alt="data.user.name"
                    />
                    <AvatarFallback class="rounded-lg"> CN </AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{
                      data.user.name
                    }}</span>
                    <span class="truncate text-xs">{{ data.user.email }}</span>
                  </div>
                  <ChevronsUpDown class="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                :side-offset="4"
              >
                <DropdownMenuLabel class="p-0 font-normal">
                  <div
                    class="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
                  >
                    <Avatar class="h-8 w-8 rounded-lg">
                      <AvatarImage
                        :src="data.user.avatar"
                        :alt="data.user.name"
                      />
                      <AvatarFallback class="rounded-lg"> CN </AvatarFallback>
                    </Avatar>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-semibold">{{
                        data.user.name
                      }}</span>
                      <span class="truncate text-xs">{{
                        data.user.email
                      }}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="handleLogOut">
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <SidebarInset>
      <header
        class="flex px-8 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
        <div class="flex items-center gap-2 px-4 w-full">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#">
                  Construa seu circuito
                </BreadcrumbLink>
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
                <LucideSpinner
                  v-if="isLoading"
                  class="mr-2 h-4 w-4 animate-spin"
                />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div class="ml-auto">
            <Button :disabled="isLoading" @click="openInput()">
              <span>+ Criar Circuito</span></Button
            >
          </div>
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-8 pt-0">
        <div v-if="circuitData" class="grid gap-4 md:grid-cols-5">
          <ContextMenu v-for="circuit in circuitData" :key="circuit.id">
            <ContextMenuTrigger
              class="group aspect-video rounded-xl bg-gray-100 overflow-clip p-[6px] cursor-pointer"
            >
              <NuxtLink
                :to="{ name: 'circuit-id', params: { id: circuit.id } }"
                replace
              >
                <div
                  class="w-full h-44 bg-gray-300 rounded-xl ring-offset-2 ring-black group-hover:ring-4 transition ease-out"
                ></div>
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
                      @submit.prevent="editCircuit(circuit.id, circuit.name)"
                      class="mb-2"
                    >
                      <Input
                        v-if="editableCircuitId === circuit.id"
                        v-model="circuit.name"
                        type="text"
                        class="h-8"
                        :id="`editable-input-${circuit.id}`"
                      />
                    </form>
                    <span class="text-gray-500 text-sm">4 days ago</span>
                  </div>
                </div>
              </NuxtLink>
            </ContextMenuTrigger>
            <ContextMenuContent class="w-64">
              <ContextMenuItem inset @click="openEdit(circuit.id)">
                Renomear
              </ContextMenuItem>
              <ContextMenuItem inset @click="deleteCircuit(circuit.id)">
                Excluir
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
