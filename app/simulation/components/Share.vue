<script setup lang="ts">
import { Button } from "@/common/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/common/components/ui/dialog";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Copy } from "lucide-vue-next";

import IconPlus from "~icons/lucide/plus";
import { useCircuitStore } from "../stores/circuit";

const circuitStore = useCircuitStore();

const link = computed(() => {
  const hostname: String = "https://circulogi.pedrobernardi.com"; // Garantir que o hostname não seja undefined
  const circuitId = circuitStore.circuit?.id || ""; // Garantir que o id do circuito não seja undefined
  return `${hostname}/circuit/${circuitId}`;
});

// Função para copiar o texto para a área de transferência
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(link.value); // Copia o conteúdo do input
  } catch (error) {
    console.error("Erro ao copiar o texto: ", error);
  }
};
</script>

<template>
  <Dialog>
    <div
      class="flex flex-row h-14 items-center justify-start overflow-hidden container-block w-fit absolute z-[2] -translate-x-1/2 right-14 top-14"
    >
      <DialogTrigger as-child>
        <div
          class="flex bg-white rounded-full items-center justify-center cursor-pointer h-14 w-14 p-[6px]"
        >
          <IconPlus class="w-8" />
        </div>
      </DialogTrigger>
    </div>
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Share link</DialogTitle>
        <DialogDescription>
          Anyone who has this link will be able to view this.
        </DialogDescription>
      </DialogHeader>
      <div class="flex items-center space-x-2">
        <div class="grid flex-1 gap-2">
          <Label for="link" class="sr-only"> Link </Label>
          <Input id="link" v-model="link" read-only />
        </div>
        <Button type="submit" size="sm" class="px-3" @click="copyToClipboard">
          <span class="sr-only">Copy</span>
          <Copy class="w-4 h-4 text-cyan-50" />
        </Button>
      </div>
      <DialogFooter class="sm:justify-start">
        <DialogClose as-child>
          <Button type="button" variant="secondary"> Close </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
