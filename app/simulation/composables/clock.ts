import { ref, onUnmounted } from "vue";

export function useInterval(callback: { (): void; (): void }, delay = 1000) {
  const isRunning = ref(false); // Estado para verificar se o intervalo está ativo
  let intervalId: string | number | NodeJS.Timeout | null | undefined = null;

  // Iniciar o intervalo
  const start = () => {
    if (!isRunning.value) {
      isRunning.value = true;
      intervalId = setInterval(() => {
        callback();
      }, delay);
    }
  };

  // Parar o intervalo
  const stop = () => {
    if (isRunning.value) {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
      intervalId = null;
      isRunning.value = false;
    }
  };

  // Garantir que o intervalo seja limpo ao desmontar o componente
  onUnmounted(() => {
    stop();
  });

  return { isRunning, start, stop };
}
