<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import gsap from "gsap";
import { NodeType } from "@/simulation/types/nodeType";
import { useSimulationStore } from "~/simulation/stores/simulation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/common/components/ui/dialog";

import { Textarea } from "@/common/components/ui/textarea";

const circuitStore = useSimulationStore();

// Dados iniciais
const items = [
  {
    label: "E/S",
    icon: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z",
  },
  {
    label: "Componentes",
    icon: "M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z",
  },
  {
    label: "Notas",
    icon: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
  },
];

const logics = circuitStore.logicTypes.map((type) => ({
  title: type,
  img: "",
}));

const details = [
  {
    visible: false,
    items: [
      { title: "IN", img: "" },
      { title: "OUT", img: "" },
      { title: "CLK", img: "" },
    ],
  },
  {
    visible: false,
    items: logics,
  },
  { visible: false, items: [{ title: "TEXT", img: "" }] },
];

const container = ref(null);
let activeIndex = ref<number | null>(null);

const visibleDetails = computed(() =>
  details.map((detail, idx) => ({
    ...detail,
    visible: activeIndex.value === idx,
  }))
);

const buttonClasses = computed(
  () => (index: number) =>
    `item flex items-center justify-center gap-2 hover:bg-zinc-950 hover:text-white duration-300 transition-colors py-3 px-4 rounded-2xl ${
      activeIndex.value === index ? "active" : ""
    }`
);

const containerDimensions = [
  { width: 500, height: 204 },
  { width: 460, height: 392 },
  { width: 480, height: 204 },
];

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

const animateContainer = throttle((config) => {
  gsap.to(container.value, config);
}, 100);

const handleMouseEnter = (index: number) => {
  if (activeIndex.value !== index) {
    activeIndex.value = index;

    const dimensions = containerDimensions[index];

    if (!dimensions) return;

    const { width, height } = dimensions;

    animateContainer({
      width,
      height,
      y: 17,
      borderRadius: 24,
      duration: 0.75,
      ease: "elastic.out(1, 0.5)",
    });
  }
};
const onMouseEnterContainer = () => {};
const onMouseLeaveContainer = () => {
  activeIndex.value = null;

  animateContainer({
    width: 410,
    height: 48,
    y: 0,
    borderRadius: 16,
    duration: 0.75,
    ease: "elastic.out(1, 0.5)",
  });
};

function addNewComponent(type: string) {
  if (type === "TEXT") {
    circuitStore.createNoteNode();
    return;
  }
  circuitStore.createComponentAndAdd(type as NodeType);
}
</script>

<template>
  <div @mouseenter="onMouseEnterContainer" @mouseleave="onMouseLeaveContainer">
    <!-- Botões -->
    <div
      class="flex items-center justify-center gap-2 rounded-2xl bg-transparent w-[410px] absolute -translate-x-1/2 left-1/2 bottom-14 z-[2]"
    >
      <button
        v-for="(item, index) in items"
        :key="index"
        :class="buttonClasses(index)"
        @mouseenter="() => handleMouseEnter(index)"
        v-memo="true"
      >
        <svg
          v-if="item.icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path :d="item.icon" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="font-bold">{{ item.label }}</span>
      </button>
    </div>

    <!-- Detalhes dos Itens -->
    <div
      ref="container"
      class="absolute bg-black/5 backdrop-blur-xl w-[410px] h-12 -translate-x-1/2 left-1/2 bottom-14 overflow-hidden rounded-2xl container-block"
    >
      <div
        v-for="(detail, index) in visibleDetails"
        :key="index"
        v-show="detail.visible"
        :class="[
          'p-4 flex-col items-center absolute w-full bottom-16 transition-opacity duration-300',
          detail.visible ? 'flex opacity-100' : 'opacity-0',
        ]"
      >
        <div class="flex flex-row gap-1 justify-center flex-wrap max-w-[500px]">
          <div
            @click="addNewComponent(subItem.title)"
            v-for="(subItem, subIndex) in detail.items"
            :key="subIndex"
            class="flex items-center gap-3 cursor-pointer hover:bg-black/5 rounded-2xl py-3 px-3 hover:px-3 duration-300"
          >
            <div
              class="flex items-center justify-center h-16 w-16 border-black border-[3px] rounded-full"
            >
              <div class="font-Inter font-semibold text-black text-lg">
                {{ subItem.title }}
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="index !== detail.items.length + 1"
          class="h-[2px] w-[95%] bg-black/10 mt-4"
        ></div>
      </div>
    </div>
  </div>
</template>
