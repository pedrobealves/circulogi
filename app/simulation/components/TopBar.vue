<script setup lang="ts">
import { useSimulationStore } from "~/simulation/stores/simulation";

const circuitStore = useSimulationStore();

const circuit = computed(() => circuitStore.circuit);

function saveCircuit() {
  circuitStore.save();
}

async function exportImage() {
  const graph: any = circuitStore.graph;

  console.log(graph);

  if (!graph.value) return;
  const svgText = await graph.value.exportAsSvgText();

  // Criar um elemento <img> temporário para carregar o SVG
  const svgImage = new Image();
  const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
  const svgUrl = URL.createObjectURL(svgBlob);
  svgImage.src = svgUrl;

  // Quando a imagem estiver carregada, desenhá-la no canvas e exportar como PNG
  svgImage.onload = () => {
    // Criar o canvas e definir seu tamanho com base no SVG
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const width = svgImage.width;
    const height = svgImage.height;

    if (ctx) {
      // Ajusta o tamanho do canvas para o tamanho do SVG
      canvas.width = width;
      canvas.height = height;

      // Desenhar o SVG no canvas
      ctx.drawImage(svgImage, 0, 0, width, height);

      // Converter o conteúdo do canvas para um URL de imagem (por exemplo, PNG)
      const imageUrl = canvas.toDataURL("image/png");

      // Criar um link de download e disparar o clique para baixar a imagem
      const a = document.createElement("a");
      a.href = imageUrl;
      a.download = "network-graph.png"; // nome do arquivo para download
      a.click();

      // Liberar a URL do objeto quando não for mais necessária
      window.URL.revokeObjectURL(svgUrl);
    }
  };
}
</script>

