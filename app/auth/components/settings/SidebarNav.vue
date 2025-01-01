<script setup lang="ts">
import { Button } from "@/common/components/ui/button";
import { cn } from "@/lib/utils";

interface Item {
  title: string;
  href: string;
}

const $route = useRoute();

const sidebarNavItems: Item[] = [
  {
    title: "Profile",
    href: "/settings/profile",
  },
  {
    title: "Account",
    href: "/settings/account",
  },
];
</script>

<template>
  <nav class="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
    <NuxtLink v-for="item in sidebarNavItems" :key="item.title" :to="item.href">
      <Button
        variant="ghost"
        class="w-full text-left justify-start"
        :class="[$route.path === item.href && 'bg-muted hover:bg-muted']"
      >
        {{ item.title }}
      </Button>
    </NuxtLink>
  </nav>
</template>
