import { ref, onUnmounted } from "vue";

export function useInterval(callback: () => void, delay = 1000) {
  const isRunning = ref(false);
  let intervalId: NodeJS.Timeout | null = null;

  const start = () => {
    if (!isRunning.value) {
      isRunning.value = true;
      intervalId = setInterval(callback, delay);
    }
  };

  const stop = () => {
    if (isRunning.value && intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
      isRunning.value = false;
    }
  };

  onUnmounted(() => {
    stop();
  });

  return { isRunning, start, stop };
}
