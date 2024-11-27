<script setup lang="ts">
import { ref } from "vue";
import { registerSchema } from "@/auth/schemas/register";
import { toast } from "@/common/components/ui/toast";
import { buttonVariants } from "@/common/components/ui/button";
import { cn } from "@/lib/utils";

import AuthForm from "@/auth/components/AuthForm.vue";
import SocialAuthButtons from "@/auth/components/SocialAuthButtons.vue";
import TermsAndPrivacy from "@/auth/components/TermsAndPrivacy.vue";
import AuthLayout from "@/auth/components/AuthHero.vue";

const { auth } = useSupabaseClient();
const isLoading = ref(false);

function onSubmit(event: { [x: string]: any }) {
  const values = event as { email: string; password: string };
  isLoading.value = true;

  auth
    .signInWithPassword({
      email: values.email,
      password: values.password,
    })
    .then((result) => {
      if (result.error) {
        // Tratando erros vindos da resposta
        throw new Error(result.error.message);
      }

      // Login bem-sucedido
      toast({
        title: "Success",
        description: "Login successful! Redirecting...",
      });

      // Redirecionar após login bem-sucedido
      navigateTo("/dashboard");
    })
    .catch((error) => {
      // Exibir o erro no toast
      toast({
        title: "Error",
        variant: "destructive",
        description: error.message,
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
}

const redirectTo = `${useRuntimeConfig().public.baseUrl}/confirm`;

function handleGitHubAuth() {
  auth.signInWithOAuth({ provider: "github", options: { redirectTo } });
}

function handleGoogleAuth() {
  auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
}

definePageMeta({ middleware: "auth" });
</script>

<template>
  <AuthLayout>
    <template v-slot:link>
      <a
        href="/register"
        :class="
          cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute right-4 top-4 md:right-8 md:top-8'
          )
        "
      >
        {{ $t("register.name") }}
      </a>
    </template>
    <template v-slot:forms>
      <div class="flex flex-col justify-center space-y-6 sm:w-[350px] mx-auto">
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">
            {{ $t("login.title") }}
          </h1>
          <p class="text-sm text-muted-foreground">
            {{ $t("login.description") }}
          </p>
        </div>
        <AuthForm
          :schema="registerSchema"
          :onSubmit="onSubmit"
          :field-config="{
            email: {
              label: $t('email'),
              inputProps: { type: 'email', placeholder: $t('email') },
            },
            password: {
              label: $t('password'),
              inputProps: { type: 'password', placeholder: $t('password') },
            },
          }"
          :isLoading="isLoading"
          :submitButtonText="$t('login.name')"
        />
        <SocialAuthButtons
          :isLoading="isLoading"
          :onGitHubAuth="handleGitHubAuth"
          :onGoogleAuth="handleGoogleAuth"
        />
        <TermsAndPrivacy />
      </div>
    </template>
  </AuthLayout>
</template>
