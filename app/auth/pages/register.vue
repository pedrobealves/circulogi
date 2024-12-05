<script setup lang="ts">
import { ref } from "vue";
import { registerSchema } from "@/auth/schemas/register";
import { buttonVariants } from "@/common/components/ui/button";
import { cn } from "@/common/lib/utils";

import AuthLayout from "@/auth/components/AuthHero.vue";
import { toast } from "~/common/components/ui/toast";

const { auth } = useSupabaseClient();
const isLoading = ref(false);

function onSubmit(event: { [x: string]: any }) {
  const values = event as { email: any; password: any };
  isLoading.value = true;
  auth
    .signUp({
      email: values.email,
      password: values.password,
    })
    .then(() => {
      toast({
        title: "Success",
        description: "Please check your email to confirm your account.",
      });
    })
    .catch((error) => {
      toast({
        title: "Error",
        description: error.message,
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
}

const redirectTo = `${useRuntimeConfig().public.baseUrl}/dashboard`;

function handleGitHubAuth() {
  auth
    .signInWithOAuth({
      provider: "github",
      options: { redirectTo: "/dashboard" },
    })
    .then(() => {
      navigateTo("/dashboard");
    })
    .catch((error) => {
      console.error("Authentication failed:", error);
    });
}

function handleGoogleAuth() {
  auth
    .signInWithOAuth({
      provider: "google",
      options: { redirectTo: "/dashboard" },
    })
    .then(() => {
      navigateTo("/dashboard");
    })
    .catch((error) => {
      console.error("Authentication failed:", error);
    });
}

definePageMeta({ middleware: "auth" });
</script>

<template>
  <AuthLayout>
    <template v-slot:link>
      <a
        href="/login"
        :class="
          cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute right-4 top-4 md:right-8 md:top-8'
          )
        "
      >
        {{ $t("login.name") }}
      </a>
    </template>
    <template v-slot:forms>
      <div class="flex flex-col justify-center space-y-6 sm:w-[350px] mx-auto">
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">
            {{ $t("register.title") }}
          </h1>
          <p class="text-sm text-muted-foreground">
            {{ $t("register.description") }}
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
          :submitButtonText="$t('register.name')"
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
