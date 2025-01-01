<script setup lang="ts">
definePageMeta({
  layout: "main-layout",
});

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/common/components/ui/breadcrumb";
</script>

<template>
  <SettingsFormsLayout>
    <SettingsAccountForm />
  </SettingsFormsLayout>
</template>
