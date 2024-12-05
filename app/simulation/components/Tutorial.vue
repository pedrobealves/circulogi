<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/common/components/ui/dialog";

import IconTutorial from "~icons/fa6-solid/question";
</script>

<template>
  <Dialog>
    <div
      class="flex flex-row h-14 items-center justify-start overflow-hidden container-block w-fit absolute z-[2] -translate-x-1/2 right-14 bottom-14"
    >
      <DialogTrigger as-child>
        <div
          class="flex bg-white rounded-full items-center justify-center cursor-pointer h-14 w-14 p-[6px]"
        >
          <IconTutorial class="w-8" />
        </div>
      </DialogTrigger>
    </div>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Ajuda</DialogTitle>
        <DialogDescription>
          Valores que representam estados do circuito.
        </DialogDescription>
      </DialogHeader>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <span class="h-4 w-4 bg-[#00AA11] rounded-full" />
          <p>Ligado</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="h-4 w-4 bg-[#FF4D4D] rounded-full" />
          <p>Desligado</p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
