import { useSimulationStore } from "@/simulation/stores/simulation";

export function useSaveThumbnail() {
  const simulationStore = useSimulationStore();

  async function uploadThumbnail() {
    if (!simulationStore.graph) return;
    const svgText = await simulationStore.graph.exportAsSvgText();

    // Criar um elemento <img> temporário para carregar o SVG
    const svgImage = new Image();
    const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(svgBlob);
    svgImage.src = svgUrl;

    // Quando a imagem estiver carregada, desenhá-la no canvas e exportar como PNG
    svgImage.onload = () => {
      // Criar o canvas e desenhar a imagem
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = svgImage.width;
      canvas.height = svgImage.height;

      if (ctx) {
        ctx.drawImage(svgImage, 0, 0, svgImage.width, svgImage.height);

        canvas.toBlob(async (blob) => {
          if (blob) {
            const formData = new FormData();
            formData.append("file", blob);
            formData.append("name", simulationStore.circuit?.id || "");
            formData.append("path", "circuits");
            formData.append("user", simulationStore.circuit?.userId || "");

            try {
              const response = await $fetch("/api/v1/circuits/image", {
                method: "POST",
                body: formData,
              });

              await $fetch(`/api/v1/circuits/${simulationStore.circuit?.id}`, {
                method: "PUT",
                body: {
                  thumbnail: response.url,
                },
              });
            } catch (err) {
            } finally {
              URL.revokeObjectURL(svgUrl);
            }
          }
        }, "image/png");
      }
    };
  }

  async function exportImage() {
    const graph: any = simulationStore.graph;
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

  return { uploadThumbnail, exportImage };
}
