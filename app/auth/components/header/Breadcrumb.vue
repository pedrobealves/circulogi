<script setup lang="ts">
import { Breadcrumb, BreadcrumbList } from "@/common/components/ui/breadcrumb";

import { Separator } from "@/common/components/ui/separator";
import { SidebarTrigger } from "@/common/components/ui/sidebar";
</script>

<template>
  <header
    class="flex px-8 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
  >
    <div class="flex items-center gap-2 px-4 w-full">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <slot name="breadcrumb"></slot>
        </BreadcrumbList>
      </Breadcrumb>
      <slot name="button"></slot>
    </div>
  </header>
</template>
