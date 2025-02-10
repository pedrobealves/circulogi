<template>
  <div class="md:hidden"></div>

  <div
    class="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
  >
    <slot name="link" />
    <div
      class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex"
    >
      <div class="absolute inset-0 bg-zinc-900" />
      <NuxtLink
        to="/"
        class="relative z-20 flex items-center text-lg font-medium"
      >
        circulogi
      </NuxtLink>
    </div>
    <div class="lg:p-8">
      <slot name="forms" />
    </div>
  </div>
</template>
