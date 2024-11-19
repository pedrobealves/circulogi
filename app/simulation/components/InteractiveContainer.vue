<template>
  <!-- Wrapper para Menu e Detalhes -->
  <div @mouseenter="onMouseEnterContainer" @mouseleave="onMouseLeaveContainer">
    <!-- Botões -->
    <div
      class="flex items-center justify-center gap-2 rounded-2xl bg-transparent w-[410px] absolute -translate-x-1/2 left-1/2 bottom-14 z-[2]"
    >
      <button
        v-for="(item, index) in items"
        :key="index"
        class="item flex items-center justify-center gap-2 hover:bg-zinc-950 hover:text-white duration-300 transition-colors py-3 px-4 rounded-2xl"
        @mouseenter="onMouseEnter(index)"
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
        v-for="(detail, index) in details"
        :key="index"
        :class="[
          'p-4  flex-col items-center  absolute w-full bottom-16 transition-opacity duration-300',
          detail.visible ? 'flex' : 'hidden',
        ]"
      >
        <div class="flex flex-row gap-1 justify-center flex-wrap max-w-[500px]">
          <div
            v-for="(subItem, subIndex) in detail.items"
            :key="subIndex"
            class="flex items-center gap-3 cursor-pointer hover:bg-black/5 rounded-2xl py-3 px-3 hover:px-3 duration-300"
          >
            <!-- <img
            :src="subItem.img"
            :alt="subItem.alt"
            class="w-16 rounded-xl object-cover h-16 shrink-0"
          />
          <div class="w-full flex flex-col items-start">
            <p class="font-bold">{{ subItem.title }}</p>
            <p class="opacity-80">{{ subItem.description }}</p>
          </div>
          <span
            class="block shrink-0 py-1 px-2 text-sm rounded-lg opacity-80 border border-black/50"
            >{{ subItem.os }}</span
          > -->
            <!-- Use v-html to interpret escape sequences for icon characters. -->
            <div
              class="flex items-center justify-center h-16 w-16 border-black border-[3px] rounded-full"
            >
              <div class="font-Inter font-semibold text-black text-xl">AND</div>
              <!-- <text
              font-family="Inter"
              font-size="21"
              fill="black"
              text-anchor="middle"
              dominant-baseline="central"
              font-weight="600"
              style="pointer-events: none"
            >
              AND
            </text>
            <circle
              r="32"
              fill="none"
              stroke="black"
              stroke-width="3"
              v-bind="slotProps"
            /> -->
            </div>
          </div>
        </div>
        <div
          v-if="index !== detail.items.length"
          class="h-[2px] w-[95%] bg-black/10 mt-4"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import gsap from "gsap";

export default {
  data() {
    return {
      items: [
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
      ],
      details: [
        {
          visible: false,
          items: [
            {
              title: "Gather",
              description: "Virtual Office",
              os: "Mac",
              img: "/gather.svg",
              alt: "gather",
            },
            {
              title: "Gather",
              description: "Virtual Office",
              os: "Mac",
              img: "/gather.svg",
              alt: "gather",
            },
            {
              title: "Slack",
              description: "Communication App",
              os: "Windows",
              img: "/slack.svg",
              alt: "slack",
            },
            {
              title: "Slack",
              description: "Communication App",
              os: "Windows",
              img: "/slack.svg",
              alt: "slack",
            },
            {
              title: "Slack",
              description: "Communication App",
              os: "Windows",
              img: "/slack.svg",
              alt: "slack",
            },
            {
              title: "Slack",
              description: "Communication App",
              os: "Windows",
              img: "/slack.svg",
              alt: "slack",
            },
            {
              title: "Slack",
              description: "Communication App",
              os: "Windows",
              img: "/slack.svg",
              alt: "slack",
            },
          ],
        },
        {
          visible: false,
          items: [
            {
              title: "Slack",
              description: "Communication App",
              os: "Windows",
              img: "/slack.svg",
              alt: "slack",
            },
            {
              title: "Slack",
              description: "Communication App",
              os: "Windows",
              img: "/slack.svg",
              alt: "slack",
            },
          ],
        },
        {
          visible: false,
          items: [],
        },
      ],
    };
  },
  methods: {
    onMouseEnter(index) {
      const container = this.$refs.container;

      // Atualizando apenas o detalhe relevante em vez de iterar sobre todos os itens
      if (this.activeIndex !== index) {
        this.details.forEach((detail, idx) => {
          detail.visible = idx === index;
        });
        this.activeIndex = index; // Armazenar o índice ativo para evitar reprocessamento desnecessário
      }

      // Definindo os parâmetros de animação diretamente em um objeto para facilitar
      const animationParams = {
        width: index === 0 ? 500 : index === 1 ? 460 : 480,
        height: index === 0 ? 290 : index === 1 ? 204 : 204,
        y: 17,
        borderRadius: 24,
        duration: 0.75,
        ease: "elastic.out(1, 0.5)",
      };

      // Usando gsap.to diretamente
      gsap.to(container, animationParams);
    },

    onMouseEnterContainer() {
      this.isHovering = true; // Não há alteração significativa, mas mantemos o estado
    },

    onMouseLeaveContainer() {
      // Fechar o menu e esconder os detalhes de forma eficiente
      if (this.activeIndex !== null) {
        this.details.forEach((detail) => (detail.visible = false));
        this.activeIndex = null; // Resetar o índice ativo
      }

      const container = this.$refs.container;

      // Animando o retorno ao estado inicial com parâmetros prontos
      const resetAnimationParams = {
        width: 410,
        height: 48,
        y: 0,
        borderRadius: 16,
        duration: 0.75,
        ease: "elastic.out(1, 0.5)",
      };

      // Usar gsap.to para animação
      gsap.to(container, resetAnimationParams);
    },
  },
};
</script>

<style></style>
