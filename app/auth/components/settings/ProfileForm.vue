<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/common/components/ui/form";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";
import { Separator } from "@/common/components/ui/separator";
import { Textarea } from "@/common/components/ui/textarea";

import { toast } from "@/common/components/ui/toast";
import { cn } from "@/lib/utils";
import { toTypedSchema } from "@vee-validate/zod";
import { FieldArray, useForm } from "vee-validate";
import { h, ref } from "vue";
import * as z from "zod";

const usedLogged = useSupabaseUser();

const verifiedEmails = ref([usedLogged.value?.email]);

const user = {
  username: usedLogged.value?.user_metadata.name,
  email: usedLogged.value?.email,
};

const profileFormSchema = toTypedSchema(
  z.object({
    username: z
      .string()
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .max(30, {
        message: "Username must not be longer than 30 characters.",
      }),
    email: z
      .string({
        required_error: "Please select an email to display.",
      })
      .email(),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: profileFormSchema,
  initialValues: {
    username: user.username, // Nome atual
    email: user.email, // Email atual
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await $fetch(`/api/v1/users`, {
      method: "PUT",
      body: JSON.stringify(values),
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
  } finally {
    toast({
      title: "Perfil atualizado com sucesso!",
    });
  }
});
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">Profile</h3>
    <p class="text-sm text-muted-foreground">
      This is how others will see you on the site.
    </p>
  </div>
  <Separator />
  <form class="space-y-8" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="username">
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input type="text" placeholder="shadcn" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          This is your public display name. It can be your real name or a
          pseudonym.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>

        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select an email" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="email in verifiedEmails"
                :key="email"
                :value="email"
              >
                {{ email }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormDescription>
          You can manage verified email addresses in your email settings.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="flex gap-2 justify-start">
      <Button type="submit"> Update profile </Button>

      <Button type="button" variant="outline" @click="resetForm">
        Reset form
      </Button>
    </div>
  </form>
</template>
