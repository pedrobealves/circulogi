<script setup lang="ts">
import { buttonVariants } from '@/common/components/ui/button'
import { cn } from '@/common/lib/utils'
import { AlertDialogAction, type AlertDialogActionProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<AlertDialogActionProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <AlertDialogAction v-bind="delegatedProps" :class="cn(buttonVariants(), props.class)">
    <slot />
  </AlertDialogAction>
</template>
