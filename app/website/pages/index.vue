<script setup lang="ts">
import { Circle } from "lucide-vue-next";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
} from "lucide-vue-next";

const footerLinks = {
  product: [
    { name: "Funcionalidades", href: "#" },
    { name: "Documentação", href: "#" },
  ],
  company: [
    { name: "Sobre Nós", href: "#" },
    { name: "Contato", href: "#" },
  ],
  legal: [
    { name: "Política de Privacidade", href: "#" },
    { name: "Termos de Uso", href: "#" },
    { name: "Licença", href: "#" },
  ],
};

const user = useSupabaseUser();

watchEffect(() => {
  if (user.value) {
    return navigateTo("/dashboard");
  }
});
</script>
<template>
  <header class="container z-40 bg-background">
    <div class="flex h-20 items-center justify-between py-6">
      <div class="flex gap-6 md:gap-10">
        <a class="hidden items-center space-x-2 md:flex" href="/">
          <span class="hidden font-bold sm:inline-block">circulogi</span>
        </a>
        <nav class="hidden gap-6 md:flex">
          <a
            class="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm text-foreground/60"
            href="/docs"
            >Documentação</a
          >
          <a
            class="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm text-foreground/60"
            href="/docs"
            to="https://github.com/pedrobealves"
            >Contato</a
          >
        </nav>
        <button class="flex items-center space-x-2 md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-command"
          >
            <path
              d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"
            ></path>
          </svg>
          <span class="font-bold">Menu</span>
        </button>
      </div>
      <nav>
        <NuxtLink
          to="/login"
          class="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 rounded-md px-4"
          href="/login"
          >Entrar</NuxtLink
        >
      </nav>
    </div>
  </header>
  <section class="py-32">
    <div class="container">
      <div class="grid items-center gap-8 lg:grid-cols-2">
        <div
          class="flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <div
            class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
          >
            ✨ Simule Circuitos Digitais<svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-arrow-up-right ml-2 size-4"
            >
              <path d="M7 7h10v10"></path>
              <path d="M7 17 17 7"></path>
            </svg>
          </div>
          <h1 class="my-6 text-pretty text-4xl font-bold lg:text-6xl">
            Crie e simule circuitos digitais com Grafos
          </h1>
          <p class="mb-8 max-w-xl text-muted-foreground lg:text-xl">
            Circulogi é um simulador online de circuitos digitais baseado em
            grafos direcionados, tornando mais fácil projetar, analisar e
            entender o comportamento de circuitos combinacionais e sequenciais.
          </p>
          <div
            class="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start"
          >
            <NuxtLink
              to="/dashboard"
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full sm:w-auto"
              >Acessar Simulador</NuxtLink
            ><a
              href="https://www.shadcnblocks.com"
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full sm:w-auto"
              to="https://github.com/pedrobealves/circulogi"
              >Ver no GitHub<svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-arrow-right size-4"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path></svg
            ></a>
          </div>
        </div>
        <img
          src="/img/placeholder-1.svg"
          alt="Hero section demo image showing interface components"
          class="max-h-96 w-full rounded-md object-cover"
        />
      </div>
    </div>
  </section>
  <section
    class="relative w-full flex items-center bg-white py-8 md:py-16 lg:py-24"
  >
    <div class="container mx-auto px-4 md:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between gap-12 lg:gap-40">
        <!-- Brand Column -->
        <div class="space-y-6 max-w-[300px]">
          <div class="flex items-center space-x-2">
            <span class="text-xl font-bold">circulogi</span>
          </div>
          <p class="text-muted-foreground">
            Simule e compreenda circuitos digitais com a precisão e
            flexibilidade dos grafos. Explore o futuro da eletrônica digital!
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
          <!-- Product Links -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold">Projeto</h3>
            <ul class="space-y-3">
              <li v-for="link in footerLinks.product" :key="link.name">
                <a
                  :href="link.href"
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  {{ link.name }}
                </a>
              </li>
            </ul>
          </div>
          <!-- Company Links -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold">Recursos</h3>
            <ul class="space-y-3">
              <li v-for="link in footerLinks.company" :key="link.name">
                <a
                  :href="link.href"
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  {{ link.name }}
                </a>
              </li>
            </ul>
          </div>
          <!-- Legal Links -->
          <div class="space-y-6">
            <h3 class="text-lg font-semibold">Legal</h3>
            <ul class="space-y-3">
              <li v-for="link in footerLinks.legal" :key="link.name">
                <a
                  :href="link.href"
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  {{ link.name }}
                </a>
              </li>
            </ul>
            <!-- Social Links -->
            <div class="flex gap-4 pt-4">
              <a
                v-for="social in socialLinks"
                :key="social.href"
                :href="social.href"
                class="text-muted-foreground hover:text-primary transition-colors"
              >
                <component :is="social.icon" class="size-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t mt-16 pt-8">
        <div
          class="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p class="text-sm text-muted-foreground">
            © {{ new Date().getFullYear() }} Circulogi. Simulação de circuitos
            digitais.
          </p>
          <div class="flex items-center gap-4">
            <a
              href="#"
              class="text-sm text-muted-foreground hover:text-primary transition-colors"
              >Política de Privacidade</a
            >
            <a
              href="#"
              class="text-sm text-muted-foreground hover:text-primary transition-colors"
              >Termos de Uso</a
            >
            <a
              href="#"
              class="text-sm text-muted-foreground hover:text-primary transition-colors"
              >Política de Cookies</a
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
