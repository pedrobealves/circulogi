import { ref, onUnmounted } from "vue";

export function useInterval(callback, delay = 1000) {
  const isRunning = ref(false); // Estado para verificar se o intervalo está ativo
  let intervalId = null;

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
      clearInterval(intervalId);
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
