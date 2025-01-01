<script setup lang="ts">
import { useSimulationStore } from "~/simulation/stores/simulation";

const circuitStore = useSimulationStore();
const circuit = computed(() => circuitStore.circuit);

function saveCircuit() {
  circuitStore.save();
}

async function exportImage() {
  const graph: any = circuitStore.graph;
  if (!graph.value) return;

  try {
    const svgText = await graph.value.exportAsSvgText();
    await convertAndDownloadImage(svgText);
  } catch (error) {
    console.error("Error exporting image:", error);
  }
}

async function convertAndDownloadImage(svgText: string) {
  const svgImage = new Image();
  const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
  const svgUrl = URL.createObjectURL(svgBlob);

  svgImage.src = svgUrl;
  svgImage.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = svgImage.width;
    canvas.height = svgImage.height;
    ctx.drawImage(svgImage, 0, 0, svgImage.width, svgImage.height);

    const imageUrl = canvas.toDataURL("image/png");
    downloadImage(imageUrl);
    URL.revokeObjectURL(svgUrl);
  };
}

function downloadImage(imageUrl: string) {
  const a = document.createElement("a");
  a.href = imageUrl;
  a.download = "network-graph.png";
  a.click();
}
</script>

<template>
  <div
    class="flex flex-row h-14 items-center justify-start container-block w-fit absolute top-6 z-[2] left-14"
  >
    <TopBarProfileLink />
    <TopBarDivider />
    <TopBarCircuitInfo :name="circuit?.name" />
    <TopBarDivider />
    <TopBarActions @save="saveCircuit" @export="exportImage" />
  </div>
</template>
