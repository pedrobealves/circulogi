<script setup lang="ts">
import { useCircuitStore } from "@/circuit/store/circuit";
import { useCircuit } from "@/common/composables/circuit";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/common/components/ui/avatar";

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
  Circle,
} from "lucide-vue-next";

import { ref } from "vue";
import Dashboard from "~/circuit/pages/dashboard.vue";

const user = useSupabaseUser();
const circuitStore = useCircuitStore();
const { createCircuit, renameCircuit, deleteCircuitById, fetchCircuits } =
  useCircuit();

const loadCircuits = async () => {
  try {
    await fetchCircuits(); // Busca os dados
  } catch (error) {
    console.error("Erro ao buscar os circuitos:", error);
  }
};

loadCircuits();

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
      logo: Circle,
      plan: "",
    },
  ],
  navMain: [
    {
      title: "Documentação",
      url: "#",
      icon: BookOpen,
      isActive: false,
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
      isActive: false,
      items: [
        {
          title: "Geral",
          url: "/settings/profile",
        },
      ],
    },
  ],
};

const activeTeam = ref(data.teams[0]);

function setActiveTeam(team: (typeof data.teams)[number]) {
  activeTeam.value = team;
}

async function deleteCircuit(circuitId: string) {
  try {
    deleteCircuitById(circuitId);
  } catch (error) {
    console.error("Erro ao excluir circuito:", error);
  }
}

async function viewCircuit(circuitId: string) {
  return navigateTo("/circuit/" + circuitId);
}

const copyToClipboard = async (circuitId: string) => {
  const hostname: String = "https://circulogi.pedrobernardi.com";

  const url = `${hostname}/circuit/${circuitId}`;

  try {
    await navigator.clipboard.writeText(url); // Copia o conteúdo do input
  } catch (error) {
    console.error("Erro ao copiar o texto: ", error);
  }
};

watchEffect(() => {
  if (!user.value) {
    return navigateTo("/login");
  }
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
                <NuxtLink to="/dashboard">
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
                      <span class="truncate text-xs">{{
                        activeTeam?.plan
                      }}</span>
                    </div>
                    <!--- <ChevronsUpDown class="ml-auto" /> -->
                  </SidebarMenuButton>
                </NuxtLink>
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
                        <NuxtLink :to="subItem.url">
                          <span>{{ subItem.title }}</span>
                        </NuxtLink>
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
            <SidebarMenuItem
              v-for="item in circuitStore.lastCircuits"
              :key="item.name"
            >
              <SidebarMenuButton as-child>
                <NuxtLink
                  :to="{ name: 'circuit-id', params: { id: item.id } }"
                  replace
                >
                  <span>{{ item.name }}</span>
                </NuxtLink>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <SidebarMenuAction show-on-hover>
                    <MoreHorizontal />
                    <span class="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  class="w-48 rounded-lg"
                  side="bottom"
                  align="end"
                >
                  <DropdownMenuItem @click="viewCircuit(item.id)">
                    <Folder class="text-muted-foreground" />
                    <span>Ver</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="copyToClipboard(item.id)">
                    <Forward class="text-muted-foreground" />
                    <span>Compartilhar</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem @click="deleteCircuit(item.id)">
                    <Trash2 class="text-muted-foreground" />
                    <span>Deletar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <NuxtLink to="/dashboard" replace>
                <SidebarMenuButton class="text-sidebar-foreground/70">
                  <MoreHorizontal class="text-sidebar-foreground/70" />
                  <span>Mais</span>
                </SidebarMenuButton>
              </NuxtLink>
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
      <slot />
    </SidebarInset>
  </SidebarProvider>
</template>