<template>
  <div
    class="flex flex-row h-14 items-center justify-start overflow-hidden container-block w-fit absolute top-6 z-[2] left-14"
  >
    <NuxtLink
      class="flex w-14 h-14 items-center justify-center bg-[#E7E7E7] rounded-full"
      to="/dashboard"
    >
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="user-circle 1" clip-path="url(#clip0_44_3)">
          <path
            id="Vector"
            d="M6.25 28C6.25 30.8563 6.81258 33.6845 7.90562 36.3234C8.99866 38.9622 10.6008 41.3599 12.6204 43.3796C14.6401 45.3992 17.0378 47.0013 19.6766 48.0944C22.3155 49.1874 25.1437 49.75 28 49.75C30.8563 49.75 33.6845 49.1874 36.3234 48.0944C38.9622 47.0013 41.3599 45.3992 43.3796 43.3796C45.3992 41.3599 47.0013 38.9622 48.0944 36.3234C49.1874 33.6845 49.75 30.8563 49.75 28C49.75 25.1437 49.1874 22.3155 48.0944 19.6766C47.0013 17.0378 45.3992 14.6401 43.3796 12.6204C41.3599 10.6008 38.9622 8.99866 36.3234 7.90562C33.6845 6.81258 30.8563 6.25 28 6.25C25.1437 6.25 22.3155 6.81258 19.6766 7.90562C17.0378 8.99866 14.6401 10.6008 12.6204 12.6204C10.6008 14.6401 8.99866 17.0378 7.90562 19.6766C6.81258 22.3155 6.25 25.1437 6.25 28Z"
            fill="white"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="Vector_2"
            d="M20.75 23.1665C20.75 25.0893 21.5138 26.9334 22.8735 28.293C24.2331 29.6527 26.0772 30.4165 28 30.4165C29.9228 30.4165 31.7669 29.6527 33.1265 28.293C34.4862 26.9334 35.25 25.0893 35.25 23.1665C35.25 21.2437 34.4862 19.3996 33.1265 18.04C31.7669 16.6803 29.9228 15.9165 28 15.9165C26.0772 15.9165 24.2331 16.6803 22.8735 18.04C21.5138 19.3996 20.75 21.2437 20.75 23.1665Z"
            stroke="#363636"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            id="Vector_3"
            d="M13.906 44.5516C14.5041 42.5608 15.7281 40.8159 17.3963 39.5756C19.0644 38.3354 21.088 37.6659 23.1667 37.6665H32.8333C34.9147 37.6658 36.9407 38.3369 38.6101 39.58C40.2795 40.8231 41.503 42.5718 42.0988 44.5661"
            stroke="#363636"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_44_3">
            <rect
              width="58"
              height="58"
              fill="white"
              transform="translate(-1 -1)"
            />
          </clipPath>
        </defs>
      </svg>
    </NuxtLink>
    <div class="flex -mx-[5px]">
      <svg
        width="14"
        height="30"
        viewBox="0 0 14 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect y="6" width="13" height="18" fill="#E7E7E7" />
        <path
          d="M7 5C3.7999 5.125 0.5 0 0.5 0L3 6L7 8L11 6L13 0C13 0 10.0478 4.88095 7 5Z"
          fill="#E7E7E7"
        />
        <path
          d="M7 24C3.7999 23.875 0 28.5 0 28.5L2 21L7 19.5L11.5 21L13.5 29.5C13.5 29.5 10.0478 24.1191 7 24Z"
          fill="#E7E7E7"
        />
      </svg>
    </div>
    <div class="flex flex-col h-full p-1.5 rounded-full w-full bg-[#E7E7E7]">
      <div
        class="flex flex-row px-4 py-2 justify-between items-center bg-white w-full h-full rounded-full sp"
      >
        <div class="flex flex-row items-center gap-2 max-w-full w-full">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="circles 1" clip-path="url(#clip0_39_28)">
              <path
                id="Vector"
                d="M8 7C8 8.06087 8.42143 9.07828 9.17157 9.82843C9.92172 10.5786 10.9391 11 12 11C13.0609 11 14.0783 10.5786 14.8284 9.82843C15.5786 9.07828 16 8.06087 16 7C16 5.93913 15.5786 4.92172 14.8284 4.17157C14.0783 3.42143 13.0609 3 12 3C10.9391 3 9.92172 3.42143 9.17157 4.17157C8.42143 4.92172 8 5.93913 8 7Z"
                stroke="#363636"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                id="Vector_2"
                d="M2.5 17C2.5 18.0609 2.92143 19.0783 3.67157 19.8284C4.42172 20.5786 5.43913 21 6.5 21C7.56087 21 8.57828 20.5786 9.32843 19.8284C10.0786 19.0783 10.5 18.0609 10.5 17C10.5 15.9391 10.0786 14.9217 9.32843 14.1716C8.57828 13.4214 7.56087 13 6.5 13C5.43913 13 4.42172 13.4214 3.67157 14.1716C2.92143 14.9217 2.5 15.9391 2.5 17Z"
                stroke="#363636"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                id="Vector_3"
                d="M13.5 17C13.5 18.0609 13.9214 19.0783 14.6716 19.8284C15.4217 20.5786 16.4391 21 17.5 21C18.5609 21 19.5783 20.5786 20.3284 19.8284C21.0786 19.0783 21.5 18.0609 21.5 17C21.5 15.9391 21.0786 14.9217 20.3284 14.1716C19.5783 13.4214 18.5609 13 17.5 13C16.4391 13 15.4217 13.4214 14.6716 14.1716C13.9214 14.9217 13.5 15.9391 13.5 17Z"
                stroke="#363636"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_39_28">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <h3
            class="text-[color:var(--dark,#363636)] [font-family:Inter] text-lg font-semibold leading-[normal] overflow-hidden text-ellipsis whitespace-nowrap max-w-64"
          >
            {{ circuit?.name }}
          </h3>
        </div>
        <div class="ml-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="chevron-down 1" clip-path="url(#clip0_39_34)">
              <path
                id="Vector"
                d="M6 9L12 15L18 9"
                stroke="#363636"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_39_34">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
    </div>
    <div class="flex -mx-[5px]">
      <svg
        width="14"
        height="30"
        viewBox="0 0 14 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect y="6" width="13" height="18" fill="#E7E7E7" />
        <path
          d="M7 5C3.7999 5.125 0.5 0 0.5 0L3 6L7 8L11 6L13 0C13 0 10.0478 4.88095 7 5Z"
          fill="#E7E7E7"
        />
        <path
          d="M7 24C3.7999 23.875 0 28.5 0 28.5L2 21L7 19.5L11.5 21L13.5 29.5C13.5 29.5 10.0478 24.1191 7 24Z"
          fill="#E7E7E7"
        />
      </svg>
    </div>
    <div
      class="flex w-full h-full items-center justify-center bg-[#E7E7E7] rounded-full px-[6px] gap-[3px]"
    >
      <div
        class="flex w-11 h-11 bg-white rounded-full items-center justify-center cursor-pointer hover:bg-zinc-950 hover:text-white duration-300 transition-colors"
        @click="saveCircuit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          >
            <path
              d="M6 4h10l4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"
            />
            <path d="M10 14a2 2 0 1 0 4 0a2 2 0 1 0-4 0m4-10v4H8V4" />
          </g>
        </svg>
      </div>
      <div
        class="flex w-11 h-11 bg-white rounded-full items-center justify-center cursor-pointer hover:bg-zinc-950 hover:text-white duration-300 transition-colors"
        @click="exportImage"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          >
            <path
              d="M15 8h.01M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z"
            />
            <path d="m3 16l5-5c.928-.893 2.072-.893 3 0l5 5" />
            <path d="m14 14l1-1c.928-.893 2.072-.893 3 0l3 3" />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>
